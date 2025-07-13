import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Store, Floor, Rack } from '../../types';
import { getStores, getFloors, getRacks } from '../../services/firestoreService';
import { ChatInterface } from './ChatInterface';
import { NavigationMap } from './NavigationMap';
import { ShoppingListManager } from './ShoppingListManager';
import { MessageCircle, Map, ShoppingCart, Building2 } from 'lucide-react';

export const CustomerInterface: React.FC = () => {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('store');
  
  const [store, setStore] = useState<Store | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'map' | 'list'>('list');
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    } else {
      setError('No store ID provided');
      setLoading(false);
    }
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) return;

    try {
      // For demo purposes, we'll create a mock store if not found
      // In a real app, you'd fetch from Firestore
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
    } catch (err) {
      console.error('Error loading store data:', err);
      setError('Failed to load store information');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'list', label: 'Shopping List', icon: ShoppingCart },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
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

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600">{error || 'The requested store could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{store.name}</h1>
              <p className="text-sm text-gray-500">{store.address}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Shopping List - Always visible on desktop, tab on mobile */}
          <div className={`${activeTab === 'list' ? 'block' : 'hidden'} md:block`}>
            <ShoppingListManager
              shoppingList={shoppingList}
              onUpdateList={setShoppingList}
              racks={racks}
              onPathGenerated={setCurrentPath}
            />
          </div>

          {/* AI Chat - Tab on mobile, column on desktop */}
          <div className={`${activeTab === 'chat' ? 'block' : 'hidden'} md:block`}>
            <ChatInterface
              racks={racks}
              shoppingList={shoppingList}
              store={store}
            />
          </div>

          {/* Navigation Map - Tab on mobile, column on desktop */}
          <div className={`${activeTab === 'map' ? 'block' : 'hidden'} md:block`}>
            <NavigationMap
              floors={floors}
              path={currentPath}
              shoppingList={shoppingList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};