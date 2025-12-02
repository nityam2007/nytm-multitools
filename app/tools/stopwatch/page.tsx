"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("stopwatch")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "stopwatch");

export default function StopwatchPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedRef.current;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setTime(elapsed);
        elapsedRef.current = elapsed;
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    elapsedRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const addLap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, time]);
    }
  };

  const formatTime = (ms: number, showMs: boolean = true) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    const parts = [];
    if (hours > 0) parts.push(hours.toString().padStart(2, "0"));
    parts.push(minutes.toString().padStart(2, "0"));
    parts.push(seconds.toString().padStart(2, "0"));
    
    let result = parts.join(":");
    if (showMs) result += "." + milliseconds.toString().padStart(2, "0");
    return result;
  };

  const getLapDiff = (index: number) => {
    if (index === 0) return laps[0];
    return laps[index] - laps[index - 1];
  };

  const getBestWorstLap = () => {
    if (laps.length < 2) return { best: -1, worst: -1 };
    const diffs = laps.map((_, i) => getLapDiff(i));
    const best = diffs.indexOf(Math.min(...diffs));
    const worst = diffs.indexOf(Math.max(...diffs));
    return { best, worst };
  };

  const { best, worst } = getBestWorstLap();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="font-mono text-5xl sm:text-7xl font-bold tracking-wider">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startStop}
            className={`px-8 py-4 rounded-full font-medium text-white flex items-center gap-2 ${
              isRunning 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRunning ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start
              </>
            )}
          </button>
          <button
            onClick={isRunning ? addLap : reset}
            className="px-8 py-4 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)] font-medium flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Lap
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </>
            )}
          </button>
        </div>

        {laps.length > 0 && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-semibold">Laps ({laps.length})</h3>
              <button
                onClick={() => setLaps([])}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[...laps].reverse().map((lapTime, revIndex) => {
                const index = laps.length - 1 - revIndex;
                const diff = getLapDiff(index);
                const isBest = index === best && laps.length > 1;
                const isWorst = index === worst && laps.length > 1;
                
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center px-4 py-3 border-b border-[var(--border)] last:border-0 ${
                      isBest ? "bg-green-500/10" : isWorst ? "bg-red-500/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted-foreground)]">Lap {index + 1}</span>
                      {isBest && <span className="text-xs text-green-500 font-medium">BEST</span>}
                      {isWorst && <span className="text-xs text-red-500 font-medium">SLOWEST</span>}
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">{formatTime(lapTime)}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">
                        +{formatTime(diff, false)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-2xl font-bold">{laps.length}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Laps</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-2xl font-bold font-mono">
              {laps.length > 0 ? formatTime(laps[laps.length - 1], false) : "00:00"}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Last Lap</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-2xl font-bold font-mono">
              {laps.length > 0 
                ? formatTime(Math.round(laps.reduce((a, b, i) => a + getLapDiff(i), 0) / laps.length), false)
                : "00:00"
              }
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">Avg Lap</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
