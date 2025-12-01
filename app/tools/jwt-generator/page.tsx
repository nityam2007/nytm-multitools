"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("jwt-generator")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "jwt-generator");

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default function JwtGeneratorPage() {
  const [header, setHeader] = useState(JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2));
  const [payload, setPayload] = useState(JSON.stringify({
    sub: "1234567890",
    name: "John Doe",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }, null, 2));
  const [secret, setSecret] = useState("your-secret-key");

  const { token, error } = useMemo(() => {
    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);
      
      const encodedHeader = base64UrlEncode(JSON.stringify(headerObj));
      const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj));
      
      // Note: This is a simplified signature - real JWT would use HMAC
      const signature = base64UrlEncode(secret + "." + encodedHeader + "." + encodedPayload);
      
      return { token: `${encodedHeader}.${encodedPayload}.${signature}`, error: "" };
    } catch (e) {
      return { token: "", error: "Invalid JSON in header or payload" };
    }
  }, [header, payload, secret]);

  const addClaim = (claim: string) => {
    try {
      const obj = JSON.parse(payload);
      switch (claim) {
        case "iat":
          obj.iat = Math.floor(Date.now() / 1000);
          break;
        case "exp":
          obj.exp = Math.floor(Date.now() / 1000) + 3600;
          break;
        case "nbf":
          obj.nbf = Math.floor(Date.now() / 1000);
          break;
        case "jti":
          obj.jti = crypto.randomUUID();
          break;
      }
      setPayload(JSON.stringify(obj, null, 2));
    } catch {
      // Ignore
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Header</label>
            <textarea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Payload
              <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                <button onClick={() => addClaim("iat")} className="hover:underline">+iat</button>
                {" | "}
                <button onClick={() => addClaim("exp")} className="hover:underline">+exp</button>
                {" | "}
                <button onClick={() => addClaim("jti")} className="hover:underline">+jti</button>
              </span>
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Secret Key</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Note: This is a simplified implementation for demo purposes. Use a proper JWT library for production.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}

        <OutputBox label="Generated JWT Token" value={token} />
      </div>
    </ToolLayout>
  );
}
