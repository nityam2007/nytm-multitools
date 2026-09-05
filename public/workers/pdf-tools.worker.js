// Local PDF encryption, decryption, and stream compression | JavaScript
import { createPdfToolkit, PdfPasswordError } from "../pdf-engine/index.js";
const engine = createPdfToolkit({ wasmUrl: new URL("../pdf-engine/wasm/qpdf.wasm", import.meta.url) });
engine.then(() => self.postMessage({ ready: true })).catch(() => self.postMessage({ error: "Could not load the PDF engine. Check your connection and reload the engine." }));
self.onmessage = async ({ data }) => {
  try {
    const pdf = await engine;
    let bytes;
    if (data.mode === "lock") bytes = await pdf.lock(data.file, { userPassword: data.password, ownerPassword: data.password, keyLength: 256 });
    else if (data.mode === "unlock") bytes = await pdf.unlock(data.file, { password: data.password });
    else if (data.mode === "compress") bytes = await pdf.compress(data.file, { compressionLevel: 9, objectStreams: true });
    else throw new Error("Unsupported operation.");
    const info = await pdf.getInfo(bytes, data.mode === "lock" ? { password: data.password } : {});
    if (data.mode === "lock" && (!info.encrypted || info.encryption?.bits !== 256)) throw new Error("Encryption verification failed.");
    if (data.mode === "unlock" && info.encrypted) throw new Error("Decryption verification failed.");
    const unchanged = data.mode === "compress" && bytes.length >= data.file.size;
    if (unchanged) bytes = new Uint8Array(await data.file.arrayBuffer());
    self.postMessage({ bytes, pages: info.pageCount, unchanged }, [bytes.buffer]);
  } catch (error) {
    self.postMessage({ error: error instanceof PdfPasswordError ? "The password is incorrect, or this PDF requires a different password." : "Could not process this PDF. Check that it is a valid PDF; unlock encrypted files before compressing or adding a new password." });
  }
};
