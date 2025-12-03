// TTS Web Worker | TypeScript
// Offloads Kokoro TTS processing to background thread - keeps main thread responsive
// Auto-detects GPU support and uses WebGPU if available for 3-5x speedup

import { KokoroTTS } from "kokoro-js";

let tts: KokoroTTS | null = null;
let device: "webgpu" | "wasm" = "wasm";
let dtype: "fp32" | "fp16" | "q8" | "q4" = "q8";

// Detect WebGPU support
async function detectGPU(): Promise<boolean> {
  try {
    const nav = navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown> } };
    if (!nav.gpu) return false;
    const adapter = await nav.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

// Listen for messages from main thread
self.addEventListener("message", async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "init") {
    try {
      self.postMessage({ type: "status", status: "loading", progress: 0 });

      // Check GPU availability
      const hasGPU = await detectGPU();
      
      if (hasGPU) {
        device = "webgpu";
        dtype = "fp16"; // Best speed/quality with GPU
        self.postMessage({ 
          type: "device-info", 
          device: "GPU (WebGPU)", 
          note: "~3-5x faster than CPU"
        });
      } else {
        device = "wasm";
        dtype = "q8"; // Balanced quality on CPU
        self.postMessage({ 
          type: "device-info", 
          device: "CPU (WASM)", 
          note: "GPU not available"
        });
      }

      tts = await KokoroTTS.from_pretrained(
        "onnx-community/Kokoro-82M-v1.0-ONNX",
        { 
          dtype,
          device,
        }
      );

      self.postMessage({ type: "status", status: "ready" });
    } catch (err) {
      // If WebGPU fails, fallback to WASM
      if (device === "webgpu") {
        try {
          self.postMessage({ type: "fallback", message: "WebGPU failed, using CPU..." });
          device = "wasm";
          dtype = "q8";

          tts = await KokoroTTS.from_pretrained(
            "onnx-community/Kokoro-82M-v1.0-ONNX",
            { 
              dtype,
              device,
            }
          );

          self.postMessage({ type: "status", status: "ready" });
        } catch (fallbackErr) {
          self.postMessage({ 
            type: "error", 
            error: fallbackErr instanceof Error ? fallbackErr.message : "Failed to load model" 
          });
        }
      } else {
        self.postMessage({ 
          type: "error", 
          error: err instanceof Error ? err.message : "Failed to load model" 
        });
      }
    }
  }

  if (type === "generate") {
    if (!tts) {
      self.postMessage({ type: "error", error: "Model not loaded" });
      return;
    }

    try {
      const { text, voice } = payload;
      const startTime = Date.now();

      self.postMessage({ type: "status", status: "generating" });

      const audio = await tts.generate(text, { voice });
      const blob = audio.toBlob();

      const elapsed = Date.now() - startTime;

      // Transfer blob back to main thread
      self.postMessage({ 
        type: "done", 
        blob,
        elapsed
      });
    } catch (err) {
      self.postMessage({ 
        type: "error", 
        error: err instanceof Error ? err.message : "Generation failed" 
      });
    }
  }
});

// Signal worker is ready
self.postMessage({ type: "worker-ready" });
