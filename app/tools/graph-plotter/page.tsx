// Graph Plotter Tool | TypeScript
"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("graph-plotter")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "graph-plotter");

interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const colors = ["#8b5cf6", "#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#ec4899"];

const presetFunctions = [
  { value: "", label: "Select preset..." },
  { value: "x", label: "Linear: y = x" },
  { value: "x^2", label: "Quadratic: y = x²" },
  { value: "x^3", label: "Cubic: y = x³" },
  { value: "Math.sin(x)", label: "Sine: y = sin(x)" },
  { value: "Math.cos(x)", label: "Cosine: y = cos(x)" },
  { value: "Math.tan(x)", label: "Tangent: y = tan(x)" },
  { value: "Math.sqrt(x)", label: "Square Root: y = √x" },
  { value: "Math.abs(x)", label: "Absolute: y = |x|" },
  { value: "1/x", label: "Reciprocal: y = 1/x" },
  { value: "Math.exp(x)", label: "Exponential: y = eˣ" },
  { value: "Math.log(x)", label: "Natural Log: y = ln(x)" },
];

export default function GraphPlotterPage() {
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: "1", expression: "x^2", color: colors[0], visible: true },
  ]);
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const [yMin, setYMin] = useState("-10");
  const [yMax, setYMax] = useState("10");
  const [gridSize, setGridSize] = useState("1");
  const [newExpression, setNewExpression] = useState("");

  const addFunction = useCallback(() => {
    if (!newExpression.trim()) return;
    setFunctions([
      ...functions,
      {
        id: Date.now().toString(),
        expression: newExpression,
        color: colors[functions.length % colors.length],
        visible: true,
      },
    ]);
    setNewExpression("");
  }, [functions, newExpression]);

  const updateFunction = (id: string, field: keyof GraphFunction, value: string | boolean) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeFunction = (id: string) => {
    if (functions.length > 1) {
      setFunctions(functions.filter(f => f.id !== id));
    }
  };

  const handlePreset = (value: string) => {
    if (value) {
      setNewExpression(value);
    }
  };

  // Evaluate expression safely
  const evaluateExpression = (expr: string, x: number): number | null => {
    try {
      // Replace common math notations
      let sanitized = expr
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/abs/g, "Math.abs")
        .replace(/log/g, "Math.log")
        .replace(/exp/g, "Math.exp")
        .replace(/pi/gi, "Math.PI")
        .replace(/e(?![xp])/g, "Math.E");
      
      // Avoid double Math.Math
      sanitized = sanitized.replace(/Math\.Math\./g, "Math.");
      
      // eslint-disable-next-line no-new-func
      const fn = new Function("x", `return ${sanitized}`);
      const result = fn(x);
      
      if (typeof result === "number" && isFinite(result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Generate points for each function
  const plotData = useMemo(() => {
    const xMinNum = parseFloat(xMin) || -10;
    const xMaxNum = parseFloat(xMax) || 10;
    const steps = 200;
    const stepSize = (xMaxNum - xMinNum) / steps;

    return functions
      .filter(f => f.visible)
      .map(f => {
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= steps; i++) {
          const x = xMinNum + i * stepSize;
          const y = evaluateExpression(f.expression, x);
          if (y !== null) {
            points.push({ x, y });
          }
        }
        return { ...f, points };
      });
  }, [functions, xMin, xMax]);

  // SVG dimensions
  const width = 600;
  const height = 400;
  const padding = 40;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const xMinNum = parseFloat(xMin) || -10;
  const xMaxNum = parseFloat(xMax) || 10;
  const yMinNum = parseFloat(yMin) || -10;
  const yMaxNum = parseFloat(yMax) || 10;

  const scaleX = (x: number) => padding + ((x - xMinNum) / (xMaxNum - xMinNum)) * plotWidth;
  const scaleY = (y: number) => padding + ((yMaxNum - y) / (yMaxNum - yMinNum)) * plotHeight;

  // Grid lines
  const gridStep = parseFloat(gridSize) || 1;
  const xGridLines = [];
  const yGridLines = [];
  
  for (let x = Math.ceil(xMinNum / gridStep) * gridStep; x <= xMaxNum; x += gridStep) {
    xGridLines.push(x);
  }
  for (let y = Math.ceil(yMinNum / gridStep) * gridStep; y <= yMaxNum; y += gridStep) {
    yGridLines.push(y);
  }

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Function Input */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Add Function (y = )"
              value={newExpression}
              onChange={(e) => setNewExpression(e.target.value)}
              placeholder="e.g., x^2, sin(x), 2*x + 1"
              helperText="Use x as variable. Supports: ^, sin, cos, tan, sqrt, abs, log, exp, pi"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Presets"
              options={presetFunctions}
              value=""
              onChange={(e) => handlePreset(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addFunction}>Add</Button>
          </div>
        </div>

        {/* Current Functions */}
        <div className="space-y-2">
          {functions.map((fn, index) => (
            <div
              key={fn.id}
              className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]"
            >
              <input
                type="checkbox"
                checked={fn.visible}
                onChange={(e) => updateFunction(fn.id, "visible", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: fn.color }}
              />
              <input
                type="text"
                value={fn.expression}
                onChange={(e) => updateFunction(fn.id, "expression", e.target.value)}
                className="flex-1 bg-transparent text-sm font-mono focus:outline-none"
              />
              <input
                type="color"
                value={fn.color}
                onChange={(e) => updateFunction(fn.id, "color", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              {functions.length > 1 && (
                <button
                  onClick={() => removeFunction(fn.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Graph Display */}
        <div className="p-4 bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[600px] mx-auto"
            style={{ background: "var(--muted)" }}
          >
            {/* Grid */}
            {xGridLines.map(x => (
              <line
                key={`gx-${x}`}
                x1={scaleX(x)}
                y1={padding}
                x2={scaleX(x)}
                y2={height - padding}
                stroke="var(--border)"
                strokeWidth="0.5"
              />
            ))}
            {yGridLines.map(y => (
              <line
                key={`gy-${y}`}
                x1={padding}
                y1={scaleY(y)}
                x2={width - padding}
                y2={scaleY(y)}
                stroke="var(--border)"
                strokeWidth="0.5"
              />
            ))}

            {/* Axes */}
            {xMinNum <= 0 && xMaxNum >= 0 && (
              <line
                x1={scaleX(0)}
                y1={padding}
                x2={scaleX(0)}
                y2={height - padding}
                stroke="var(--foreground)"
                strokeWidth="1"
              />
            )}
            {yMinNum <= 0 && yMaxNum >= 0 && (
              <line
                x1={padding}
                y1={scaleY(0)}
                x2={width - padding}
                y2={scaleY(0)}
                stroke="var(--foreground)"
                strokeWidth="1"
              />
            )}

            {/* Axis labels */}
            <text x={width - padding + 5} y={scaleY(0) + 4} fontSize="12" fill="var(--foreground)">x</text>
            <text x={scaleX(0) + 5} y={padding - 5} fontSize="12" fill="var(--foreground)">y</text>

            {/* X-axis numbers */}
            {xGridLines.filter(x => x !== 0).map(x => (
              <text
                key={`xl-${x}`}
                x={scaleX(x)}
                y={height - padding + 15}
                fontSize="10"
                textAnchor="middle"
                fill="var(--muted-foreground)"
              >
                {x}
              </text>
            ))}

            {/* Y-axis numbers */}
            {yGridLines.filter(y => y !== 0).map(y => (
              <text
                key={`yl-${y}`}
                x={padding - 5}
                y={scaleY(y) + 3}
                fontSize="10"
                textAnchor="end"
                fill="var(--muted-foreground)"
              >
                {y}
              </text>
            ))}

            {/* Plot functions */}
            {plotData.map(fn => {
              // Filter points within Y bounds and create path segments
              const validPoints = fn.points.filter(
                p => p.y >= yMinNum && p.y <= yMaxNum
              );

              if (validPoints.length < 2) return null;

              // Create path with gaps for discontinuities
              let pathD = "";
              let prevPoint: { x: number; y: number } | null = null;

              validPoints.forEach((point, i) => {
                const sx = scaleX(point.x);
                const sy = scaleY(point.y);

                if (prevPoint) {
                  const gap = Math.abs(point.y - prevPoint.y) > (yMaxNum - yMinNum) * 0.5;
                  if (gap) {
                    pathD += `M ${sx} ${sy} `;
                  } else {
                    pathD += `L ${sx} ${sy} `;
                  }
                } else {
                  pathD += `M ${sx} ${sy} `;
                }
                prevPoint = point;
              });

              return (
                <path
                  key={fn.id}
                  d={pathD}
                  fill="none"
                  stroke={fn.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>
        </div>

        {/* Range Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Input
            label="X Min"
            type="number"
            value={xMin}
            onChange={(e) => setXMin(e.target.value)}
          />
          <Input
            label="X Max"
            type="number"
            value={xMax}
            onChange={(e) => setXMax(e.target.value)}
          />
          <Input
            label="Y Min"
            type="number"
            value={yMin}
            onChange={(e) => setYMin(e.target.value)}
          />
          <Input
            label="Y Max"
            type="number"
            value={yMax}
            onChange={(e) => setYMax(e.target.value)}
          />
          <Input
            label="Grid Size"
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value)}
            min="0.1"
            step="0.5"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Supported Expressions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-[var(--muted-foreground)] font-mono">
            <span>x^2 (power)</span>
            <span>sin(x), cos(x)</span>
            <span>sqrt(x)</span>
            <span>abs(x)</span>
            <span>log(x) (ln)</span>
            <span>exp(x) (e^x)</span>
            <span>pi, e</span>
            <span>+, -, *, /</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
