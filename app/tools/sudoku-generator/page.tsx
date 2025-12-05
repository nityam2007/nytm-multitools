// Sudoku Generator Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("sudoku-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "sudoku-generator");

type SudokuGrid = (number | null)[][];

const difficultyOptions = [
  { value: "easy", label: "Easy (40 clues)" },
  { value: "medium", label: "Medium (32 clues)" },
  { value: "hard", label: "Hard (25 clues)" },
  { value: "expert", label: "Expert (20 clues)" },
];

export default function SudokuGeneratorPage() {
  const [puzzle, setPuzzle] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [showSolution, setShowSolution] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Check if number is valid in position
  const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  // Solve sudoku using backtracking
  const solve = (grid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          // Shuffle for randomness
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          }
          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Generate a complete solved grid
  const generateSolvedGrid = (): SudokuGrid => {
    const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
    solve(grid);
    return grid;
  };

  // Remove numbers based on difficulty
  const createPuzzle = (solvedGrid: SudokuGrid, diff: string): SudokuGrid => {
    const clues: Record<string, number> = {
      easy: 40,
      medium: 32,
      hard: 25,
      expert: 20,
    };
    
    const puzzle: SudokuGrid = solvedGrid.map(row => [...row]);
    const cellsToRemove = 81 - clues[diff];
    
    const positions: [number, number][] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = null;
    }
    
    return puzzle;
  };

  const generateSudoku = useCallback(async () => {
    const startTime = Date.now();
    
    const solvedGrid = generateSolvedGrid();
    const puzzleGrid = createPuzzle(solvedGrid, difficulty);
    
    setSolution(solvedGrid);
    setPuzzle(puzzleGrid);
    setShowSolution(false);
    setSelectedCell(null);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "none",
      outputResult: `[SUDOKU ${difficulty}]`,
      processingDuration: Date.now() - startTime,
      metadata: { difficulty },
    });
  }, [difficulty]);

  const copyAsText = async () => {
    if (!puzzle) return;
    const grid = showSolution && solution ? solution : puzzle;
    let text = "";
    for (let i = 0; i < 9; i++) {
      if (i % 3 === 0 && i !== 0) text += "------+-------+------\n";
      for (let j = 0; j < 9; j++) {
        if (j % 3 === 0 && j !== 0) text += "| ";
        text += (grid[i][j] || ".") + " ";
      }
      text += "\n";
    }
    await navigator.clipboard.writeText(text);
  };

  const getCellClass = (row: number, col: number, value: number | null) => {
    const baseClass = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-mono transition-all duration-200";
    const borderRight = (col + 1) % 3 === 0 && col !== 8 ? "border-r-2 border-r-violet-500/50" : "border-r border-r-[var(--border)]";
    const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? "border-b-2 border-b-violet-500/50" : "border-b border-b-[var(--border)]";
    
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isEmpty = value === null;
    
    let bgClass = "bg-[var(--card)]";
    if (isSelected) bgClass = "bg-violet-500/20";
    else if (isEmpty && !showSolution) bgClass = "bg-[var(--muted)]";
    
    const textClass = isEmpty && showSolution ? "text-green-500 font-bold" : "text-[var(--foreground)]";
    
    return `${baseClass} ${borderRight} ${borderBottom} ${bgClass} ${textClass} cursor-pointer hover:bg-violet-500/10`;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Difficulty"
              options={difficultyOptions}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={generateSudoku} size="lg">
              Generate New Puzzle
            </Button>
          </div>
        </div>

        {/* Sudoku Grid */}
        {puzzle && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="inline-block border-2 border-violet-500/50 rounded-lg overflow-hidden bg-[var(--card)]">
                {puzzle.map((row, i) => (
                  <div key={i} className="flex">
                    {row.map((cell, j) => {
                      const displayValue = showSolution && solution ? solution[i][j] : cell;
                      return (
                        <div
                          key={`${i}-${j}`}
                          className={getCellClass(i, j, cell)}
                          onClick={() => setSelectedCell({ row: i, col: j })}
                        >
                          {displayValue}
                        </div>
                      );
                    })}
                  </div>
                ))}
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
              <Button variant="secondary" onClick={copyAsText}>
                Copy as Text
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span>
                Clues: {puzzle.flat().filter(c => c !== null).length}
              </span>
              <span>•</span>
              <span>
                Empty: {puzzle.flat().filter(c => c === null).length}
              </span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">How to Play Sudoku</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li>• Fill in the grid so every row contains 1-9</li>
            <li>• Every column must contain 1-9</li>
            <li>• Every 3x3 box must contain 1-9</li>
            <li>• No number can repeat in any row, column, or box</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
