import React, { useState, useEffect } from 'react';
import { LeafletIndoorMap } from './LeafletIndoorMap';
import { FloorManager } from './FloorManager';

interface Floor {
  id: string;
  name: string;
  level: number;
  elements: any[];
}

export const IndoorNavApp: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: 'floor-1',
      name: 'Ground Floor',
      level: 1,
      elements: []
    }
  ]);
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);

  useEffect(() => {
    if (floors.length > 0 && !currentFloor) {
      setCurrentFloor(floors[0]);
    }
  }, [floors, currentFloor]);

  const handleSave = (updatedFloors: Floor[]) => {
    setFloors(updatedFloors);
    // Save to Firebase or localStorage
    localStorage.setItem('indoorMapFloors', JSON.stringify(updatedFloors));
    console.log('Saving floors:', updatedFloors);
  };

  const handleFloorAdd = (newFloor: Omit<Floor, 'id'>) => {
    const floor: Floor = {
      ...newFloor,
      id: `floor-${Date.now()}`
    };
    const updatedFloors = [...floors, floor];
    setFloors(updatedFloors);
    setCurrentFloor(floor);
    handleSave(updatedFloors);
  };

  const handleFloorEdit = (floorId: string, updates: Partial<Floor>) => {
    const updatedFloors = floors.map(floor =>
      floor.id === floorId ? { ...floor, ...updates } : floor
    );
    setFloors(updatedFloors);
    if (currentFloor?.id === floorId) {
      setCurrentFloor({ ...currentFloor, ...updates });
    }
    handleSave(updatedFloors);
  };

  const handleFloorDelete = (floorId: string) => {
    const updatedFloors = floors.filter(floor => floor.id !== floorId);
    setFloors(updatedFloors);
    if (currentFloor?.id === floorId) {
      setCurrentFloor(updatedFloors.length > 0 ? updatedFloors[0] : null);
    }
    handleSave(updatedFloors);
  };

  // Load saved floors on component mount
  useEffect(() => {
    const savedFloors = localStorage.getItem('indoorMapFloors');
    if (savedFloors) {
      try {
        const parsedFloors = JSON.parse(savedFloors);
        setFloors(parsedFloors);
      } catch (error) {
        console.error('Error loading saved floors:', error);
      }
    }
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="h-full p-4">
        <div className="h-full max-w-7xl mx-auto grid grid-cols-4 gap-4">
          {/* Floor Manager Sidebar */}
          <div className="col-span-1">
            <FloorManager
              floors={floors}
              currentFloor={currentFloor}
              onFloorSelect={setCurrentFloor}
              onFloorAdd={handleFloorAdd}
              onFloorEdit={handleFloorEdit}
              onFloorDelete={handleFloorDelete}
            />
          </div>

          {/* Map Editor */}
          <div className="col-span-3">
            <LeafletIndoorMap
              floors={floors}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};