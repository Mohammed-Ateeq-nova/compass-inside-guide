import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Plus, Minus, Square, Minus as Wall, Navigation, RotateCcw, RotateCw, Trash2, Edit3 } from 'lucide-react';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FloorData {
  id: string;
  name: string;
  level: number;
  elements: any[];
}

interface LeafletIndoorMapProps {
  floors: FloorData[];
  onSave: (floorData: FloorData[]) => void;
}

export const LeafletIndoorMap: React.FC<LeafletIndoorMapProps> = ({ floors, onSave }) => {
  const [currentFloor, setCurrentFloor] = useState<FloorData | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [history, setHistory] = useState<FloorData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const mapRef = useRef<any>(null);
  const editableLayersRef = useRef<any>(null);

  useEffect(() => {
    if (floors.length > 0 && !currentFloor) {
      setCurrentFloor(floors[0]);
    }
  }, [floors, currentFloor]);

  const addToHistory = (newFloors: FloorData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFloors)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      onSave(previousState);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      onSave(nextState);
    }
  };

  const onCreated = (e: any) => {
    const { layer } = e;
    const newElement = {
      id: `element_${Date.now()}`,
      type: selectedTool === 'wall' ? 'wall' : selectedTool === 'rack' ? 'rack' : 'obstacle',
      name: `${selectedTool === 'wall' ? 'Wall' : selectedTool === 'rack' ? 'Rack' : 'Obstacle'} ${Date.now()}`,
      geometry: layer.toGeoJSON(),
      properties: {
        color: selectedTool === 'wall' ? '#6B7280' : selectedTool === 'rack' ? '#3B82F6' : '#EF4444',
        fill: selectedTool !== 'wall',
        fillOpacity: 0.6
      }
    };

    if (currentFloor) {
      const updatedFloors = floors.map(floor => 
        floor.id === currentFloor.id 
          ? { ...floor, elements: [...floor.elements, newElement] }
          : floor
      );
      addToHistory(updatedFloors);
      onSave(updatedFloors);
    }
  };

  const onEdited = () => {
    // Handle shape editing
    if (currentFloor) {
      addToHistory(floors);
      onSave(floors);
    }
  };

  const onDeleted = () => {
    // Handle shape deletion
    if (currentFloor) {
      addToHistory(floors);
      onSave(floors);
    }
  };

  const switchFloor = (direction: 'up' | 'down') => {
    if (!currentFloor) return;
    
    const currentIndex = floors.findIndex(f => f.id === currentFloor.id);
    let newIndex;
    
    if (direction === 'up' && currentIndex < floors.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }
    
    setCurrentFloor(floors[newIndex]);
  };

  const drawOptions = {
    polyline: selectedTool === 'wall' ? {
      shapeOptions: {
        color: '#6B7280',
        weight: 4
      }
    } : false,
    polygon: selectedTool === 'rack' ? {
      shapeOptions: {
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.6
      }
    } : false,
    rectangle: selectedTool === 'obstacle' ? {
      shapeOptions: {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.6
      }
    } : false,
    circle: false,
    marker: false,
    circlemarker: false
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border">
      {/* Header with Controls */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Indoor Map Editor</h2>
              {currentFloor && (
                <p className="text-sm text-gray-600">{currentFloor.name}</p>
              )}
            </div>
          </div>
          
          {/* Floor Navigation */}
          {floors.length > 1 && currentFloor && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => switchFloor('up')}
                disabled={floors.findIndex(f => f.id === currentFloor.id) === floors.length - 1}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => switchFloor('down')}
                disabled={floors.findIndex(f => f.id === currentFloor.id) === 0}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setSelectedTool('select')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              selectedTool === 'select' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Select
          </button>
          
          <button
            onClick={() => setSelectedTool('wall')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              selectedTool === 'wall' 
                ? 'bg-gray-100 text-gray-700 border border-gray-300' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Wall className="w-4 h-4" />
            Wall
          </button>
          
          <button
            onClick={() => setSelectedTool('rack')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              selectedTool === 'rack' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Square className="w-4 h-4" />
            Rack
          </button>
          
          <button
            onClick={() => setSelectedTool('obstacle')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              selectedTool === 'obstacle' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Square className="w-4 h-4" />
            Obstacle
          </button>
        </div>

        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Undo
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw className="w-4 h-4" />
            Redo
          </button>
          
          <button
            onClick={() => {
              if (editableLayersRef.current) {
                editableLayersRef.current.clearLayers();
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <MapContainer
          ref={mapRef}
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          crs={L.CRS.Simple}
          minZoom={-2}
          maxZoom={5}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <FeatureGroup ref={editableLayersRef}>
            <EditControl
              position="topright"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              draw={drawOptions}
              edit={{
                edit: selectedTool === 'select' ? {} : false,
                remove: selectedTool === 'select' ? {} : false
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Walls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Racks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Obstacles</span>
          </div>
        </div>
      </div>
    </div>
  );
};