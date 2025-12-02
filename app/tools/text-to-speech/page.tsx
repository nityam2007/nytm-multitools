// Text to Speech Tool | TypeScript
"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";
import { KokoroTTS } from "kokoro-js";

const tool = getToolBySlug("text-to-speech")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "text-to-speech");

type LoadingStatus = "idle" | "downloading" | "initializing" | "ready" | "error";

interface Voice {
  id: string;
  name: string;
  description: string;
}

const AVAILABLE_VOICES: Voice[] = [
  { id: "af_heart", name: "Heart", description: "Warm and friendly" },
  { id: "af_bella", name: "Bella", description: "Clear and professional" },
  { id: "af_sarah", name: "Sarah", description: "Natural and expressive" },
  { id: "af_nicole", name: "Nicole", description: "Energetic and bright" },
  { id: "am_adam", name: "Adam", description: "Deep and authoritative" },
  { id: "am_michael", name: "Michael", description: "Smooth and confident" },
  { id: "bf_emma", name: "Emma", description: "Young and cheerful" },
  { id: "bf_isabella", name: "Isabella", description: "Soft and gentle" },
  { id: "bm_george", name: "George", description: "Mature and steady" },
  { id: "bm_lewis", name: "Lewis", description: "Calm and composed" },
];

export default function TextToSpeechPage() {
  const [input, setInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("af_heart");
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const ttsRef = useRef<KokoroTTS | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const cachedModel = localStorage.getItem("kokoro-tts-cached");
    if (cachedModel === "true" && !ttsRef.current) {
      initializeModel();
    }
  }, []);

  const initializeModel = async () => {
    if (loadingStatus === "ready" || loadingStatus === "downloading" || loadingStatus === "initializing") {
      return;
    }

    setLoadingStatus("downloading");
    setError("");
    setDownloadProgress(0);

    try {
      // Use requestAnimationFrame to keep UI responsive during loading
      const updateProgress = () => {
        setDownloadProgress(prev => {
          if (prev >= 95) return 95;
          return prev + 2;
        });
      };
      
      const progressInterval = setInterval(updateProgress, 100);

      // Yield to browser before heavy operation
      await new Promise(resolve => setTimeout(resolve, 50));
      
      setLoadingStatus("initializing");
      
      // Load model with streaming/chunked approach
      const tts = await KokoroTTS.from_pretrained(
        "onnx-community/Kokoro-82M-v1.0-ONNX",
        { 
          dtype: "q8", 
          device: "wasm",
        }
      );

      clearInterval(progressInterval);
      
      // Yield again before final state update
      await new Promise(resolve => setTimeout(resolve, 10));
      
      setDownloadProgress(100);
      ttsRef.current = tts;
      setLoadingStatus("ready");
      localStorage.setItem("kokoro-tts-cached", "true");
      
    } catch (err: unknown) {
      setLoadingStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to load speech model. Please refresh and try again.";
      setError(errorMessage);
      console.error("TTS initialization error:", err);
    }
  };

  const deinitializeModel = () => {
    // Clean up audio URL if exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    // Clear the TTS model reference to allow garbage collection
    if (ttsRef.current) {
      ttsRef.current = null;
    }
    
    // Reset states
    setLoadingStatus("idle");
    setDownloadProgress(0);
    setIsPlaying(false);
    setIsGenerating(false);
    setError("");
    
    // Note: We keep the localStorage cache flag so user doesn't need to re-download
    // The model files are cached by the browser, only the in-memory instance is freed
  };

  const generateSpeech = async () => {
    if (!input.trim()) {
      setError("Please enter some text to convert to speech");
      return;
    }

    if (loadingStatus !== "ready" || !ttsRef.current) {
      setError("Model not ready. Please initialize first.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      // Yield to browser before heavy operation
      await new Promise(resolve => setTimeout(resolve, 10));

      const audio = await ttsRef.current.generate(input, {
        voice: selectedVoice as "af_heart" | "af_bella" | "af_sarah" | "af_nicole" | "am_adam" | "am_michael" | "bf_emma" | "bf_isabella" | "bm_george" | "bm_lewis",
      });

      // Yield again before blob creation
      await new Promise(resolve => setTimeout(resolve, 10));

      // Get audio data and convert to WAV blob
      const audioData = audio.toBlob();
      const url = URL.createObjectURL(audioData);
      setAudioUrl(url);

      // Don't block on logging
      logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input.substring(0, 100),
        outputResult: "Audio generated",
        metadata: { voice: selectedVoice, textLength: input.length },
      }).catch(console.error);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate speech. Try shorter text.";
      setError(errorMessage);
      console.error("Speech generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement("a");
    link.download = `speech-${Date.now()}.wav`;
    link.href = audioUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Experimental Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Experimental Feature</span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">First-time setup required</p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                This tool downloads a ~100MB voice model on first use. The model will be cached in your browser for instant future use. All processing happens locally on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Model Initialization - Idle State */}
        {loadingStatus === "idle" && (
          <div className="p-8 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Initialize Voice Model</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 max-w-md mx-auto">
              Click below to download and initialize the AI voice model. This is a one-time download (~100MB) that will be cached in your browser.
            </p>
            <Button onClick={initializeModel} variant="primary" size="lg">
              Download & Initialize Model
            </Button>
          </div>
        )}

        {/* Downloading/Initializing Progress */}
        {(loadingStatus === "downloading" || loadingStatus === "initializing") && (
          <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <svg className="w-16 h-16 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {loadingStatus === "downloading" ? "Downloading Model..." : "Initializing Engine..."}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                {loadingStatus === "downloading" 
                  ? "Downloading voice model from Hugging Face (~100MB)" 
                  : "Setting up the speech engine (this may take a moment)..."}
              </p>
              <div className="w-full max-w-md mx-auto bg-[var(--muted)] rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-2 font-mono">
                {downloadProgress}%
              </p>
              <p className="text-xs text-amber-500 mt-3">
                Page may be briefly unresponsive during model initialization
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {loadingStatus === "error" && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Initialization Failed</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-3">{error}</p>
                <Button onClick={initializeModel} variant="secondary" size="md">
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Model Ready - Main Interface */}
        {loadingStatus === "ready" && (
          <>
            {/* Model Status Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Model loaded and ready</span>
              </div>
              <button
                onClick={deinitializeModel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border)] hover:border-red-500/30 transition-all"
                title="Unload model to free up memory (~100MB)"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Unload Model
              </button>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Select Voice</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AVAILABLE_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-3 rounded-xl text-left transition-all duration-300 ${
                      selectedVoice === voice.id
                        ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-500"
                        : "bg-[var(--card)] border border-[var(--border)] hover:border-violet-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold text-sm">{voice.name}</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{voice.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <TextArea
              label="Text to Convert"
              placeholder="Enter the text you want to convert to speech... (Recommended: Keep under 500 characters for best results)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              error={error}
              className="min-h-[150px]"
              maxLength={1000}
            />

            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span className="font-mono">{input.length} / 1000 characters</span>
              {input.length > 500 && (
                <span className="text-amber-500">• Longer text may take more time</span>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateSpeech}
              disabled={!input.trim() || isGenerating}
              variant="primary"
              size="lg"
              loading={isGenerating}
              fullWidth
              icon={
                !isGenerating ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : undefined
              }
            >
              {isGenerating ? "Generating Speech..." : "Generate Speech"}
            </Button>

            {/* Audio Player */}
            {audioUrl && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Speech Generated</span>
                </div>
                
                {/* Custom Audio Player */}
                <div className="bg-[var(--background)] rounded-xl p-4 mb-4 border border-[var(--border)]">
                  <audio 
                    ref={audioRef} 
                    src={audioUrl} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="text-sm font-medium">Generated Audio</span>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        Voice: {AVAILABLE_VOICES.find(v => v.id === selectedVoice)?.name || selectedVoice}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPlaying 
                          ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-[var(--muted-foreground)]"}`}></span>
                        {isPlaying ? "Playing" : "Ready"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handlePlayPause} 
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    variant="primary"
                    size="md"
                    className="flex-1"
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    }
                  >
                    Download WAV
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works
          </h3>
          <ul className="text-sm text-[var(--muted-foreground)] space-y-1.5 ml-6">
            <li>• 100% client-side processing - your text never leaves your device</li>
            <li>• First download: ~100MB voice model (one-time, cached locally)</li>
            <li>• Subsequent uses: Instant, no download needed</li>
            <li>• Works offline after initial model download</li>
            <li>• Powered by Kokoro-82M AI voice model</li>
          </ul>
        </div>

        {/* Third-Party Service Notice */}
        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 text-amber-500 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <strong>Hugging Face Model Download Notice:</strong> This tool downloads the AI voice model 
            (Kokoro-82M-ONNX) from Hugging Face servers on first use. Your browser connects to Hugging Face 
            to retrieve the model files (~100MB). After download, the model is cached locally and all speech 
            synthesis occurs entirely on your device. <strong>No text or audio data is ever sent to external servers.</strong>{" "}
            By using this tool, you acknowledge the use of Hugging Face's model hosting service, subject to their{" "}
            <a 
              href="https://huggingface.co/terms-of-service" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-amber-400 transition-colors"
            >
              Terms of Service
            </a>
            {" "}and{" "}
            <a 
              href="https://huggingface.co/privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </a>.
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Lawful Use & Responsibility
          </h3>
          <div className="text-sm text-[var(--muted-foreground)] space-y-2">
            <p>
              This tool is provided for lawful, personal, and educational purposes only. By using this text-to-speech service, you agree to the following:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span><strong>No impersonation:</strong> Do not create audio that impersonates real individuals without explicit consent.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span><strong>No fraud or deception:</strong> Do not use generated speech for scams, misinformation, or deceptive purposes.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span><strong>No illegal content:</strong> Do not generate speech containing hate speech, harassment, or content illegal in your jurisdiction.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span><strong>Your responsibility:</strong> You are solely responsible for how you use the generated audio content.</span>
              </li>
            </ul>
            <p className="pt-2 text-xs border-t border-[var(--border)] mt-3">
              NYTM and its owner (Nityam Sheth) are not liable for any misuse of this tool. This tool uses the open-source Kokoro-82M model licensed under Apache 2.0. 
              See our <a href="/terms" className="text-violet-400 hover:text-violet-300 underline">Terms of Service</a> and <a href="/privacy" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</a> for more information.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
