"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("bmi-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "bmi-calculator");

type Unit = "metric" | "imperial";

export default function BmiCalculatorPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const bmiResult = useMemo(() => {
    let heightInMeters: number;
    let weightInKg: number;

    if (unit === "metric") {
      heightInMeters = parseFloat(heightCm) / 100;
      weightInKg = parseFloat(weight);
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      heightInMeters = totalInches * 0.0254;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    if (!heightInMeters || !weightInKg || heightInMeters <= 0) {
      return null;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    let category: string;
    let color: string;
    
    if (bmi < 16) {
      category = "Severe Thinness";
      color = "text-red-600";
    } else if (bmi < 17) {
      category = "Moderate Thinness";
      color = "text-orange-500";
    } else if (bmi < 18.5) {
      category = "Mild Thinness";
      color = "text-yellow-500";
    } else if (bmi < 25) {
      category = "Normal";
      color = "text-green-500";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-500";
    } else if (bmi < 35) {
      category = "Obese Class I";
      color = "text-orange-500";
    } else if (bmi < 40) {
      category = "Obese Class II";
      color = "text-red-500";
    } else {
      category = "Obese Class III";
      color = "text-red-600";
    }

    // Calculate healthy weight range
    const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
    const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters;

    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      minHealthyWeight: unit === "metric" 
        ? minHealthyWeight.toFixed(1) + " kg"
        : (minHealthyWeight * 2.205).toFixed(1) + " lbs",
      maxHealthyWeight: unit === "metric"
        ? maxHealthyWeight.toFixed(1) + " kg"
        : (maxHealthyWeight * 2.205).toFixed(1) + " lbs",
      heightInMeters,
      weightInKg,
    };
  }, [unit, weight, heightCm, heightFt, heightIn]);

  const bmiScale = [
    { label: "Severe Thinness", min: 0, max: 16, color: "bg-red-600" },
    { label: "Moderate Thinness", min: 16, max: 17, color: "bg-orange-500" },
    { label: "Mild Thinness", min: 17, max: 18.5, color: "bg-yellow-500" },
    { label: "Normal", min: 18.5, max: 25, color: "bg-green-500" },
    { label: "Overweight", min: 25, max: 30, color: "bg-yellow-500" },
    { label: "Obese I", min: 30, max: 35, color: "bg-orange-500" },
    { label: "Obese II", min: 35, max: 40, color: "bg-red-500" },
    { label: "Obese III", min: 40, max: 50, color: "bg-red-600" },
  ];

  const getBmiPosition = (bmi: number) => {
    const clamped = Math.max(10, Math.min(50, bmi));
    return ((clamped - 10) / 40) * 100;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setUnit("metric")}
            className={`px-4 py-2 rounded-lg font-medium ${
              unit === "metric"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnit("imperial")}
            className={`px-4 py-2 rounded-lg font-medium ${
              unit === "imperial"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Imperial (lbs/ft)
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>

          {unit === "metric" ? (
            <div>
              <label className="block text-sm font-medium mb-2">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g., 175"
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-2">Height (ft)</label>
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (in)</label>
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="9"
                  min="0"
                  max="11"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Age (optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 25"
              min="0"
              max="120"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender (optional)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {bmiResult && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-2">Your BMI</div>
              <div className={`text-6xl font-bold ${bmiResult.color}`}>
                {bmiResult.bmi}
              </div>
              <div className={`text-xl font-medium mt-2 ${bmiResult.color}`}>
                {bmiResult.category}
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">BMI Scale</h3>
              <div className="relative">
                <div className="flex h-6 rounded-full overflow-hidden">
                  {bmiScale.map((segment, idx) => (
                    <div
                      key={idx}
                      className={`${segment.color} flex-1`}
                      style={{ flex: segment.max - segment.min }}
                    />
                  ))}
                </div>
                <div
                  className="absolute top-0 -translate-x-1/2"
                  style={{ left: `${getBmiPosition(parseFloat(bmiResult.bmi))}%` }}
                >
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-black dark:border-t-white" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-sm font-bold whitespace-nowrap">
                    {bmiResult.bmi}
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-2 text-[var(--muted-foreground)]">
                  <span>10</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                <div className="text-sm text-[var(--muted-foreground)]">Healthy Weight Range</div>
                <div className="font-bold">{bmiResult.minHealthyWeight} - {bmiResult.maxHealthyWeight}</div>
              </div>
              <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                <div className="text-sm text-[var(--muted-foreground)]">BMI Prime</div>
                <div className="font-bold">{(parseFloat(bmiResult.bmi) / 25).toFixed(2)}</div>
              </div>
            </div>
          </>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            BMI Categories (WHO)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3">Category</th>
                  <th className="text-left py-2 px-3">BMI Range</th>
                </tr>
              </thead>
              <tbody>
                {bmiScale.slice(0, -1).map((cat, idx) => (
                  <tr key={idx} className="border-b border-[var(--border)]">
                    <td className="py-2 px-3 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      {cat.label}
                    </td>
                    <td className="py-2 px-3 font-mono">
                      {cat.min === 0 ? `< ${cat.max}` : cat.max === 40 ? `≥ ${cat.min}` : `${cat.min} - ${cat.max}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)] flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>BMI is a general indicator and does not account for muscle mass, bone density, or body composition. Consult a healthcare professional for personalized health advice.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
