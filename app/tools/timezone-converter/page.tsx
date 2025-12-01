"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("timezone-converter")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "timezone-converter");

const timezones = [
  { id: "UTC", name: "UTC", offset: 0 },
  { id: "America/New_York", name: "Eastern Time (ET)", offset: -5 },
  { id: "America/Chicago", name: "Central Time (CT)", offset: -6 },
  { id: "America/Denver", name: "Mountain Time (MT)", offset: -7 },
  { id: "America/Los_Angeles", name: "Pacific Time (PT)", offset: -8 },
  { id: "Europe/London", name: "London (GMT/BST)", offset: 0 },
  { id: "Europe/Paris", name: "Paris (CET)", offset: 1 },
  { id: "Europe/Berlin", name: "Berlin (CET)", offset: 1 },
  { id: "Asia/Dubai", name: "Dubai (GST)", offset: 4 },
  { id: "Asia/Kolkata", name: "India (IST)", offset: 5.5 },
  { id: "Asia/Shanghai", name: "China (CST)", offset: 8 },
  { id: "Asia/Tokyo", name: "Tokyo (JST)", offset: 9 },
  { id: "Asia/Singapore", name: "Singapore (SGT)", offset: 8 },
  { id: "Australia/Sydney", name: "Sydney (AEST)", offset: 10 },
  { id: "Pacific/Auckland", name: "Auckland (NZST)", offset: 12 },
];

export default function TimezoneConverterPage() {
  const [sourceTime, setSourceTime] = useState("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("America/New_York");
  const [convertedTime, setConvertedTime] = useState("");
  const [worldTimes, setWorldTimes] = useState<{name: string; time: string}[]>([]);

  useEffect(() => {
    // Initialize with current time
    const now = new Date();
    setSourceTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    if (!sourceTime) return;

    try {
      const date = new Date(sourceTime);
      
      // Convert to target timezone
      const targetTime = new Intl.DateTimeFormat("en-US", {
        timeZone: targetZone,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
      
      setConvertedTime(targetTime);

      // Calculate world times
      const times = timezones.slice(0, 8).map(tz => ({
        name: tz.name,
        time: new Intl.DateTimeFormat("en-US", {
          timeZone: tz.id,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date),
      }));
      
      setWorldTimes(times);
    } catch {
      setConvertedTime("Invalid date");
    }
  }, [sourceTime, sourceZone, targetZone]);

  const setToNow = () => {
    const now = new Date();
    setSourceTime(now.toISOString().slice(0, 16));
  };

  const swapTimezones = () => {
    const temp = sourceZone;
    setSourceZone(targetZone);
    setTargetZone(temp);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={setToNow}
              className="w-full py-3 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
            >
              ⏰ Use Current Time
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">From Timezone</label>
            <select
              value={sourceZone}
              onChange={(e) => setSourceZone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name}</option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              onClick={swapTimezones}
              className="p-3 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
            >
              ⇄
            </button>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">To Timezone</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Converted Time</div>
          <div className="text-2xl font-bold">{convertedTime}</div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">🌍 World Clocks</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {worldTimes.map((wt, idx) => (
              <div key={idx} className="bg-[var(--muted)] rounded-lg p-3 text-center">
                <div className="text-lg font-mono font-bold">{wt.time}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{wt.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Quick Reference</h3>
          <div className="text-sm text-[var(--muted-foreground)] space-y-1">
            <p>• EST/EDT = UTC-5/UTC-4 (Eastern US)</p>
            <p>• PST/PDT = UTC-8/UTC-7 (Pacific US)</p>
            <p>• GMT/BST = UTC+0/UTC+1 (UK)</p>
            <p>• IST = UTC+5:30 (India)</p>
            <p>• JST = UTC+9 (Japan)</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
