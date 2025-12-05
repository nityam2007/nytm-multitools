// CSV to Chart Builder Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("csv-chart-builder")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "csv-chart-builder");

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "horizontal-bar", label: "Horizontal Bar" },
];

const colorSchemes = [
  { value: "default", label: "Default (Violet)" },
  { value: "rainbow", label: "Rainbow" },
  { value: "cool", label: "Cool Blues" },
  { value: "warm", label: "Warm Reds" },
];

const sampleCSV = `Category,Value
Electronics,450
Clothing,320
Food,280
Books,150
Sports,200`;

export default function CSVChartBuilderPage() {
  const [csvData, setCsvData] = useState(sampleCSV);
  const [chartType, setChartType] = useState("bar");
  const [colorScheme, setColorScheme] = useState("default");
  const [labelColumn, setLabelColumn] = useState("0");
  const [valueColumn, setValueColumn] = useState("1");

  const parsedData = useMemo(() => {
    try {
      const lines = csvData.trim().split("\n");
      if (lines.length < 2) return null;

      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        return values;
      });

      return { headers, rows };
    } catch {
      return null;
    }
  }, [csvData]);

  const columnOptions = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.headers.map((h, i) => ({ value: String(i), label: h }));
  }, [parsedData]);

  const chartData = useMemo(() => {
    if (!parsedData) return [];
    const labelIdx = parseInt(labelColumn);
    const valueIdx = parseInt(valueColumn);

    return parsedData.rows.map(row => ({
      label: row[labelIdx] || "",
      value: parseFloat(row[valueIdx]) || 0,
    })).filter(d => d.label && !isNaN(d.value));
  }, [parsedData, labelColumn, valueColumn]);

  const getColor = (index: number, total: number) => {
    const schemes: Record<string, string[]> = {
      default: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#6d28d9"],
      rainbow: ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"],
      cool: ["#0ea5e9", "#38bdf8", "#7dd3fc", "#0284c7", "#0369a1"],
      warm: ["#ef4444", "#f97316", "#fb923c", "#dc2626", "#b91c1c"],
    };
    const colors = schemes[colorScheme] || schemes.default;
    return colors[index % colors.length];
  };

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="text-center text-[var(--muted-foreground)] py-12">
          No valid data to display. Check your CSV format.
        </div>
      );
    }

    const width = 500;
    const height = 300;
    const padding = 60;

    switch (chartType) {
      case "bar":
        const barWidth = (width - padding * 2) / chartData.length - 10;
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            {/* Y-axis */}
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--border)" />
            {/* X-axis */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" />
            
            {/* Bars */}
            {chartData.map((d, i) => {
              const barHeight = (d.value / maxValue) * (height - padding * 2);
              const x = padding + i * (barWidth + 10) + 5;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={height - padding - barHeight}
                    width={barWidth}
                    height={barHeight}
                    fill={getColor(i, chartData.length)}
                    rx="4"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={height - padding + 15}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--foreground)"
                  >
                    {d.label.length > 8 ? d.label.slice(0, 8) + ".." : d.label}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={height - padding - barHeight - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--foreground)"
                  >
                    {d.value}
                  </text>
                </g>
              );
            })}
          </svg>
        );

      case "line":
        const pointSpacing = (width - padding * 2) / (chartData.length - 1 || 1);
        const points = chartData.map((d, i) => ({
          x: padding + i * pointSpacing,
          y: height - padding - (d.value / maxValue) * (height - padding * 2),
        }));
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={padding}
                y1={height - padding - ratio * (height - padding * 2)}
                x2={width - padding}
                y2={height - padding - ratio * (height - padding * 2)}
                stroke="var(--border)"
                strokeDasharray="4"
              />
            ))}
            
            {/* Line */}
            <polyline
              fill="none"
              stroke={getColor(0, 1)}
              strokeWidth="3"
              points={points.map(p => `${p.x},${p.y}`).join(" ")}
            />
            
            {/* Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill={getColor(0, 1)} />
                <text
                  x={p.x}
                  y={height - padding + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--foreground)"
                >
                  {chartData[i].label.length > 6 ? chartData[i].label.slice(0, 6) + ".." : chartData[i].label}
                </text>
              </g>
            ))}
          </svg>
        );

      case "pie":
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        let startAngle = 0;
        
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            {chartData.map((d, i) => {
              const angle = (d.value / totalValue) * Math.PI * 2;
              const endAngle = startAngle + angle;
              const largeArc = angle > Math.PI ? 1 : 0;
              
              const x1 = cx + radius * Math.cos(startAngle);
              const y1 = cy + radius * Math.sin(startAngle);
              const x2 = cx + radius * Math.cos(endAngle);
              const y2 = cy + radius * Math.sin(endAngle);
              
              const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
              
              const labelAngle = startAngle + angle / 2;
              const labelRadius = radius * 0.7;
              const labelX = cx + labelRadius * Math.cos(labelAngle);
              const labelY = cy + labelRadius * Math.sin(labelAngle);
              
              startAngle = endAngle;
              
              return (
                <g key={i}>
                  <path d={pathD} fill={getColor(i, chartData.length)} stroke="var(--background)" strokeWidth="2" />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                  >
                    {Math.round((d.value / totalValue) * 100)}%
                  </text>
                </g>
              );
            })}
            
            {/* Legend */}
            {chartData.map((d, i) => (
              <g key={`legend-${i}`}>
                <rect x={10} y={10 + i * 20} width="12" height="12" fill={getColor(i, chartData.length)} rx="2" />
                <text x={28} y={20 + i * 20} fontSize="11" fill="var(--foreground)">{d.label}</text>
              </g>
            ))}
          </svg>
        );

      case "horizontal-bar":
        const hBarHeight = (height - padding * 2) / chartData.length - 10;
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            {chartData.map((d, i) => {
              const barWidth2 = (d.value / maxValue) * (width - padding * 2 - 80);
              const y = padding + i * (hBarHeight + 10);
              return (
                <g key={i}>
                  <text
                    x={padding - 5}
                    y={y + hBarHeight / 2 + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--foreground)"
                  >
                    {d.label.length > 10 ? d.label.slice(0, 10) + ".." : d.label}
                  </text>
                  <rect
                    x={padding}
                    y={y}
                    width={barWidth2}
                    height={hBarHeight}
                    fill={getColor(i, chartData.length)}
                    rx="4"
                  />
                  <text
                    x={padding + barWidth2 + 5}
                    y={y + hBarHeight / 2 + 4}
                    fontSize="10"
                    fill="var(--foreground)"
                  >
                    {d.value}
                  </text>
                </g>
              );
            })}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* CSV Input */}
        <TextArea
          label="CSV Data"
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          rows={6}
          placeholder="Category,Value&#10;Item1,100&#10;Item2,200"
          helperText="First row should be headers. Use comma as separator."
        />

        {/* Chart Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Select
            label="Chart Type"
            options={chartTypes}
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          />
          <Select
            label="Color Scheme"
            options={colorSchemes}
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
          />
          {columnOptions.length > 0 && (
            <>
              <Select
                label="Label Column"
                options={columnOptions}
                value={labelColumn}
                onChange={(e) => setLabelColumn(e.target.value)}
              />
              <Select
                label="Value Column"
                options={columnOptions}
                value={valueColumn}
                onChange={(e) => setValueColumn(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Chart Display */}
        <div className="p-4 sm:p-6 bg-[var(--card)] rounded-xl border border-[var(--border)]">
          {renderChart()}
        </div>

        {/* Data Preview */}
        {parsedData && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {parsedData.headers.map((h, i) => (
                    <th key={i} className="text-left py-2 px-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 px-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.rows.length > 5 && (
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Showing first 5 of {parsedData.rows.length} rows
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
