// Maze Generator + Solver Tool | TypeScript
"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("maze-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "maze-generator");

type Cell = {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
  path?: boolean;
  solution?: boolean;
};

const sizeOptions = [
  { value: "10", label: "10 x 10 (Easy)" },
  { value: "15", label: "15 x 15 (Medium)" },
  { value: "20", label: "20 x 20 (Hard)" },
  { value: "25", label: "25 x 25 (Expert)" },
];

export default function MazeGeneratorPage() {
  const [size, setSize] = useState("15");
  const [maze, setMaze] = useState<Cell[][] | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMaze = useCallback(() => {
    setIsGenerating(true);
    const n = parseInt(size);
    
    // Initialize grid
    const grid: Cell[][] = [];
    for (let y = 0; y < n; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < n; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        });
      }
      grid.push(row);
    }

    // Recursive backtracking maze generation
    const stack: Cell[] = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: Cell[] = [];

      // Get unvisited neighbors
      const { x, y } = current;
      if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]);
      if (x < n - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]);
      if (y < n - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]);
      if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Remove walls between current and next
        if (next.y < current.y) {
          current.walls.top = false;
          next.walls.bottom = false;
        } else if (next.x > current.x) {
          current.walls.right = false;
          next.walls.left = false;
        } else if (next.y > current.y) {
          current.walls.bottom = false;
          next.walls.top = false;
        } else {
          current.walls.left = false;
          next.walls.right = false;
        }

        next.visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // Solve maze using BFS
    const solveMaze = () => {
      const queue: { cell: Cell; path: Cell[] }[] = [{ cell: grid[0][0], path: [grid[0][0]] }];
      const visited = new Set<string>();
      visited.add("0,0");

      while (queue.length > 0) {
        const { cell, path } = queue.shift()!;
        
        if (cell.x === n - 1 && cell.y === n - 1) {
          path.forEach(c => c.solution = true);
          return;
        }

        const { x, y } = cell;
        const moves = [
          { dx: 0, dy: -1, wall: "top" as const },
          { dx: 1, dy: 0, wall: "right" as const },
          { dx: 0, dy: 1, wall: "bottom" as const },
          { dx: -1, dy: 0, wall: "left" as const },
        ];

        for (const move of moves) {
          const nx = x + move.dx;
          const ny = y + move.dy;
          const key = `${nx},${ny}`;

          if (nx >= 0 && nx < n && ny >= 0 && ny < n && !visited.has(key) && !cell.walls[move.wall]) {
            visited.add(key);
            queue.push({ cell: grid[ny][nx], path: [...path, grid[ny][nx]] });
          }
        }
      }
    };

    solveMaze();
    setMaze(grid);
    setShowSolution(false);
    setIsGenerating(false);
  }, [size]);

  const cellSize = Math.min(400 / parseInt(size), 30);
  const mazeWidth = parseInt(size) * cellSize;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Maze Size"
              options={sizeOptions}
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={generateMaze} loading={isGenerating} size="lg">
              Generate Maze
            </Button>
          </div>
        </div>

        {/* Maze Display */}
        {maze && (
          <div className="space-y-4">
            <div className="flex justify-center overflow-auto p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
              <div
                className="relative bg-white dark:bg-gray-900"
                style={{ width: mazeWidth, height: mazeWidth }}
              >
                {/* Start marker */}
                <div
                  className="absolute bg-green-500 rounded-full z-10"
                  style={{
                    width: cellSize * 0.5,
                    height: cellSize * 0.5,
                    left: cellSize * 0.25,
                    top: cellSize * 0.25,
                  }}
                />
                {/* End marker */}
                <div
                  className="absolute bg-red-500 rounded-full z-10"
                  style={{
                    width: cellSize * 0.5,
                    height: cellSize * 0.5,
                    left: (parseInt(size) - 1) * cellSize + cellSize * 0.25,
                    top: (parseInt(size) - 1) * cellSize + cellSize * 0.25,
                  }}
                />

                {maze.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`absolute ${showSolution && cell.solution ? "bg-violet-500/30" : ""}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        left: x * cellSize,
                        top: y * cellSize,
                        borderTop: cell.walls.top ? "2px solid var(--foreground)" : "none",
                        borderRight: cell.walls.right ? "2px solid var(--foreground)" : "none",
                        borderBottom: cell.walls.bottom ? "2px solid var(--foreground)" : "none",
                        borderLeft: cell.walls.left ? "2px solid var(--foreground)" : "none",
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={showSolution ? "primary" : "secondary"}
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span>End</span>
              </div>
              {showSolution && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-violet-500/30 border border-violet-500" />
                  <span>Solution Path</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">About This Maze</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li>• Generated using recursive backtracking algorithm</li>
            <li>• Every maze has exactly one solution</li>
            <li>• Solution found using BFS (shortest path)</li>
            <li>• Navigate from green (start) to red (end)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
