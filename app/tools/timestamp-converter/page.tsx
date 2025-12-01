"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("timestamp-converter")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "timestamp-converter");

export default function TimestampConverterPage() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"timestamp" | "date">("timestamp");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      let date: Date;
      
      if (inputType === "timestamp") {
        const timestamp = parseInt(input, 10);
        if (isNaN(timestamp)) throw new Error("Invalid timestamp");
        date = new Date(unit === "seconds" ? timestamp * 1000 : timestamp);
      } else {
        date = new Date(input);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
      }

      const newResults = {
        "Unix (seconds)": Math.floor(date.getTime() / 1000).toString(),
        "Unix (milliseconds)": date.getTime().toString(),
        "ISO 8601": date.toISOString(),
        "UTC String": date.toUTCString(),
        "Local String": date.toLocaleString(),
        "Date Only": date.toLocaleDateString(),
        "Time Only": date.toLocaleTimeString(),
        "Year": date.getFullYear().toString(),
        "Month": (date.getMonth() + 1).toString().padStart(2, "0"),
        "Day": date.getDate().toString().padStart(2, "0"),
        "Day of Week": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()],
        "Hours": date.getHours().toString().padStart(2, "0"),
        "Minutes": date.getMinutes().toString().padStart(2, "0"),
        "Seconds": date.getSeconds().toString().padStart(2, "0"),
        "RFC 2822": date.toString(),
      };

      setResults(newResults);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: JSON.stringify(newResults),
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError((e as Error).message || "Failed to convert");
      setResults({});
    }
  };

  const setCurrentTime = () => {
    if (inputType === "timestamp") {
      const now = unit === "seconds" ? Math.floor(Date.now() / 1000) : Date.now();
      setInput(now.toString());
    } else {
      setInput(new Date().toISOString());
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Input Type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as typeof inputType)}
              className="input w-full"
            >
              <option value="timestamp">Unix Timestamp</option>
              <option value="date">Date String</option>
            </select>
          </div>
          
          {inputType === "timestamp" && (
            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as typeof unit)}
                className="input w-full"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {inputType === "timestamp" ? "Timestamp" : "Date String"}
            </label>
            <button onClick={setCurrentTime} className="text-sm text-primary hover:underline">
              Use current time
            </button>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder={inputType === "timestamp" ? "1704067200" : "2024-01-01T00:00:00Z"}
            className="input w-full"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert
        </button>

        {Object.keys(results).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(results).map(([label, value]) => (
              <div key={label} className="card p-3">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-mono text-sm break-all">{value}</p>
              </div>
            ))}
          </div>
        )}

        <OutputBox
          label="JSON Output"
          value={Object.keys(results).length > 0 ? JSON.stringify(results, null, 2) : ""}
          downloadFileName="timestamp.json"
        />
      </div>
    </ToolLayout>
  );
}
