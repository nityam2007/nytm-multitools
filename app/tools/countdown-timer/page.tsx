"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("countdown-timer")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "countdown-timer");

export default function CountdownTimerPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for alarm
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleziJvtLNkl9Nf8DBvaxlRFN+tb6yhjM9epOtoJlkMkJzgoaFb1ZMW3eLn5uFZT9Cc4aLhotvU1xpfIuPjYBsV11qe4mNjIF0aGtueIOGhnxuaW1xeHx/fHp1cnRzdHZ3d3Z0c3Fxc3R1dnZ1dHNycnN0dXZ2dXRzcnJzdHV2dnV0c3JycnR1dnZ1dHNycnNzdXZ2dXRzcnJyc3R1dnZ1dHNycnJzdHV2dnV0c3Jyc3N0dXZ2dXRzcnJycnR1dnZ1dHNycnJyc3R1dnZ1dHNycnJyc3R1dnZ1dHNycnJyc3R1dnZ1");
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play alarm sound
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            // Browser notification
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Timer Complete!", { body: "Your countdown has finished." });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, timeLeft]);

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
      setIsPaused(false);
      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      hours: h.toString().padStart(2, "0"),
      minutes: m.toString().padStart(2, "0"),
      seconds: s.toString().padStart(2, "0"),
    };
  };

  const displayTime = formatTime(timeLeft);
  const progress = isRunning ? (timeLeft / (hours * 3600 + minutes * 60 + seconds)) * 100 : 0;

  const presets = [
    { label: "1 min", h: 0, m: 1, s: 0 },
    { label: "5 min", h: 0, m: 5, s: 0 },
    { label: "10 min", h: 0, m: 10, s: 0 },
    { label: "15 min", h: 0, m: 15, s: 0 },
    { label: "30 min", h: 0, m: 30, s: 0 },
    { label: "1 hour", h: 1, m: 0, s: 0 },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {!isRunning ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-center">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-4 text-center text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-center">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-4 text-center text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-center">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-4 text-center text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHours(preset.h);
                    setMinutes(preset.m);
                    setSeconds(preset.s);
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={startTimer}
              disabled={hours === 0 && minutes === 0 && seconds === 0}
              className="w-full py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
            >
              ▶ Start Timer
            </button>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="text-center py-8">
              <div className="font-mono text-6xl sm:text-8xl font-bold tracking-wider">
                {displayTime.hours}:{displayTime.minutes}:{displayTime.seconds}
              </div>
              {timeLeft === 0 && (
                <div className="mt-4 text-2xl text-green-500 font-bold animate-pulse flex items-center justify-center gap-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time&apos;s Up!
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={pauseTimer}
                className={`flex-1 py-4 rounded-lg font-medium ${
                  isPaused 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button
                onClick={resetTimer}
                className="flex-1 py-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
              >
                ⏹ Reset
              </button>
            </div>
          </>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)] flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p>Browser notifications will alert you when the timer completes (if permitted).</p>
        </div>
      </div>
    </ToolLayout>
  );
}
