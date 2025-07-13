import React, { useState, useEffect } from 'react';
import { Store, Floor } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { getStores, createStore, getFloors } from '../../services/firestoreService';
import { EnhancedStoreList } from './EnhancedStoreList';
import { MapboxMapEditor } from './MapboxMapEditor';
import { EnhancedRackManager } from './EnhancedRackManager';
import { QRCodeGenerator } from './QRCodeGenerator';
import { Building2, Map, Package, QrCode, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [activeTab, setActiveTab] = useState<'stores' | 'map' | 'racks' | 'qr'>('stores');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStores();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStore) {
      loadFloors();
    }
  }, [selectedStore]);

  const loadStores = async () => {
    if (!user) return;
    try {
      const userStores = await getStores(user.uid);
      setStores(userStores);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFloors = async () => {
    if (!selectedStore) return;
    try {
      const storeFloors = await getFloors(selectedStore.id);
      setFloors(storeFloors);
    } catch (error) {
      console.error('Error loading floors:', error);
    }
  };

  const handleCreateStore = async (name: string, address: string) => {
    if (!user) return;
    try {
      const storeId = await createStore({
        name,
        address,
        adminId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await loadStores();
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'stores', label: 'Stores', icon: Building2 },
    { id: 'map', label: 'Map Editor', icon: Map, disabled: !selectedStore },
    { id: 'racks', label: 'Rack Manager', icon: Package, disabled: !selectedStore },
    { id: 'qr', label: 'QR Codes', icon: QrCode, disabled: !selectedStore },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Store Navigator Admin</h1>
                {selectedStore && (
                  <p className="text-sm text-gray-500">{selectedStore.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'stores' && (
            <EnhancedStoreList
              stores={stores}
              selectedStore={selectedStore}
              onSelectStore={setSelectedStore}
              onCreateStore={handleCreateStore}
              onStoresUpdate={loadStores}
            />
          )}
          {activeTab === 'map' && selectedStore && (
            <MapboxMapEditor
              store={selectedStore}
              floors={floors}
              onFloorsUpdate={loadFloors}
            />
          )}
          {activeTab === 'racks' && selectedStore && (
            <EnhancedRackManager
              store={selectedStore}
              floors={floors}
            />
          )}
          {activeTab === 'qr' && selectedStore && (
            <QRCodeGenerator store={selectedStore} />
          )}
        </div>
      </div>
    </div>
  );
};