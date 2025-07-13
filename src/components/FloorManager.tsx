import React, { useState } from 'react';
import { Plus, Building, Edit3, Trash2 } from 'lucide-react';

interface Floor {
  id: string;
  name: string;
  level: number;
  elements: any[];
}

interface FloorManagerProps {
  floors: Floor[];
  currentFloor: Floor | null;
  onFloorSelect: (floor: Floor) => void;
  onFloorAdd: (floor: Omit<Floor, 'id'>) => void;
  onFloorEdit: (floorId: string, updates: Partial<Floor>) => void;
  onFloorDelete: (floorId: string) => void;
}

export const FloorManager: React.FC<FloorManagerProps> = ({
  floors,
  currentFloor,
  onFloorSelect,
  onFloorAdd,
  onFloorEdit,
  onFloorDelete
}) => {
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [editingFloor, setEditingFloor] = useState<string | null>(null);
  const [newFloorName, setNewFloorName] = useState('');
  const [newFloorLevel, setNewFloorLevel] = useState(1);

  const handleAddFloor = () => {
    if (newFloorName.trim()) {
      onFloorAdd({
        name: newFloorName.trim(),
        level: newFloorLevel,
        elements: []
      });
      setNewFloorName('');
      setNewFloorLevel(floors.length + 1);
      setIsAddingFloor(false);
    }
  };

  const handleEditFloor = (floorId: string) => {
    const floor = floors.find(f => f.id === floorId);
    if (floor) {
      onFloorEdit(floorId, { name: newFloorName, level: newFloorLevel });
      setEditingFloor(null);
      setNewFloorName('');
    }
  };

  const startEdit = (floor: Floor) => {
    setEditingFloor(floor.id);
    setNewFloorName(floor.name);
    setNewFloorLevel(floor.level);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Floors</h3>
        </div>
        
        <button
          onClick={() => setIsAddingFloor(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Floor
        </button>
      </div>

      {/* Add Floor Form */}
      {isAddingFloor && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Name
              </label>
              <input
                type="text"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="e.g., Ground Floor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <input
                type="number"
                value={newFloorLevel}
                onChange={(e) => setNewFloorLevel(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddFloor}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingFloor(false);
                setNewFloorName('');
                setNewFloorLevel(floors.length + 1);
              }}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floor List */}
      <div className="space-y-2">
        {floors.map((floor) => (
          <div
            key={floor.id}
            className={`p-3 rounded-md border cursor-pointer transition-colors ${
              currentFloor?.id === floor.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {editingFloor === floor.id ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  value={newFloorLevel}
                  onChange={(e) => setNewFloorLevel(parseInt(e.target.value) || 1)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <div className="col-span-2 flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditFloor(floor.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingFloor(null);
                      setNewFloorName('');
                    }}
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => onFloorSelect(floor)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{floor.name}</h4>
                    <p className="text-sm text-gray-600">Level {floor.level}</p>
                    <p className="text-xs text-gray-500">
                      {floor.elements.length} elements
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(floor);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFloorDelete(floor.id);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {floors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No floors added yet</p>
            <p className="text-sm">Add your first floor to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};