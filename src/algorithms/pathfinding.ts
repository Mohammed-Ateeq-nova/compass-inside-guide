import { MapElement, PathNode } from '../types';

export class AStar {
  private grid: number[][];
  private width: number;
  private height: number;

  constructor(width: number, height: number, obstacles: MapElement[]) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid(obstacles);
  }

  private createGrid(obstacles: MapElement[]): number[][] {
    const grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
    
    obstacles.forEach(obstacle => {
      if (obstacle.type === 'wall' || obstacle.type === 'obstacle') {
        const startX = Math.floor(obstacle.position.x);
        const startY = Math.floor(obstacle.position.y);
        const endX = Math.min(startX + Math.floor(obstacle.size.width), this.width);
        const endY = Math.min(startY + Math.floor(obstacle.size.height), this.height);
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
              grid[y][x] = 1; // blocked
            }
          }
        }
      }
    });
    
    return grid;
  }

  private heuristic(a: PathNode, b: PathNode): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private getNeighbors(node: PathNode): PathNode[] {
    const neighbors: PathNode[] = [];
    const directions = [
      { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 },
      { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }
    ];

    for (const dir of directions) {
      const x = node.x + dir.x;
      const y = node.y + dir.y;

      if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] === 0) {
        neighbors.push({
          x,
          y,
          g: 0,
          h: 0,
          f: 0,
          parent: node
        });
      }
    }

    return neighbors;
  }

  public findPath(start: { x: number; y: number }, goal: { x: number; y: number }): { x: number; y: number }[] {
    const openSet: PathNode[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: PathNode = {
      x: Math.floor(start.x),
      y: Math.floor(start.y),
      g: 0,
      h: 0,
      f: 0
    };

    const goalNode: PathNode = {
      x: Math.floor(goal.x),
      y: Math.floor(goal.y),
      g: 0,
      h: 0,
      f: 0
    };

    startNode.h = this.heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find node with lowest f score
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.x},${current.y}`);

      // Check if we reached the goal
      if (current.x === goalNode.x && current.y === goalNode.y) {
        const path: { x: number; y: number }[] = [];
        let node = current;
        while (node) {
          path.unshift({ x: node.x, y: node.y });
          node = node.parent!;
        }
        return path;
      }

      // Check neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (closedSet.has(neighborKey)) continue;

        const gScore = current.g + (
          Math.abs(neighbor.x - current.x) + Math.abs(neighbor.y - current.y) === 2 ? 1.414 : 1
        );

        const existingNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
        if (!existingNode) {
          neighbor.g = gScore;
          neighbor.h = this.heuristic(neighbor, goalNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
          openSet.push(neighbor);
        } else if (gScore < existingNode.g) {
          existingNode.g = gScore;
          existingNode.f = existingNode.g + existingNode.h;
          existingNode.parent = current;
        }
      }
    }

    return []; // No path found
  }
}

export const optimizeRoute = (
  racks: Array<{ name: string; position: { x: number; y: number } }>,
  obstacles: MapElement[],
  gridSize = { width: 100, height: 100 }
): { x: number; y: number }[] => {
  if (racks.length === 0) return [];

  const pathfinder = new AStar(gridSize.width, gridSize.height, obstacles);
  let fullPath: { x: number; y: number }[] = [];
  let currentPos = { x: 10, y: 10 }; // Starting position

  for (const rack of racks) {
    const pathSegment = pathfinder.findPath(currentPos, rack.position);
    if (pathSegment.length > 0) {
      // Remove the first point if it's the same as the last point of the previous segment
      if (fullPath.length > 0) {
        pathSegment.shift();
      }
      fullPath = [...fullPath, ...pathSegment];
      currentPos = rack.position;
    }
  }

  return fullPath;
};