import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva';
import { Store, Floor, MapElement } from '../../types';
import { useMapStore } from '../../store/mapStore';
import { saveFloor } from '../../services/firestoreService';
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, Trash2, Move, Square, Circle as CircleIcon, MapPin } from 'lucide-react';

interface MapEditorProps {
  store: Store;
  floors: Floor[];
  onFloorsUpdate: () => void;
}

export const MapEditor: React.FC<MapEditorProps> = ({ store, floors, onFloorsUpdate }) => {
  const {
    currentFloor,
    selectedElement,
    tool,
    setCurrentFloor,
    setSelectedElement,
    setTool,
    addElement,
    updateElement,
    removeElement
  } = useMapStore();

  const [currentFloorName, setCurrentFloorName] = useState('');
  const [showFloorForm, setShowFloorForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const handleFloorSelect = (floor: Floor) => {
    setCurrentFloor(floor);
    setSelectedElement(null);
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

  const handleStageClick = useCallback((e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (tool !== 'select' && currentFloor) {
      const newElement: MapElement = {
        id: uuidv4(),
        type: tool as any,
        name: `${tool}-${currentFloor.elements.length + 1}`,
        position: { x: pos.x, y: pos.y },
        size: { width: tool === 'rack' ? 60 : 40, height: tool === 'rack' ? 40 : 40 },
        rotation: 0,
      };

      addElement(newElement);
      setTool('select');
    } else {
      setSelectedElement(null);
    }
  }, [tool, currentFloor, addElement, setTool, setSelectedElement]);

  const handleElementClick = useCallback((element: MapElement) => {
    setSelectedElement(element);
    setTool('select');
  }, [setSelectedElement, setTool]);

  const handleDragEnd = useCallback((elementId: string, pos: any) => {
    updateElement(elementId, { position: { x: pos.x, y: pos.y } });
  }, [updateElement]);

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

  const tools = [
    { id: 'select', label: 'Select', icon: Move },
    { id: 'rack', label: 'Rack', icon: Square },
    { id: 'wall', label: 'Wall', icon: Square },
    { id: 'obstacle', label: 'Obstacle', icon: CircleIcon },
    { id: 'poi', label: 'POI', icon: MapPin },
  ];

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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tools.map((toolItem) => {
                  const Icon = toolItem.icon;
                  return (
                    <button
                      key={toolItem.id}
                      onClick={() => setTool(toolItem.id as any)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                        tool === toolItem.id
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
                    onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
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
                <button
                  onClick={() => {
                    removeElement(selectedElement.id);
                    setSelectedElement(null);
                  }}
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

      {/* Canvas */}
      <div className="flex-1 relative">
        {currentFloor ? (
          <Stage
            ref={stageRef}
            width={window.innerWidth - 320}
            height={window.innerHeight - 200}
            onClick={handleStageClick}
            className="bg-white"
          >
            <Layer>
              {/* Grid */}
              {Array.from({ length: 50 }, (_, i) => (
                <React.Fragment key={i}>
                  <Rect
                    x={i * 40}
                    y={0}
                    width={1}
                    height={window.innerHeight - 200}
                    fill="#f3f4f6"
                  />
                  <Rect
                    x={0}
                    y={i * 40}
                    width={window.innerWidth - 320}
                    height={1}
                    fill="#f3f4f6"
                  />
                </React.Fragment>
              ))}
              
              {/* Elements */}
              {currentFloor.elements.map((element) => {
                const isSelected = selectedElement?.id === element.id;
                const color = {
                  rack: '#3B82F6',
                  wall: '#6B7280',
                  obstacle: '#EF4444',
                  poi: '#10B981'
                }[element.type];

                return (
                  <React.Fragment key={element.id}>
                    {element.type === 'obstacle' || element.type === 'poi' ? (
                      <Circle
                        x={element.position.x}
                        y={element.position.y}
                        radius={element.size.width / 2}
                        fill={color}
                        stroke={isSelected ? '#000' : color}
                        strokeWidth={isSelected ? 2 : 1}
                        opacity={0.8}
                        draggable={tool === 'select'}
                        onClick={() => handleElementClick(element)}
                        onDragEnd={(e) => handleDragEnd(element.id, e.target.position())}
                      />
                    ) : (
                      <Rect
                        x={element.position.x}
                        y={element.position.y}
                        width={element.size.width}
                        height={element.size.height}
                        fill={color}
                        stroke={isSelected ? '#000' : color}
                        strokeWidth={isSelected ? 2 : 1}
                        opacity={0.8}
                        draggable={tool === 'select'}
                        onClick={() => handleElementClick(element)}
                        onDragEnd={(e) => handleDragEnd(element.id, e.target.position())}
                      />
                    )}
                    
                    <Text
                      x={element.position.x}
                      y={element.position.y - 20}
                      text={element.name}
                      fontSize={12}
                      fill="#374151"
                      fontFamily="Inter, sans-serif"
                    />
                  </React.Fragment>
                );
              })}
            </Layer>
            <Layer>
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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