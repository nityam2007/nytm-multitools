// Body Fat Calculator | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory, ToolConfig } from "@/lib/tools-config";

const tool = getToolBySlug("body-fat-calculator") as ToolConfig;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "body-fat-calculator");

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

export default function BodyFatCalculatorPage() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");

  const results = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;
    const waistCm = parseFloat(waist) || 0;
    const neckCm = parseFloat(neck) || 0;
    const hipCm = parseFloat(hip) || 0;

    if (w <= 0 || h <= 0) return null;

    // Convert to metric if imperial
    const weightKg = unit === "imperial" ? w * 0.453592 : w;
    const heightCm = unit === "imperial" ? h * 2.54 : h;
    const waistVal = unit === "imperial" ? waistCm * 2.54 : waistCm;
    const neckVal = unit === "imperial" ? neckCm * 2.54 : neckCm;
    const hipVal = unit === "imperial" ? hipCm * 2.54 : hipCm;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    const methods: { name: string; value: number | null; description: string }[] = [];

    // 1. BMI-based estimation (if age provided)
    if (a > 0) {
      let bfBmi: number;
      if (gender === "male") {
        bfBmi = 1.20 * bmi + 0.23 * a - 16.2;
      } else {
        bfBmi = 1.20 * bmi + 0.23 * a - 5.4;
      }
      methods.push({
        name: "BMI Method",
        value: Math.max(0, bfBmi),
        description: "Estimate based on BMI, age, and gender",
      });
    }

    // 2. US Navy Method (if waist & neck provided, hip for females)
    if (waistVal > 0 && neckVal > 0) {
      let bfNavy: number | null = null;
      if (gender === "male") {
        bfNavy = 495 / (1.0324 - 0.19077 * Math.log10(waistVal - neckVal) + 0.15456 * Math.log10(heightCm)) - 450;
      } else if (hipVal > 0) {
        bfNavy = 495 / (1.29579 - 0.35004 * Math.log10(waistVal + hipVal - neckVal) + 0.22100 * Math.log10(heightCm)) - 450;
      }
      if (bfNavy !== null && bfNavy > 0 && bfNavy < 60) {
        methods.push({
          name: "US Navy Method",
          value: bfNavy,
          description: "Uses waist, neck" + (gender === "female" ? ", hip" : "") + " measurements",
        });
      }
    }

    // 3. Simple waist-to-height ratio estimate
    if (waistVal > 0) {
      const whr = waistVal / heightCm;
      let bfWhr: number;
      if (gender === "male") {
        bfWhr = (whr - 0.35) * 100;
      } else {
        bfWhr = (whr - 0.30) * 100;
      }
      if (bfWhr > 0 && bfWhr < 60) {
        methods.push({
          name: "Waist-Height Ratio",
          value: bfWhr,
          description: "Quick estimate using waist and height",
        });
      }
    }

    if (methods.length === 0) return null;

    // Average of all methods
    const avg = methods.reduce((sum, m) => sum + (m.value || 0), 0) / methods.length;

    // Category
    let category = "";
    let color = "";
    if (gender === "male") {
      if (avg < 6) { category = "Essential Fat"; color = "text-red-500"; }
      else if (avg < 14) { category = "Athletes"; color = "text-green-500"; }
      else if (avg < 18) { category = "Fitness"; color = "text-green-600"; }
      else if (avg < 25) { category = "Average"; color = "text-yellow-500"; }
      else { category = "Obese"; color = "text-red-600"; }
    } else {
      if (avg < 14) { category = "Essential Fat"; color = "text-red-500"; }
      else if (avg < 21) { category = "Athletes"; color = "text-green-500"; }
      else if (avg < 25) { category = "Fitness"; color = "text-green-600"; }
      else if (avg < 32) { category = "Average"; color = "text-yellow-500"; }
      else { category = "Obese"; color = "text-red-600"; }
    }

    return { methods, avg, category, color, bmi };
  }, [gender, unit, age, weight, height, waist, neck, hip]);

  const inputClass = "w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Gender & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className={inputClass}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Units</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={inputClass}>
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lbs, in)</option>
            </select>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]">
          <h3 className="font-semibold mb-3">Basic Info (Required)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Weight ({unit === "metric" ? "kg" : "lbs"})</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "70" : "154"} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Height ({unit === "metric" ? "cm" : "in"})</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unit === "metric" ? "175" : "69"} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Age (years)</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]">
          <h3 className="font-semibold mb-1">Body Measurements (Optional)</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">Add these for more accurate US Navy method calculation</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Neck ({unit === "metric" ? "cm" : "in"})</label>
              <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder={unit === "metric" ? "38" : "15"} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Waist ({unit === "metric" ? "cm" : "in"})</label>
              <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder={unit === "metric" ? "85" : "33"} className={inputClass} />
            </div>
            {gender === "female" && (
              <div>
                <label className={labelClass}>Hip ({unit === "metric" ? "cm" : "in"})</label>
                <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder={unit === "metric" ? "95" : "37"} className={inputClass} />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] space-y-4">
            <div className="text-center">
              <p className="text-sm text-[var(--muted-foreground)]">Estimated Body Fat</p>
              <p className="text-4xl font-bold">{results.avg.toFixed(1)}%</p>
              <p className={`text-lg font-medium ${results.color}`}>{results.category}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">BMI: {results.bmi.toFixed(1)}</p>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-sm font-medium mb-2">Methods Used:</p>
              <div className="space-y-2">
                {results.methods.map((m, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-2">{m.description}</span>
                    </span>
                    <span className="font-mono">{m.value?.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Table */}
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-sm font-medium mb-2">Body Fat Categories ({gender === "male" ? "Men" : "Women"}):</p>
              <div className="grid grid-cols-5 gap-1 text-xs text-center">
                {gender === "male" ? (
                  <>
                    <div className="p-2 bg-red-500/20 rounded">Essential<br/>2-5%</div>
                    <div className="p-2 bg-green-500/20 rounded">Athletes<br/>6-13%</div>
                    <div className="p-2 bg-green-600/20 rounded">Fitness<br/>14-17%</div>
                    <div className="p-2 bg-yellow-500/20 rounded">Average<br/>18-24%</div>
                    <div className="p-2 bg-red-600/20 rounded">Obese<br/>25%+</div>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-red-500/20 rounded">Essential<br/>10-13%</div>
                    <div className="p-2 bg-green-500/20 rounded">Athletes<br/>14-20%</div>
                    <div className="p-2 bg-green-600/20 rounded">Fitness<br/>21-24%</div>
                    <div className="p-2 bg-yellow-500/20 rounded">Average<br/>25-31%</div>
                    <div className="p-2 bg-red-600/20 rounded">Obese<br/>32%+</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="p-6 rounded-lg border border-dashed border-[var(--border)] text-center text-[var(--muted-foreground)]">
            Enter weight and height to calculate body fat percentage
          </div>
        )}

        <p className="text-xs text-center text-[var(--muted-foreground)]">
          Results are estimates. For accurate measurements, consult a healthcare professional.
        </p>
      </div>
    </ToolLayout>
  );
}
