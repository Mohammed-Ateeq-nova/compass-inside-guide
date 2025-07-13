import React, { useState } from 'react';
import { Store } from '../../types';
import { Plus, Building2, MapPin, Calendar } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  selectedStore: Store | null;
  onSelectStore: (store: Store) => void;
  onCreateStore: (name: string, address: string) => void;
}

export const StoreList: React.FC<StoreListProps> = ({
  stores,
  selectedStore,
  onSelectStore,
  onCreateStore,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && address.trim()) {
      onCreateStore(name.trim(), address.trim());
      setName('');
      setAddress('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Stores</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Store</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter store name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter store address"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Store
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => onSelectStore(store)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedStore?.id === store.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                selectedStore?.id === store.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Building2 className={`w-6 h-6 ${
                  selectedStore?.id === store.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {store.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {store.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first store to start designing indoor navigation maps.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Store
          </button>
        </div>
      )}
    </div>
  );
};