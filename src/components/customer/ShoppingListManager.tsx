import React, { useState, useEffect } from 'react';
import { Rack } from '../../types';
import { getShoppingGuidance, ShoppingGuidance } from '../../services/geminiService';
import { optimizeRoute } from '../../algorithms/pathfinding';
import { Plus, Trash2, ShoppingCart, Navigation, Loader } from 'lucide-react';

interface ShoppingListManagerProps {
  shoppingList: string[];
  onUpdateList: (list: string[]) => void;
  racks: Rack[];
  onPathGenerated: (path: { x: number; y: number }[]) => void;
}

export const ShoppingListManager: React.FC<ShoppingListManagerProps> = ({
  shoppingList,
  onUpdateList,
  racks,
  onPathGenerated,
}) => {
  const [newItem, setNewItem] = useState('');
  const [guidance, setGuidance] = useState<ShoppingGuidance | null>(null);
  const [loading, setLoading] = useState(false);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && !shoppingList.includes(newItem.trim())) {
      onUpdateList([...shoppingList, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const updatedList = shoppingList.filter((_, i) => i !== index);
    onUpdateList(updatedList);
  };

  const generateRoute = async () => {
    if (shoppingList.length === 0 || racks.length === 0) return;

    setLoading(true);
    try {
      const shoppingGuidance = await getShoppingGuidance(shoppingList, racks);
      setGuidance(shoppingGuidance);

      // Generate optimal path
      const rackPositions = shoppingGuidance.route
        .map(rackName => racks.find(r => r.name === rackName))
        .filter(Boolean)
        .map(rack => ({ name: rack!.name, position: rack!.position }));

      const path = optimizeRoute(rackPositions, []);
      onPathGenerated(path);
    } catch (error) {
      console.error('Error generating route:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shoppingList.length > 0) {
      generateRoute();
    } else {
      setGuidance(null);
      onPathGenerated([]);
    }
  }, [shoppingList]);

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Shopping List</h2>
            <p className="text-sm text-gray-600">
              {shoppingList.length} {shoppingList.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="p-4 border-b">
        <form onSubmit={addItem} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item to your list..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Shopping List Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {shoppingList.length > 0 ? (
          <div className="space-y-2">
            {shoppingList.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-900">{item}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Your shopping list is empty</p>
            <p className="text-sm text-gray-500">Add items above to get started</p>
          </div>
        )}
      </div>

      {/* Navigation Guidance */}
      {guidance && (
        <div className="p-4 border-t bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900">Route Guidance</h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-blue-800">
              <strong>Route:</strong> {guidance.route.join(' → ')}
            </div>
            
            {guidance.instructions.length > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-blue-900">Instructions:</div>
                {guidance.instructions.map((instruction, index) => (
                  <div key={index} className="text-sm text-blue-800">
                    {index + 1}. {instruction}
                  </div>
                ))}
              </div>
            )}
            
            {guidance.products.some(p => p.suggestions && p.suggestions.length > 0) && (
              <div className="mt-3">
                <div className="text-sm font-medium text-blue-900 mb-1">Suggestions:</div>
                <div className="flex flex-wrap gap-1">
                  {guidance.products
                    .flatMap(p => p.suggestions || [])
                    .slice(0, 3)
                    .map((suggestion, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {suggestion}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Route Button */}
      {shoppingList.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={generateRoute}
            disabled={loading || racks.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {loading ? 'Generating Route...' : 'Update Route'}
          </button>
        </div>
      )}
    </div>
  );
};