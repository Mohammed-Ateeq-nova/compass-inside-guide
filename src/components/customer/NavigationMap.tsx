import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';
import { Floor } from '../../types';
import { Map, ChevronUp, ChevronDown, Navigation } from 'lucide-react';

interface NavigationMapProps {
  floors: Floor[];
  path: { x: number; y: number }[];
  shoppingList: string[];
}

export const NavigationMap: React.FC<NavigationMapProps> = ({ floors, path, shoppingList }) => {
  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (floors.length > 0 && !currentFloor) {
      setCurrentFloor(floors[0]);
    }
  }, [floors, currentFloor]);

  useEffect(() => {
    if (path.length > 0) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % path.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [path]);

  const switchFloor = (direction: 'up' | 'down') => {
    if (!currentFloor) return;
    
    const currentIndex = floors.findIndex(f => f.id === currentFloor.id);
    let newIndex;
    
    if (direction === 'up' && currentIndex < floors.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }
    
    setCurrentFloor(floors[newIndex]);
  };

  const renderPath = () => {
    if (path.length < 2) return null;

    const pathPoints = path.flatMap(point => [point.x, point.y]);
    const animatedPoints = pathPoints.slice(0, (animationStep + 1) * 2);

    return (
      <>
        {/* Full path in light color */}
        <Line
          points={pathPoints}
          stroke="#93C5FD"
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Animated path in bright color */}
        {animatedPoints.length >= 4 && (
          <Line
            points={animatedPoints}
            stroke="#3B82F6"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
        
        {/* Current position indicator */}
        {path[animationStep] && (
          <Circle
            x={path[animationStep].x}
            y={path[animationStep].y}
            radius={8}
            fill="#3B82F6"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Map className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Store Map</h2>
              {currentFloor && (
                <p className="text-sm text-gray-600">{currentFloor.name}</p>
              )}
            </div>
          </div>
          
          {/* Floor Navigation */}
          {floors.length > 1 && currentFloor && (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => switchFloor('up')}
                disabled={floors.findIndex(f => f.id === currentFloor.id) === floors.length - 1}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => switchFloor('down')}
                disabled={floors.findIndex(f => f.id === currentFloor.id) === 0}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 overflow-hidden">
        {currentFloor ? (
          <Stage width={400} height={400} className="bg-gray-50">
            <Layer>
              {/* Grid */}
              {Array.from({ length: 20 }, (_, i) => (
                <React.Fragment key={i}>
                  <Line
                    points={[i * 20, 0, i * 20, 400]}
                    stroke="#f3f4f6"
                    strokeWidth={1}
                  />
                  <Line
                    points={[0, i * 20, 400, i * 20]}
                    stroke="#f3f4f6"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
              
              {/* Map Elements */}
              {currentFloor.elements.map((element) => {
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
                        opacity={0.8}
                      />
                    ) : (
                      <Rect
                        x={element.position.x}
                        y={element.position.y}
                        width={element.size.width}
                        height={element.size.height}
                        fill={color}
                        opacity={0.8}
                      />
                    )}
                    
                    <Text
                      x={element.position.x}
                      y={element.position.y - 15}
                      text={element.name}
                      fontSize={10}
                      fill="#374151"
                      fontFamily="Inter, sans-serif"
                    />
                  </React.Fragment>
                );
              })}
              
              {/* Navigation Path */}
              {renderPath()}
              
              {/* Start Point */}
              {path.length > 0 && (
                <Circle
                  x={path[0].x}
                  y={path[0].y}
                  radius={6}
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              )}
              
              {/* End Point */}
              {path.length > 1 && (
                <Circle
                  x={path[path.length - 1].x}
                  y={path[path.length - 1].y}
                  radius={6}
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              )}
            </Layer>
          </Stage>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No map available</p>
              <p className="text-sm text-gray-500">Store map is being prepared</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Racks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>Walls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Obstacles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Points of Interest</span>
          </div>
        </div>
        
        {path.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Navigation className="w-4 h-4" />
              <span>Route: {path.length} steps</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};