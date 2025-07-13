import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store, Floor, Rack } from '../../types';
import { getStores, getFloors, getRacks } from '../../services/firestoreService';
import { ChatInterface } from './ChatInterface';
import { NavigationMap } from './NavigationMap';
import { ShoppingListManager } from './ShoppingListManager';
import { MessageCircle, Map, ShoppingCart, Building2, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../services/authService';

export const EnhancedCustomerInterface: React.FC = () => {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('store');
  const { user } = useAuthStore();
  
  const [store, setStore] = useState<Store | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'map' | 'list'>('chat');
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualStoreId, setManualStoreId] = useState('');

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    } else {
      setLoading(false);
    }
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) return;

    try {
      // For demo purposes, we'll create a mock store if not found
      const mockStore: Store = {
        id: storeId,
        name: 'Walmart Supercenter',
        address: '123 Main Street, City, State',
        adminId: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setStore(mockStore);
      
      // Load floors and racks
      const storeFloors = await getFloors(storeId);
      setFloors(storeFloors);
      
      if (storeFloors.length > 0) {
        const allRacks: Rack[] = [];
        for (const floor of storeFloors) {
          const floorRacks = await getRacks(storeId, floor.id);
          allRacks.push(...floorRacks);
        }
        setRacks(allRacks);
      }
      setError('');
    } catch (err) {
      console.error('Error loading store data:', err);
      setError('Failed to load store information');
    } finally {
      setLoading(false);
    }
  };

  const handleManualStoreLoad = () => {
    if (manualStoreId.trim()) {
      window.location.href = `/customer?store=${manualStoreId.trim()}`;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
    { id: 'list', label: 'Shopping List', icon: ShoppingCart },
    { id: 'map', label: 'Store Map', icon: Map },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {store ? store.name : 'Store Navigator'}
                </h1>
                {store ? (
                  <p className="text-sm text-gray-500">{store.address}</p>
                ) : (
                  <p className="text-sm text-gray-500">AI Shopping Assistant</p>
                )}
              </div>
            </div>
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* No Store ID - Show Fallback */}
        {!storeId && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome to Store Navigator!
              </h2>
              <p className="text-blue-800 mb-4">
                Please scan a store QR code to load the map, or enter a store ID manually. 
                Meanwhile, you can still use the AI assistant to plan your shopping.
              </p>
              
              {/* Manual Store ID Input */}
              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualStoreId}
                    onChange={(e) => setManualStoreId(e.target.value)}
                    placeholder="Enter Store ID"
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleManualStoreLoad}
                    disabled={!manualStoreId.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Load Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && storeId && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-900 mb-2">Store Not Found</h2>
              <p className="text-red-800 mb-4">{error}</p>
              <button
                onClick={() => window.location.href = '/customer'}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tab Navigation */}
        <nav className="flex bg-white rounded-lg shadow-sm mt-4 p-1 md:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-6">
          {/* AI Chat - Always visible, first on mobile */}
          <div className={`${activeTab === 'chat' ? 'block' : 'hidden'} md:block`}>
            <ChatInterface
              racks={racks}
              shoppingList={shoppingList}
              store={store || {
                id: 'demo',
                name: 'Demo Store',
                address: 'Demo Address',
                adminId: 'demo',
                createdAt: new Date(),
                updatedAt: new Date()
              }}
            />
          </div>

          {/* Shopping List - Tab on mobile, column on desktop */}
          <div className={`${activeTab === 'list' ? 'block' : 'hidden'} md:block`}>
            <ShoppingListManager
              shoppingList={shoppingList}
              onUpdateList={setShoppingList}
              racks={racks}
              onPathGenerated={setCurrentPath}
            />
          </div>

          {/* Navigation Map - Tab on mobile, column on desktop */}
          <div className={`${activeTab === 'map' ? 'block' : 'hidden'} md:block`}>
            {store ? (
              <NavigationMap
                floors={floors}
                path={currentPath}
                shoppingList={shoppingList}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border h-full max-h-[600px] flex items-center justify-center">
                <div className="text-center p-8">
                  <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Map</h3>
                  <p className="text-gray-600">
                    Load a store to view its navigation map.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};