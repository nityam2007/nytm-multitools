"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("jwt-decoder")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "jwt-decoder");

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

function decodeJWT(token: string): DecodedJWT | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    return { header, payload, signature };
  } catch {
    return null;
  }
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number") return null;
  const date = new Date(value * 1000);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString();
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState("");

  const handleDecode = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    const result = decodeJWT(input.trim());
    if (!result) {
      setError("Invalid JWT token");
      setDecoded(null);
      return;
    }

    setDecoded(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: JSON.stringify(result),
      processingDuration: Date.now() - startTime,
    });
  };

  const isExpired = decoded?.payload.exp 
    ? (decoded.payload.exp as number) * 1000 < Date.now() 
    : false;

  const timeFields = ["exp", "iat", "nbf"];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="JWT Token"
          placeholder="Paste your JWT token here..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={4}
        />

        <button
          onClick={handleDecode}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Decode JWT
        </button>

        {decoded && (
          <>
            {isExpired && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                This token has expired
              </div>
            )}

            <div className="card p-4">
              <h3 className="font-medium mb-3 text-primary">Header</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            <div className="card p-4">
              <h3 className="font-medium mb-3 text-primary">Payload</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              
              {/* Show decoded timestamps */}
              <div className="mt-4 space-y-2">
                {timeFields.map((field) => {
                  const value = decoded.payload[field];
                  const formatted = formatTimestamp(value);
                  if (!formatted) return null;
                  return (
                    <div key={field} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {field === "exp" ? "Expires" : field === "iat" ? "Issued At" : "Not Before"}:
                      </span>
                      <span>{formatted}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-medium mb-3 text-primary">Signature</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Algorithm: {decoded.header.alg as string || "Unknown"}
              </p>
              <code className="block bg-muted p-3 rounded text-sm break-all">
                {decoded.signature}
              </code>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Signature verification requires the secret key and cannot be done client-side
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(decoded.payload).map(([key, value]) => (
                <div key={key} className="card p-3">
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="font-mono text-sm truncate" title={String(value)}>
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
