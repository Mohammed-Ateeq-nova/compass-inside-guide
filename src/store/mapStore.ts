import { create } from 'zustand';
import { MapElement, Floor } from '../types';

interface MapState {
  currentFloor: Floor | null;
  floors: Floor[];
  selectedElement: MapElement | null;
  isEditing: boolean;
  tool: 'select' | 'rack' | 'wall' | 'obstacle' | 'poi';
  setCurrentFloor: (floor: Floor) => void;
  setFloors: (floors: Floor[]) => void;
  setSelectedElement: (element: MapElement | null) => void;
  setIsEditing: (editing: boolean) => void;
  setTool: (tool: 'select' | 'rack' | 'wall' | 'obstacle' | 'poi') => void;
  addElement: (element: MapElement) => void;
  updateElement: (elementId: string, updates: Partial<MapElement>) => void;
  removeElement: (elementId: string) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  currentFloor: null,
  floors: [],
  selectedElement: null,
  isEditing: false,
  tool: 'select',
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setFloors: (floors) => set({ floors }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setTool: (tool) => set({ tool }),
  addElement: (element) => {
    const { currentFloor } = get();
    if (currentFloor) {
      const updatedFloor = {
        ...currentFloor,
        elements: [...currentFloor.elements, element]
      };
      set({ currentFloor: updatedFloor });
    }
  },
  updateElement: (elementId, updates) => {
    const { currentFloor } = get();
    if (currentFloor) {
      const updatedFloor = {
        ...currentFloor,
        elements: currentFloor.elements.map(el => 
          el.id === elementId ? { ...el, ...updates } : el
        )
      };
      set({ currentFloor: updatedFloor });
    }
  },
  removeElement: (elementId) => {
    const { currentFloor } = get();
    if (currentFloor) {
      const updatedFloor = {
        ...currentFloor,
        elements: currentFloor.elements.filter(el => el.id !== elementId)
      };
      set({ currentFloor: updatedFloor });
    }
  },
}));