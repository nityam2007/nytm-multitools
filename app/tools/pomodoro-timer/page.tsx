"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pomodoro-timer")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "pomodoro-timer");

type SessionType = "work" | "shortBreak" | "longBreak";

export default function PomodoroTimerPage() {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [sessionsUntilLong, setSessionsUntilLong] = useState(4);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionType>("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          if (currentSession === "work") {
            setTotalWorkTime(t => t + 1);
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
  }, [isRunning, timeLeft, currentSession]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAA=");
      audio.play().catch(() => {});
    } catch {}

    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      const message = currentSession === "work" 
        ? "Work session complete! Take a break." 
        : "Break over! Time to focus.";
      new Notification("Pomodoro Timer", { body: message });
    }

    if (currentSession === "work") {
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);
      
      if (newCount % sessionsUntilLong === 0) {
        setCurrentSession("longBreak");
        setTimeLeft(longBreak * 60);
      } else {
        setCurrentSession("shortBreak");
        setTimeLeft(shortBreak * 60);
      }
    } else {
      setCurrentSession("work");
      setTimeLeft(workDuration * 60);
    }
  };

  const startPause = () => {
    if (!isRunning && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const skip = () => {
    handleSessionComplete();
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentSession("work");
    setTimeLeft(workDuration * 60);
    setCompletedSessions(0);
    setTotalWorkTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const switchSession = (type: SessionType) => {
    setIsRunning(false);
    setCurrentSession(type);
    const durations = { work: workDuration, shortBreak, longBreak };
    setTimeLeft(durations[type] * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const sessionColors = {
    work: "bg-red-500",
    shortBreak: "bg-green-500",
    longBreak: "bg-blue-500",
  };

  const sessionLabels = {
    work: "Focus Time",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  const progress = (() => {
    const durations = { work: workDuration, shortBreak, longBreak };
    const total = durations[currentSession] * 60;
    return ((total - timeLeft) / total) * 100;
  })();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {(["work", "shortBreak", "longBreak"] as SessionType[]).map(type => (
            <button
              key={type}
              onClick={() => switchSession(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSession === type
                  ? `${sessionColors[type]} text-white`
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              {sessionLabels[type]}
            </button>
          ))}
        </div>

        <div className="relative pt-4">
          <div className={`w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden`}>
            <div 
              className={`h-full ${sessionColors[currentSession]} transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center py-8">
          <div className={`inline-block px-4 py-1 rounded-full text-sm text-white mb-4 ${sessionColors[currentSession]}`}>
            {sessionLabels[currentSession]}
          </div>
          <div className="font-mono text-7xl sm:text-9xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startPause}
            className={`px-12 py-4 rounded-full text-white font-medium ${
              isRunning ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          <button
            onClick={skip}
            className="px-6 py-4 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)]"
            title="Skip to next session"
          >
            ⏭
          </button>
          <button
            onClick={reset}
            className="px-6 py-4 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)]"
            title="Reset all"
          >
            ↺
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-3xl font-bold">{completedSessions}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Sessions</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-3xl font-bold">{formatDuration(totalWorkTime)}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Focus Time</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-3xl font-bold">{sessionsUntilLong - (completedSessions % sessionsUntilLong)}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Until Long Break</div>
          </div>
        </div>

        <details className="bg-[var(--card)] rounded-xl border border-[var(--border)]">
          <summary className="p-4 cursor-pointer font-medium">⚙️ Settings</summary>
          <div className="p-4 pt-0 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Work Duration (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 25;
                  setWorkDuration(val);
                  if (currentSession === "work" && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Short Break (min)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 5;
                  setShortBreak(val);
                  if (currentSession === "shortBreak" && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Long Break (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreak}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 15;
                  setLongBreak(val);
                  if (currentSession === "longBreak" && !isRunning) setTimeLeft(val * 60);
                }}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sessions Until Long Break</label>
              <input
                type="number"
                min="2"
                max="10"
                value={sessionsUntilLong}
                onChange={(e) => setSessionsUntilLong(parseInt(e.target.value) || 4)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
