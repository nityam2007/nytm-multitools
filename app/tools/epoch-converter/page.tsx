"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("epoch-converter")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "epoch-converter");

export default function EpochConverterPage() {
  const [epoch, setEpoch] = useState(Math.floor(Date.now() / 1000).toString());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ts = parseInt(epoch);
    if (!isNaN(ts)) {
      const d = new Date(ts * 1000);
      setDate(d.toISOString().split("T")[0]);
      setTime(d.toISOString().split("T")[1].slice(0, 8));
    }
  }, []);

  const epochToDate = (ts: number) => {
    const d = new Date(ts * 1000);
    return {
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      iso: d.toISOString(),
    };
  };

  const dateToEpoch = () => {
    if (!date) return;
    const d = new Date(`${date}T${time || "00:00:00"}`);
    setEpoch(Math.floor(d.getTime() / 1000).toString());
  };

  const handleEpochChange = (val: string) => {
    setEpoch(val);
    const ts = parseInt(val);
    if (!isNaN(ts)) {
      const d = new Date(ts * 1000);
      setDate(d.toISOString().split("T")[0]);
      setTime(d.toISOString().split("T")[1].slice(0, 8));
    }
  };

  const useNow = () => {
    setEpoch(currentEpoch.toString());
    const d = new Date(currentEpoch * 1000);
    setDate(d.toISOString().split("T")[0]);
    setTime(d.toISOString().split("T")[1].slice(0, 8));
  };

  const parsedEpoch = parseInt(epoch);
  const dateInfo = !isNaN(parsedEpoch) ? epochToDate(parsedEpoch) : null;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-2">Current Unix Epoch</div>
          <div className="text-4xl font-bold font-mono text-[var(--primary)]">{currentEpoch}</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">Epoch → Date</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unix Timestamp (seconds)</label>
                <input
                  type="text"
                  value={epoch}
                  onChange={(e) => handleEpochChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
                />
              </div>
              <button
                onClick={useNow}
                className="w-full py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Use Current Time
              </button>
              {dateInfo && (
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">UTC</div>
                    <div className="font-mono text-sm">{dateInfo.utc}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">Local</div>
                    <div className="font-mono text-sm">{dateInfo.local}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)]">ISO 8601</div>
                    <div className="font-mono text-sm">{dateInfo.iso}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="text-lg font-semibold mb-4">Date → Epoch</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <button
                onClick={dateToEpoch}
                className="w-full py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Convert to Epoch
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">Common Timestamps</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-[var(--muted)] rounded-lg">
              <span>Unix Epoch Start</span>
              <span className="font-mono">0 (Jan 1, 1970)</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--muted)] rounded-lg">
              <span>Y2K</span>
              <span className="font-mono">946684800</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--muted)] rounded-lg">
              <span>32-bit limit</span>
              <span className="font-mono">2147483647 (Jan 19, 2038)</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--muted)] rounded-lg">
              <span>Milliseconds (JS style)</span>
              <span className="font-mono">{Date.now()}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
