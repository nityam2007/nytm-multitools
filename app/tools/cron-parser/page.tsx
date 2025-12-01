"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("cron-parser")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "cron-parser");

const MINUTE_NAMES = Array.from({ length: 60 }, (_, i) => i.toString());
const HOUR_NAMES = Array.from({ length: 24 }, (_, i) => i.toString());
const DAY_NAMES = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseCronField(field: string, min: number, max: number, names?: string[]): number[] {
  const results: Set<number> = new Set();
  
  for (const part of field.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i++) results.add(i);
    } else if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepNum = parseInt(step, 10);
      let start = min, end = max;
      
      if (range !== "*") {
        if (range.includes("-")) {
          [start, end] = range.split("-").map(n => parseInt(n, 10));
        } else {
          start = parseInt(range, 10);
        }
      }
      
      for (let i = start; i <= end; i += stepNum) {
        results.add(i);
      }
    } else if (part.includes("-")) {
      const [start, end] = part.split("-").map(n => parseInt(n, 10));
      for (let i = start; i <= end; i++) results.add(i);
    } else {
      results.add(parseInt(part, 10));
    }
  }
  
  return Array.from(results).sort((a, b) => a - b);
}

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (expected 5 fields)";
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const descriptions: string[] = [];
  
  // Minute
  if (minute === "*") {
    descriptions.push("every minute");
  } else if (minute === "0") {
    descriptions.push("at minute 0");
  } else {
    const minutes = parseCronField(minute, 0, 59);
    descriptions.push(`at minute ${minutes.join(", ")}`);
  }
  
  // Hour
  if (hour !== "*") {
    const hours = parseCronField(hour, 0, 23);
    descriptions.push(`past hour ${hours.join(", ")}`);
  }
  
  // Day of month
  if (dayOfMonth !== "*") {
    const days = parseCronField(dayOfMonth, 1, 31);
    descriptions.push(`on day ${days.join(", ")} of the month`);
  }
  
  // Month
  if (month !== "*") {
    const months = parseCronField(month, 1, 12);
    descriptions.push(`in ${months.map(m => MONTH_NAMES[m - 1]).join(", ")}`);
  }
  
  // Day of week
  if (dayOfWeek !== "*") {
    const days = parseCronField(dayOfWeek, 0, 6);
    descriptions.push(`on ${days.map(d => WEEKDAY_NAMES[d]).join(", ")}`);
  }
  
  return descriptions.join(" ") || "every minute";
}

function getNextRuns(cron: string, count: number = 5): Date[] {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const minutes = parseCronField(minute, 0, 59);
  const hours = parseCronField(hour, 0, 23);
  const daysOfMonth = parseCronField(dayOfMonth, 1, 31);
  const months = parseCronField(month, 1, 12);
  const daysOfWeek = parseCronField(dayOfWeek, 0, 6);
  
  const results: Date[] = [];
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
  
  while (results.length < count) {
    if (current.getFullYear() > now.getFullYear() + 2) break;
    
    const monthMatch = month === "*" || months.includes(current.getMonth() + 1);
    const dayMatch = dayOfMonth === "*" || daysOfMonth.includes(current.getDate());
    const weekdayMatch = dayOfWeek === "*" || daysOfWeek.includes(current.getDay());
    const hourMatch = hour === "*" || hours.includes(current.getHours());
    const minuteMatch = minute === "*" || minutes.includes(current.getMinutes());
    
    if (monthMatch && dayMatch && weekdayMatch && hourMatch && minuteMatch) {
      results.push(new Date(current));
    }
    
    current.setMinutes(current.getMinutes() + 1);
  }
  
  return results;
}

export default function CronParserPage() {
  const [input, setInput] = useState("0 9 * * 1-5");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState("");

  const commonExpressions = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every day at 9am", value: "0 9 * * *" },
    { label: "Every Monday at 9am", value: "0 9 * * 1" },
    { label: "Weekdays at 9am", value: "0 9 * * 1-5" },
    { label: "Every 15 minutes", value: "*/15 * * * *" },
    { label: "First of month at midnight", value: "0 0 1 * *" },
  ];

  const handleParse = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const parts = input.trim().split(/\s+/);
      if (parts.length !== 5) {
        throw new Error("Invalid cron expression. Expected 5 fields: minute hour day month weekday");
      }

      const desc = describeCron(input);
      const runs = getNextRuns(input, 10);
      
      setDescription(desc);
      setNextRuns(runs);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: desc,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError((e as Error).message || "Failed to parse cron expression");
      setDescription("");
      setNextRuns([]);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Common Expressions</label>
          <div className="flex flex-wrap gap-2">
            {commonExpressions.map((expr) => (
              <button
                key={expr.value}
                onClick={() => setInput(expr.value)}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm"
              >
                {expr.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cron Expression</label>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="* * * * *"
            className="input w-full font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Format: minute (0-59) hour (0-23) day (1-31) month (1-12) weekday (0-6, 0=Sunday)
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button
          onClick={handleParse}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Parse Cron
        </button>

        {description && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-lg capitalize">{description}</p>
          </div>
        )}

        {nextRuns.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Next 10 Runs</h3>
            <ul className="space-y-1 font-mono text-sm">
              {nextRuns.map((date, i) => (
                <li key={i} className="flex justify-between">
                  <span>{date.toLocaleString()}</span>
                  <span className="text-muted-foreground">{WEEKDAY_NAMES[date.getDay()]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <OutputBox
          label="Parsed Details"
          value={description ? `Expression: ${input}\nDescription: ${description}\n\nNext runs:\n${nextRuns.map(d => d.toISOString()).join("\n")}` : ""}
          downloadFileName="cron.txt"
        />
      </div>
    </ToolLayout>
  );
}
