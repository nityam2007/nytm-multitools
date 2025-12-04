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
      const { text, voice, speed = 1 } = payload;
      const startTime = Date.now();

      self.postMessage({ type: "status", status: "generating" });

      // Generate audio - NOT streaming, full generation at once
      const audio = await tts.generate(text, { voice, speed });
      
      // Get raw audio data
      const audioData = audio.audio; // Float32Array of audio samples
      const sampleRate = audio.sampling_rate || 24000;
      
      // Convert Float32Array to WAV blob manually for reliability
      const wavBlob = float32ToWav(audioData, sampleRate);

      const elapsed = Date.now() - startTime;

      // Transfer blob back to main thread
      self.postMessage({ 
        type: "done", 
        blob: wavBlob,
        elapsed,
        sampleRate,
        samples: audioData.length
      });
    } catch (err) {
      console.error("Generation error:", err);
      self.postMessage({ 
        type: "error", 
        error: err instanceof Error ? err.message : "Generation failed" 
      });
    }
  }
});

// Convert Float32Array audio samples to WAV blob
function float32ToWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const bufferSize = 44 + dataSize;
  
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);
  
  // WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  
  // Convert Float32 samples to Int16
  const offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
    view.setInt16(offset + i * 2, val, true);
  }
  
  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// Signal worker is ready
self.postMessage({ type: "worker-ready" });
