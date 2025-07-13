import React, { useState, useRef, useCallback, useEffect } from 'react';
import MapGL, { MapRef, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Store, Floor, MapElement } from '../../types';
import { useMapStore } from '../../store/mapStore';
import { saveFloor, geocodeAddress } from '../../services/firestoreService';
import { v4 as uuidv4 } from 'uuid';
import { 
  Save, Plus, Trash2, Move, Square, Circle as CircleIcon, 
  MapPin, Undo, Redo, Grid, RotateCw, Edit3 
} from 'lucide-react';
import { MAPBOX_TOKEN } from '../../config/mapbox';

interface MapboxMapEditorProps {
  store: Store;
  floors: Floor[];
  onFloorsUpdate: () => void;
}

interface DrawingState {
  isDrawing: boolean;
  currentTool: 'select' | 'wall' | 'rack' | 'obstacle' | 'poi';
  points: [number, number][];
  previewPoint: [number, number] | null;
}

export const MapboxMapEditor: React.FC<MapboxMapEditorProps> = ({ 
  store, 
  floors, 
  onFloorsUpdate 
}) => {
  const {
    currentFloor,
    selectedElement,
    setCurrentFloor,
    setSelectedElement,
    addElement,
    updateElement,
    removeElement
  } = useMapStore();

  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 18,
    bearing: 0,
    pitch: 0
  });

  const [currentFloorName, setCurrentFloorName] = useState('');
  const [showFloorForm, setShowFloorForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    currentTool: 'select',
    points: [],
    previewPoint: null
  });
  const [history, setHistory] = useState<Floor[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [editingElement, setEditingElement] = useState<MapElement | null>(null);

  const mapRef = useRef<MapRef>(null);

  // Geocode store address and center map
  useEffect(() => {
    const centerMapOnStore = async () => {
      try {
        const coords = await geocodeAddress(store.address);
        if (coords) {
          setViewState(prev => ({
            ...prev,
            longitude: coords.lng,
            latitude: coords.lat
          }));
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    };

    centerMapOnStore();
  }, [store.address]);

  // Add to history when floor changes
  useEffect(() => {
    if (currentFloor) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ ...currentFloor });
        return newHistory.slice(-20); // Keep last 20 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 19));
    }
  }, [currentFloor?.elements]);

  const snapCoordinate = useCallback((coord: number) => {
    if (!snapToGrid) return coord;
    const gridSize = 0.0001; // Adjust based on zoom level
    return Math.round(coord / gridSize) * gridSize;
  }, [snapToGrid]);

  const handleMapClick = useCallback((event: any) => {
    if (!currentFloor) return;

    const { lng, lat } = event.lngLat;
    const snappedLng = snapCoordinate(lng);
    const snappedLat = snapCoordinate(lat);

    if (drawingState.currentTool === 'select') {
      setSelectedElement(null);
      return;
    }

    if (drawingState.currentTool === 'wall') {
      if (!drawingState.isDrawing) {
        // Start drawing wall
        setDrawingState({
          ...drawingState,
          isDrawing: true,
          points: [[snappedLng, snappedLat]]
        });
      } else {
        // Add point to wall
        const newPoints = [...drawingState.points, [snappedLng, snappedLat]];
        setDrawingState({
          ...drawingState,
          points: newPoints
        });
      }
    } else {
      // For racks, obstacles, POIs - create immediately
      const newElement: MapElement = {
        id: uuidv4(),
        type: drawingState.currentTool as any,
        name: `${drawingState.currentTool}-${currentFloor.elements.length + 1}`,
        position: { x: snappedLng, y: snappedLat },
        size: { 
          width: drawingState.currentTool === 'rack' ? 0.0002 : 0.0001, 
          height: drawingState.currentTool === 'rack' ? 0.0001 : 0.0001 
        },
        rotation: 0,
        properties: {
          coordinates: drawingState.currentTool === 'obstacle' || drawingState.currentTool === 'poi' 
            ? [[snappedLng, snappedLat]] 
            : [
                [snappedLng, snappedLat],
                [snappedLng + 0.0002, snappedLat],
                [snappedLng + 0.0002, snappedLat + 0.0001],
                [snappedLng, snappedLat + 0.0001],
                [snappedLng, snappedLat]
              ]
        }
      };

      addElement(newElement);
      setDrawingState({
        ...drawingState,
        currentTool: 'select'
      });
    }
  }, [currentFloor, drawingState, snapCoordinate, addElement, setSelectedElement]);

  const handleMapDoubleClick = useCallback(() => {
    if (drawingState.isDrawing && drawingState.currentTool === 'wall' && drawingState.points.length >= 2) {
      // Finish drawing wall
      const newElement: MapElement = {
        id: uuidv4(),
        type: 'wall',
        name: `wall-${currentFloor?.elements.length || 0 + 1}`,
        position: { x: drawingState.points[0][0], y: drawingState.points[0][1] },
        size: { width: 0.0001, height: 0.0001 },
        rotation: 0,
        properties: {
          coordinates: [...drawingState.points, drawingState.points[0]] // Close the polygon
        }
      };

      addElement(newElement);
      setDrawingState({
        isDrawing: false,
        currentTool: 'select',
        points: [],
        previewPoint: null
      });
    }
  }, [drawingState, currentFloor, addElement]);

  const handleMouseMove = useCallback((event: any) => {
    if (drawingState.isDrawing && drawingState.currentTool === 'wall') {
      const { lng, lat } = event.lngLat;
      setDrawingState(prev => ({
        ...prev,
        previewPoint: [snapCoordinate(lng), snapCoordinate(lat)]
      }));
    }
  }, [drawingState.isDrawing, drawingState.currentTool, snapCoordinate]);

  const handleFloorSelect = (floor: Floor) => {
    setCurrentFloor(floor);
    setSelectedElement(null);
    setDrawingState({
      isDrawing: false,
      currentTool: 'select',
      points: [],
      previewPoint: null
    });
  };

  const handleCreateFloor = async () => {
    if (!currentFloorName.trim()) return;

    const newFloor: Floor = {
      id: '',
      name: currentFloorName,
      level: floors.length + 1,
      elements: [],
      storeId: store.id,
    };

    try {
      await saveFloor(newFloor);
      setCurrentFloorName('');
      setShowFloorForm(false);
      onFloorsUpdate();
    } catch (error) {
      console.error('Error creating floor:', error);
    }
  };

  const handleSave = async () => {
    if (!currentFloor) return;

    setSaving(true);
    try {
      await saveFloor(currentFloor);
      onFloorsUpdate();
    } catch (error) {
      console.error('Error saving floor:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFloor(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFloor(history[historyIndex + 1]);
    }
  };

  const handleElementEdit = (element: MapElement) => {
    setEditingElement(element);
    setSelectedElement(element);
  };

  const handleElementUpdate = (updates: Partial<MapElement>) => {
    if (selectedElement) {
      updateElement(selectedElement.id, updates);
      if (editingElement) {
        setEditingElement({ ...editingElement, ...updates });
      }
    }
  };

  const handleElementDelete = () => {
    if (selectedElement) {
      removeElement(selectedElement.id);
      setSelectedElement(null);
      setEditingElement(null);
    }
  };

  const tools = [
    { id: 'select', label: 'Select', icon: Move },
    { id: 'wall', label: 'Wall', icon: Edit3 },
    { id: 'rack', label: 'Rack', icon: Square },
    { id: 'obstacle', label: 'Obstacle', icon: CircleIcon },
    { id: 'poi', label: 'POI', icon: MapPin },
  ];

  // Generate GeoJSON for current floor elements
  const generateGeoJSON = () => {
    if (!currentFloor) return null;

    const features = currentFloor.elements.map(element => ({
      type: 'Feature' as const,
      id: element.id,
      properties: {
        name: element.name,
        type: element.type,
        selected: selectedElement?.id === element.id
      },
      geometry: {
        type: element.type === 'obstacle' || element.type === 'poi' ? 'Point' : 'Polygon',
        coordinates: element.type === 'obstacle' || element.type === 'poi'
          ? [element.position.x, element.position.y]
          : [element.properties?.coordinates || [
              [element.position.x, element.position.y],
              [element.position.x + element.size.width, element.position.y],
              [element.position.x + element.size.width, element.position.y + element.size.height],
              [element.position.x, element.position.y + element.size.height],
              [element.position.x, element.position.y]
            ]]
      }
    }));

    // Add drawing preview for walls
    if (drawingState.isDrawing && drawingState.currentTool === 'wall' && drawingState.points.length > 0) {
      const previewPoints = [...drawingState.points];
      if (drawingState.previewPoint) {
        previewPoints.push(drawingState.previewPoint);
      }

      features.push({
        type: 'Feature',
        id: 'preview',
        properties: { name: 'preview', type: 'wall-preview', selected: false },
        geometry: {
          type: 'LineString',
          coordinates: previewPoints
        }
      });
    }

    return {
      type: 'FeatureCollection' as const,
      features
    };
  };

  const geoJsonData = generateGeoJSON();

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Floor Selector */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Floors</h3>
            <div className="space-y-2">
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => handleFloorSelect(floor)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentFloor?.id === floor.id
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{floor.name}</div>
                  <div className="text-sm text-gray-500">Level {floor.level}</div>
                </button>
              ))}
              
              {showFloorForm ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentFloorName}
                    onChange={(e) => setCurrentFloorName(e.target.value)}
                    placeholder="Floor name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateFloor}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowFloorForm(false)}
                      className="bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowFloorForm(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Floor
                </button>
              )}
            </div>
          </div>

          {/* Tools */}
          {currentFloor && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Drawing Tools</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {tools.map((toolItem) => {
                  const Icon = toolItem.icon;
                  return (
                    <button
                      key={toolItem.id}
                      onClick={() => setDrawingState(prev => ({ 
                        ...prev, 
                        currentTool: toolItem.id as any,
                        isDrawing: false,
                        points: [],
                        previewPoint: null
                      }))}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                        drawingState.currentTool === toolItem.id
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {toolItem.label}
                    </button>
                  );
                })}
              </div>

              {/* Tool Options */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`w-full p-2 rounded-md text-sm flex items-center gap-2 ${
                    snapToGrid ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Snap to Grid
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-md text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <Undo className="w-4 h-4" />
                    Undo
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-md text-sm disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <Redo className="w-4 h-4" />
                    Redo
                  </button>
                </div>
              </div>

              {/* Drawing Instructions */}
              {drawingState.currentTool === 'wall' && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Wall Tool:</strong> Click to start, click to add points, double-click to finish
                </div>
              )}
              {drawingState.currentTool !== 'select' && drawingState.currentTool !== 'wall' && (
                <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                  <strong>{drawingState.currentTool} Tool:</strong> Click on map to place
                </div>
              )}
            </div>
          )}

          {/* Element Properties */}
          {selectedElement && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Properties</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedElement.name}
                    onChange={(e) => handleElementUpdate({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
                    {selectedElement.type}
                  </div>
                </div>
                {selectedElement.type === 'rack' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rotation (degrees)
                    </label>
                    <input
                      type="number"
                      value={selectedElement.rotation || 0}
                      onChange={(e) => handleElementUpdate({ rotation: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <button
                  onClick={handleElementDelete}
                  className="w-full bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Element
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          {currentFloor && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Floor'}
            </button>
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative">
        {currentFloor ? (
          <MapGL
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={handleMapClick}
            onDblClick={handleMapDoubleClick}
            onMouseMove={handleMouseMove}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            interactiveLayerIds={['elements-fill', 'elements-line', 'elements-circle']}
          >
            {geoJsonData && (
              <Source id="floor-elements" type="geojson" data={geoJsonData}>
                {/* Polygon fills */}
                <Layer
                  id="elements-fill"
                  type="fill"
                  filter={['==', ['geometry-type'], 'Polygon']}
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'type'], 'rack'], '#3B82F6',
                      ['==', ['get', 'type'], 'wall'], '#6B7280',
                      ['==', ['get', 'type'], 'obstacle'], '#EF4444',
                      ['==', ['get', 'type'], 'poi'], '#10B981',
                      '#9CA3AF'
                    ],
                    'fill-opacity': [
                      'case',
                      ['get', 'selected'], 0.8,
                      0.6
                    ]
                  }}
                />
                
                {/* Polygon outlines */}
                <Layer
                  id="elements-line"
                  type="line"
                  filter={['any', 
                    ['==', ['geometry-type'], 'Polygon'],
                    ['==', ['geometry-type'], 'LineString']
                  ]}
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'type'], 'wall-preview'], '#3B82F6',
                      ['get', 'selected'], '#000000',
                      [
                        'case',
                        ['==', ['get', 'type'], 'rack'], '#3B82F6',
                        ['==', ['get', 'type'], 'wall'], '#6B7280',
                        ['==', ['get', 'type'], 'obstacle'], '#EF4444',
                        ['==', ['get', 'type'], 'poi'], '#10B981',
                        '#9CA3AF'
                      ]
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'type'], 'wall-preview'], 3,
                      ['get', 'selected'], 3,
                      2
                    ],
                    'line-dasharray': [
                      'case',
                      ['==', ['get', 'type'], 'wall-preview'], [2, 2],
                      [1, 0]
                    ]
                  }}
                />
                
                {/* Points */}
                <Layer
                  id="elements-circle"
                  type="circle"
                  filter={['==', ['geometry-type'], 'Point']}
                  paint={{
                    'circle-color': [
                      'case',
                      ['==', ['get', 'type'], 'obstacle'], '#EF4444',
                      ['==', ['get', 'type'], 'poi'], '#10B981',
                      '#9CA3AF'
                    ],
                    'circle-radius': [
                      'case',
                      ['get', 'selected'], 8,
                      6
                    ],
                    'circle-stroke-color': [
                      'case',
                      ['get', 'selected'], '#000000',
                      '#FFFFFF'
                    ],
                    'circle-stroke-width': 2
                  }}
                />
              </Source>
            )}
          </MapGL>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No floor selected</h3>
              <p className="text-gray-600">
                Select a floor from the sidebar or create a new one to start editing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};