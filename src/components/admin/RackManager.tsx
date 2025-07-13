import React, { useState, useEffect } from 'react';
import { Store, Floor, Rack } from '../../types';
import { getRacks, createRack, updateRack, deleteRack } from '../../services/firestoreService';
import { Package, Plus, Edit, Trash2, Tag } from 'lucide-react';

interface RackManagerProps {
  store: Store;
  floors: Floor[];
}

export const RackManager: React.FC<RackManagerProps> = ({ store, floors }) => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    products: ''
  });

  useEffect(() => {
    if (selectedFloor) {
      loadRacks();
    }
  }, [selectedFloor]);

  const loadRacks = async () => {
    if (!selectedFloor) return;
    try {
      const floorRacks = await getRacks(store.id, selectedFloor.id);
      setRacks(floorRacks);
    } catch (error) {
      console.error('Error loading racks:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFloor || !formData.name.trim()) return;

    const rackData = {
      name: formData.name.trim(),
      products: formData.products.split(',').map(p => p.trim()).filter(p => p),
      position: { x: 100, y: 100 }, // Default position
      storeId: store.id,
      floorId: selectedFloor.id,
    };

    try {
      if (editingRack) {
        await updateRack(editingRack.id, rackData);
      } else {
        await createRack(rackData);
      }
      
      setFormData({ name: '', products: '' });
      setShowAddForm(false);
      setEditingRack(null);
      loadRacks();
    } catch (error) {
      console.error('Error saving rack:', error);
    }
  };

  const handleEdit = (rack: Rack) => {
    setEditingRack(rack);
    setFormData({
      name: rack.name,
      products: rack.products.join(', ')
    });
    setShowAddForm(true);
  };

  const handleDelete = async (rackId: string) => {
    if (!confirm('Are you sure you want to delete this rack?')) return;
    
    try {
      await deleteRack(rackId);
      loadRacks();
    } catch (error) {
      console.error('Error deleting rack:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', products: '' });
    setShowAddForm(false);
    setEditingRack(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rack Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={!selectedFloor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Rack
        </button>
      </div>

      {/* Floor Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Floor
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloor(floor)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedFloor?.id === floor.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">{floor.name}</div>
              <div className="text-sm text-gray-500">Level {floor.level}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingRack ? 'Edit Rack' : 'Add New Rack'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rack Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Rack-1, Electronics Section"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products (comma-separated)
              </label>
              <textarea
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Milk, Bread, Eggs, Cheese"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingRack ? 'Update Rack' : 'Add Rack'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Racks List */}
      {selectedFloor ? (
        <div className="space-y-4">
          {racks.length > 0 ? (
            racks.map((rack) => (
              <div key={rack.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{rack.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {rack.products.length} products
                      </span>
                    </div>
                    {rack.products.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rack.products.map((product, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(rack)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit rack"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rack.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete rack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No racks yet</h3>
              <p className="text-gray-600 mb-4">
                Add racks to organize products in your store.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Rack
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a floor</h3>
          <p className="text-gray-600">
            Choose a floor from the options above to manage its racks.
          </p>
        </div>
      )}
    </div>
  );
};