// Text to Speech Tool | TypeScript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("text-to-speech")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "text-to-speech");

type Status = "idle" | "loading" | "ready" | "generating" | "error";

const VOICES = [
  { id: "af_heart", name: "Heart", gender: "F" },
  { id: "af_bella", name: "Bella", gender: "F" },
  { id: "af_sarah", name: "Sarah", gender: "F" },
  { id: "am_adam", name: "Adam", gender: "M" },
  { id: "am_michael", name: "Michael", gender: "M" },
  { id: "bf_emma", name: "Emma", gender: "F" },
  { id: "bm_george", name: "George", gender: "M" },
];

// Estimate generation time based on text length
const estimateTime = (textLength: number) => {
  const baseTime = 3;
  const perChar = 0.02;
  return Math.ceil(baseTime + textLength * perChar);
};

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("af_heart");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genTimeLeft, setGenTimeLeft] = useState(0);
  const [genElapsed, setGenElapsed] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<{ device: string; note: string } | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const genTimerRef = useRef<NodeJS.Timeout | null>(null);
  const genStartRef = useRef<number>(0);

  // Initialize Web Worker
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL("./tts-worker.ts", import.meta.url),
      { type: "module" }
    );

    // Handle messages from worker
    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, status: workerStatus, error: workerError, blob, elapsed, device, note } = e.data;

      if (type === "device-info") {
        setDeviceInfo({ device, note });
      }

      if (type === "fallback") {
        setError("GPU not available, using CPU (slower)");
      }

      if (type === "status") {
        if (workerStatus === "loading") {
          setStatus("loading");
        } else if (workerStatus === "ready") {
          setProgress(100);
          setStatus("ready");
          localStorage.setItem("kokoro-tts-cached", "true");
        } else if (workerStatus === "generating") {
          // Worker started generating
        }
      }

      if (type === "done" && blob) {
        // Clear timer
        if (genTimerRef.current) {
          clearInterval(genTimerRef.current);
          genTimerRef.current = null;
        }
        setGenProgress(100);

        // Create URL from blob
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setStatus("ready");

        // Auto-play
        setTimeout(() => {
          audioRef.current?.play();
        }, 100);

        // Log usage
        logToolUsage({
          toolName: tool.name,
          toolCategory: tool.category,
          inputType: "text",
          rawInput: text.substring(0, 100),
          outputResult: "Audio generated",
          metadata: { voice, textLength: text.length, generationTime: elapsed, device: deviceInfo?.device },
        }).catch(() => {});
      }

      if (type === "error") {
        if (genTimerRef.current) {
          clearInterval(genTimerRef.current);
          genTimerRef.current = null;
        }
        setError(workerError || "An error occurred");
        setStatus(status === "generating" ? "ready" : "error");
      }
    };

    // Check if model was previously cached - auto-init
    const cached = localStorage.getItem("kokoro-tts-cached");
    if (cached === "true") {
      initModel();
    }

    // Cleanup
    return () => {
      workerRef.current?.terminate();
      if (genTimerRef.current) clearInterval(genTimerRef.current);
    };
  }, []);

  // Cleanup audio URL
  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const initModel = () => {
    if (status === "loading" || status === "ready") return;
    
    setStatus("loading");
    setError("");
    setProgress(0);

    // Start progress animation
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 95));
    }, 150);

    // Send init message to worker
    workerRef.current?.postMessage({ type: "init" });

    // Clear interval after a bit (worker will set 100 when done)
    setTimeout(() => clearInterval(interval), 30000);
  };

  const generate = useCallback(() => {
    if (!text.trim() || status !== "ready" || !workerRef.current) return;

    setStatus("generating");
    setError("");
    setGenProgress(0);
    setGenElapsed(0);

    // Revoke old audio URL
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    // Estimate time
    const estimatedSecs = estimateTime(text.length);
    setGenTimeLeft(estimatedSecs);
    genStartRef.current = Date.now();

    // Start progress timer - this runs on main thread and stays responsive
    genTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - genStartRef.current) / 1000;
      setGenElapsed(Math.floor(elapsed));
      
      const progressPct = Math.min(95, (elapsed / estimatedSecs) * 100);
      setGenProgress(progressPct);
      
      const remaining = Math.max(0, estimatedSecs - elapsed);
      setGenTimeLeft(Math.ceil(remaining));
    }, 100);

    // Send to worker - this won't block main thread!
    workerRef.current.postMessage({
      type: "generate",
      payload: { text, voice }
    });
  }, [text, voice, status, audioUrl]);

  const download = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `speech-${Date.now()}.wav`;
    a.click();
  };

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Step 1: Load Model (only show if not ready) */}
        {status !== "ready" && status !== "generating" && (
          <div className="text-center py-12">
            {status === "idle" && (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/25">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Text to Speech</h2>
                <p className="text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
                  Convert any text to natural-sounding speech. 100% free, runs locally on your device.
                </p>
                <button
                  onClick={initModel}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all text-lg"
                >
                  Start Using Tool
                </button>
                <p className="text-xs text-[var(--muted-foreground)] mt-4">
                  First use downloads ~100MB voice model (cached for future use)
                </p>
              </>
            )}

            {status === "loading" && (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
                  <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Loading Voice Model...</h2>
                <div className="w-64 mx-auto bg-[var(--muted)] rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{progress}% — This only happens once</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-red-500">Loading Failed</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">{error}</p>
                <button
                  onClick={initModel}
                  className="px-6 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] font-medium hover:bg-violet-500/10 hover:border-violet-500/30 transition-all"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: Main Interface (only show when ready) */}
        {(status === "ready" || status === "generating") && (
          <>
            {/* Device Info Badge */}
            {deviceInfo && (
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-medium text-blue-600 dark:text-blue-400">{deviceInfo.device}</span>
                <span className="text-[var(--muted-foreground)] text-xs">• {deviceInfo.note}</span>
              </div>
            )}

            {/* Text Input */}
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none text-base placeholder:text-[var(--muted-foreground)]/50"
                maxLength={1000}
                disabled={status === "generating"}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-[var(--muted-foreground)]">
                <span>{text.length}/1000 characters</span>
                {text.length > 500 && <span className="text-amber-500">Longer text takes more time</span>}
              </div>
            </div>

            {/* Voice Selection - Simple Pills */}
            <div className="flex flex-wrap gap-2">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  disabled={status === "generating"}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    voice === v.id
                      ? "bg-violet-500 text-white shadow-md"
                      : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-violet-500/20"
                  }`}
                >
                  {v.name}
                  <span className="ml-1 opacity-60">{v.gender === "F" ? "♀" : "♂"}</span>
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={!text.trim() || status === "generating"}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 text-lg"
            >
              {status === "generating" ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Generate Speech
                </>
              )}
            </button>

            {/* Generation Progress Bar - Shows during generation */}
            {status === "generating" && (
              <div className="p-4 rounded-xl bg-[var(--card)] border border-violet-500/30 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="font-medium">Generating speech...</span>
                  </div>
                  <span className="text-[var(--muted-foreground)] tabular-nums">
                    {genTimeLeft > 0 ? `~${genTimeLeft}s remaining` : "Finishing..."}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-200"
                    style={{ width: `${genProgress}%` }}
                  />
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" 
                    style={{ animation: "shimmer 2s infinite" }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span>Elapsed: {genElapsed}s</span>
                  <span>{Math.round(genProgress)}%</span>
                </div>
                
                <p className="text-xs text-center text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                  Feel free to scroll around - audio will be ready when done
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Audio Player - Clean & Simple */}
            {audioUrl && (
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <audio 
                  ref={audioRef} 
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={() => {
                      if (audioRef.current?.paused) {
                        audioRef.current.play();
                      } else {
                        audioRef.current?.pause();
                      }
                    }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0"
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  {/* Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                      <span className="font-medium">{isPlaying ? "Playing" : "Ready to play"}</span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] truncate">
                      Voice: {VOICES.find(v => v.id === voice)?.name}
                    </p>
                  </div>

                  {/* Download */}
                  <button
                    onClick={download}
                    className="px-4 py-2 rounded-lg bg-[var(--muted)] hover:bg-violet-500/20 border border-[var(--border)] hover:border-violet-500/30 transition-all flex items-center gap-2 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Collapsible Info */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors text-sm"
            >
              <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About this tool
              </span>
              <svg className={`w-4 h-4 transition-transform ${showInfo ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showInfo && (
              <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">How it works</h4>
                  <p className="text-[var(--muted-foreground)]">
                    Uses the Kokoro-82M AI model running entirely in your browser via WebAssembly. 
                    Your text never leaves your device.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Model storage</h4>
                  <p className="text-[var(--muted-foreground)]">
                    The ~100MB model is downloaded from Hugging Face once and cached in your browser.
                    Future uses are instant with no re-download.
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Please use responsibly. Don't create content that impersonates others or spreads misinformation.
                    See our <a href="/terms" className="text-violet-400 hover:underline">Terms</a> for full usage policy.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
