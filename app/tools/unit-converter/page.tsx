"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("unit-converter")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "unit-converter");

type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "time" | "data";

const units: Record<UnitCategory, { name: string; units: { id: string; name: string; factor: number }[] }> = {
  length: {
    name: "Length",
    units: [
      { id: "mm", name: "Millimeter", factor: 0.001 },
      { id: "cm", name: "Centimeter", factor: 0.01 },
      { id: "m", name: "Meter", factor: 1 },
      { id: "km", name: "Kilometer", factor: 1000 },
      { id: "in", name: "Inch", factor: 0.0254 },
      { id: "ft", name: "Foot", factor: 0.3048 },
      { id: "yd", name: "Yard", factor: 0.9144 },
      { id: "mi", name: "Mile", factor: 1609.344 },
    ],
  },
  weight: {
    name: "Weight",
    units: [
      { id: "mg", name: "Milligram", factor: 0.000001 },
      { id: "g", name: "Gram", factor: 0.001 },
      { id: "kg", name: "Kilogram", factor: 1 },
      { id: "oz", name: "Ounce", factor: 0.0283495 },
      { id: "lb", name: "Pound", factor: 0.453592 },
      { id: "ton", name: "Metric Ton", factor: 1000 },
    ],
  },
  temperature: {
    name: "Temperature",
    units: [
      { id: "c", name: "Celsius", factor: 1 },
      { id: "f", name: "Fahrenheit", factor: 1 },
      { id: "k", name: "Kelvin", factor: 1 },
    ],
  },
  area: {
    name: "Area",
    units: [
      { id: "sqm", name: "Square Meter", factor: 1 },
      { id: "sqkm", name: "Square Kilometer", factor: 1000000 },
      { id: "sqft", name: "Square Foot", factor: 0.092903 },
      { id: "acre", name: "Acre", factor: 4046.86 },
      { id: "ha", name: "Hectare", factor: 10000 },
    ],
  },
  volume: {
    name: "Volume",
    units: [
      { id: "ml", name: "Milliliter", factor: 0.001 },
      { id: "l", name: "Liter", factor: 1 },
      { id: "gal", name: "Gallon (US)", factor: 3.78541 },
      { id: "qt", name: "Quart", factor: 0.946353 },
      { id: "pt", name: "Pint", factor: 0.473176 },
      { id: "cup", name: "Cup", factor: 0.236588 },
    ],
  },
  time: {
    name: "Time",
    units: [
      { id: "ms", name: "Millisecond", factor: 0.001 },
      { id: "s", name: "Second", factor: 1 },
      { id: "min", name: "Minute", factor: 60 },
      { id: "hr", name: "Hour", factor: 3600 },
      { id: "day", name: "Day", factor: 86400 },
      { id: "week", name: "Week", factor: 604800 },
    ],
  },
  data: {
    name: "Data",
    units: [
      { id: "b", name: "Byte", factor: 1 },
      { id: "kb", name: "Kilobyte", factor: 1024 },
      { id: "mb", name: "Megabyte", factor: 1048576 },
      { id: "gb", name: "Gigabyte", factor: 1073741824 },
      { id: "tb", name: "Terabyte", factor: 1099511627776 },
    ],
  },
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");

  const convert = (): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    
    // Special handling for temperature
    if (category === "temperature") {
      let celsius: number;
      
      // Convert to Celsius first
      if (fromUnit === "f") celsius = (num - 32) * 5/9;
      else if (fromUnit === "k") celsius = num - 273.15;
      else celsius = num;
      
      // Convert from Celsius to target
      if (toUnit === "f") return ((celsius * 9/5) + 32).toFixed(4);
      if (toUnit === "k") return (celsius + 273.15).toFixed(4);
      return celsius.toFixed(4);
    }
    
    const from = units[category].units.find(u => u.id === fromUnit);
    const to = units[category].units.find(u => u.id === toUnit);
    
    if (!from || !to) return "";
    
    const baseValue = num * from.factor;
    const result = baseValue / to.factor;
    
    return result.toFixed(6).replace(/\.?0+$/, "");
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    setFromUnit(units[newCategory].units[0].id);
    setToUnit(units[newCategory].units[1].id);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(units) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              {units[cat].name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {units[category].units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {units[category].units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-2">Result</div>
          <div className="text-3xl font-bold font-mono">
            {convert()} <span className="text-lg text-[var(--muted-foreground)]">{toUnit}</span>
          </div>
        </div>

        <button
          onClick={() => {
            const temp = fromUnit;
            setFromUnit(toUnit);
            setToUnit(temp);
          }}
          className="w-full py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
        >
          🔄 Swap Units
        </button>
      </div>
    </ToolLayout>
  );
}
