// Optical Illusion Generator Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("optical-illusion-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "optical-illusion-generator");

const illusionTypes = [
  { value: "checkerboard", label: "Checkerboard Illusion" },
  { value: "spiral", label: "Rotating Spiral" },
  { value: "grid", label: "Hermann Grid" },
  { value: "cafe-wall", label: "Café Wall Illusion" },
  { value: "motion", label: "Motion Illusion" },
  { value: "circles", label: "Concentric Circles" },
];

export default function OpticalIllusionGeneratorPage() {
  const [illusionType, setIllusionType] = useState("checkerboard");
  const [size, setSize] = useState("400");
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const [speed, setSpeed] = useState("2");

  const renderIllusion = useMemo(() => {
    const s = parseInt(size) || 400;

    switch (illusionType) {
      case "checkerboard":
        return (
          <svg viewBox={`0 0 ${s} ${s}`} className="w-full max-w-[400px]">
            <defs>
              <pattern id="checker" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill={color1} />
                <rect x="20" width="20" height="20" fill={color2} />
                <rect y="20" width="20" height="20" fill={color2} />
                <rect x="20" y="20" width="20" height="20" fill={color1} />
              </pattern>
            </defs>
            <rect width={s} height={s} fill="url(#checker)" />
            {/* Shadow spots that create illusion */}
            {Array.from({ length: 9 }).map((_, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              return (
                <circle
                  key={i}
                  cx={80 + col * 120}
                  cy={80 + row * 120}
                  r="8"
                  fill="gray"
                  opacity="0.3"
                />
              );
            })}
          </svg>
        );

      case "spiral":
        const spiralArms = 8;
        const spiralTurns = 4;
        return (
          <svg viewBox={`0 0 ${s} ${s}`} className="w-full max-w-[400px]">
            <style>{`
              @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              .spiral-group { animation: rotate ${speed}s linear infinite; transform-origin: center; }
            `}</style>
            <g className="spiral-group">
              {Array.from({ length: spiralArms }).map((_, i) => {
                const angle = (i / spiralArms) * Math.PI * 2;
                const points: string[] = [];
                for (let t = 0; t <= spiralTurns * Math.PI * 2; t += 0.1) {
                  const r = 10 + t * 15;
                  const x = s / 2 + r * Math.cos(angle + t);
                  const y = s / 2 + r * Math.sin(angle + t);
                  points.push(`${x},${y}`);
                }
                return (
                  <polyline
                    key={i}
                    points={points.join(" ")}
                    fill="none"
                    stroke={i % 2 === 0 ? color1 : color2}
                    strokeWidth="8"
                  />
                );
              })}
            </g>
          </svg>
        );

      case "grid":
        const gridSize = 8;
        const cellSize = s / gridSize;
        return (
          <svg viewBox={`0 0 ${s} ${s}`} className="w-full max-w-[400px]">
            <rect width={s} height={s} fill={color2} />
            {Array.from({ length: gridSize }).map((_, row) =>
              Array.from({ length: gridSize }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col * cellSize + 4}
                  y={row * cellSize + 4}
                  width={cellSize - 8}
                  height={cellSize - 8}
                  fill={color1}
                />
              ))
            )}
            <text
              x={s / 2}
              y={s + 30}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="12"
            >
              Look at intersections - do you see gray dots?
            </text>
          </svg>
        );

      case "cafe-wall":
        const rows = 10;
        const brickWidth = 40;
        const brickHeight = 20;
        return (
          <svg viewBox={`0 0 ${s} ${rows * brickHeight + 20}`} className="w-full max-w-[400px]">
            {Array.from({ length: rows }).map((_, row) => {
              const offset = row % 2 === 0 ? 0 : brickWidth / 2;
              return (
                <g key={row}>
                  <line
                    x1={0}
                    y1={row * brickHeight + 10}
                    x2={s}
                    y2={row * brickHeight + 10}
                    stroke="gray"
                    strokeWidth="2"
                  />
                  {Array.from({ length: Math.ceil(s / brickWidth) + 1 }).map((_, col) => (
                    <rect
                      key={col}
                      x={col * brickWidth - offset}
                      y={row * brickHeight + 12}
                      width={brickWidth / 2}
                      height={brickHeight - 4}
                      fill={col % 2 === 0 ? color1 : color2}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        );

      case "motion":
        return (
          <svg viewBox={`0 0 ${s} ${s}`} className="w-full max-w-[400px]">
            <style>{`
              @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
              .motion-ring { animation: pulse ${speed}s ease-in-out infinite; }
            `}</style>
            <rect width={s} height={s} fill={color2} />
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={s / 2}
                cy={s / 2}
                r={20 + i * 15}
                fill="none"
                stroke={color1}
                strokeWidth="8"
                className="motion-ring"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </svg>
        );

      case "circles":
        return (
          <svg viewBox={`0 0 ${s} ${s}`} className="w-full max-w-[400px]">
            <rect width={s} height={s} fill={color2} />
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={s / 2}
                cy={s / 2}
                r={180 - i * 12}
                fill="none"
                stroke={i % 2 === 0 ? color1 : color2}
                strokeWidth="6"
              />
            ))}
            {/* Dots that seem to appear/disappear */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={`dot-${i}`}
                  cx={s / 2 + 100 * Math.cos(angle)}
                  cy={s / 2 + 100 * Math.sin(angle)}
                  r="6"
                  fill={color1}
                />
              );
            })}
          </svg>
        );

      default:
        return null;
    }
  }, [illusionType, size, color1, color2, speed]);

  const getDescription = () => {
    switch (illusionType) {
      case "checkerboard":
        return "The gray dots create a shimmering effect at the intersections.";
      case "spiral":
        return "Stare at the center - the spiral appears to be moving even when still.";
      case "grid":
        return "Look at the white intersections - ghost gray dots appear and disappear.";
      case "cafe-wall":
        return "The horizontal lines are perfectly parallel, but appear to be tilted.";
      case "motion":
        return "The pulsing rings create a sense of depth and movement.";
      case "circles":
        return "The concentric circles can create a sense of rotation or depth.";
      default:
        return "";
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Illusion Type"
            options={illusionTypes}
            value={illusionType}
            onChange={(e) => setIllusionType(e.target.value)}
          />
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-1.5 sm:mb-2">
              Color 1
            </label>
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-1.5 sm:mb-2">
              Color 2
            </label>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer border border-[var(--border)]"
            />
          </div>
          {(illusionType === "spiral" || illusionType === "motion") && (
            <Input
              label="Animation Speed (s)"
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              min="0.5"
              max="10"
              step="0.5"
            />
          )}
        </div>

        {/* Illusion Display */}
        <div className="flex justify-center p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          {renderIllusion}
        </div>

        {/* Description */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">{illusionTypes.find(t => t.value === illusionType)?.label}</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{getDescription()}</p>
        </div>

        {/* Info */}
        <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold mb-2 text-sm">How Optical Illusions Work</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li>• Our brain makes assumptions to process visual information quickly</li>
            <li>• Contrast and patterns can trick the visual cortex</li>
            <li>• Motion illusions exploit how our eyes track movement</li>
            <li>• These illusions reveal how perception differs from reality</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
