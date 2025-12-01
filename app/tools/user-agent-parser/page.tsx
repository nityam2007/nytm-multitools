"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("user-agent-parser")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "user-agent-parser");

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor?: string; model?: string };
  engine: { name: string; version: string };
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: "Unknown", version: "" },
    os: { name: "Unknown", version: "" },
    device: { type: "Desktop" },
    engine: { name: "Unknown", version: "" },
  };
  
  // Browser detection
  if (ua.includes("Firefox/")) {
    result.browser.name = "Firefox";
    result.browser.version = ua.match(/Firefox\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Edg/")) {
    result.browser.name = "Microsoft Edge";
    result.browser.version = ua.match(/Edg\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Chrome/")) {
    result.browser.name = "Chrome";
    result.browser.version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    result.browser.name = "Safari";
    result.browser.version = ua.match(/Version\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Opera/") || ua.includes("OPR/")) {
    result.browser.name = "Opera";
    result.browser.version = ua.match(/(?:Opera|OPR)\/([\d.]+)/)?.[1] || "";
  }
  
  // OS detection
  if (ua.includes("Windows NT 10")) {
    result.os.name = "Windows";
    result.os.version = "10/11";
  } else if (ua.includes("Windows NT 6.3")) {
    result.os.name = "Windows";
    result.os.version = "8.1";
  } else if (ua.includes("Windows NT 6.1")) {
    result.os.name = "Windows";
    result.os.version = "7";
  } else if (ua.includes("Mac OS X")) {
    result.os.name = "macOS";
    result.os.version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
  } else if (ua.includes("Android")) {
    result.os.name = "Android";
    result.os.version = ua.match(/Android ([\d.]+)/)?.[1] || "";
  } else if (ua.includes("iPhone OS") || ua.includes("iPad")) {
    result.os.name = "iOS";
    result.os.version = ua.match(/(?:iPhone OS|CPU OS) ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
  } else if (ua.includes("Linux")) {
    result.os.name = "Linux";
  }
  
  // Device type detection
  if (ua.includes("Mobile") || ua.includes("Android") && !ua.includes("Tablet")) {
    result.device.type = "Mobile";
  } else if (ua.includes("Tablet") || ua.includes("iPad")) {
    result.device.type = "Tablet";
  }
  
  // Engine detection
  if (ua.includes("Gecko/")) {
    result.engine.name = "Gecko";
    result.engine.version = ua.match(/rv:([\d.]+)/)?.[1] || "";
  } else if (ua.includes("AppleWebKit/")) {
    result.engine.name = "WebKit";
    result.engine.version = ua.match(/AppleWebKit\/([\d.]+)/)?.[1] || "";
  } else if (ua.includes("Trident/")) {
    result.engine.name = "Trident";
    result.engine.version = ua.match(/Trident\/([\d.]+)/)?.[1] || "";
  }
  
  return result;
}

export default function UserAgentParserPage() {
  const [ua, setUa] = useState("");
  const [parsed, setParsed] = useState<ParsedUA | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setUa(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    if (ua) {
      setParsed(parseUserAgent(ua));
    }
  }, [ua]);

  const useCurrentUA = () => {
    if (typeof navigator !== "undefined") {
      setUa(navigator.userAgent);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">User Agent String</label>
            <button
              onClick={useCurrentUA}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
            >
              Use My Browser
            </button>
          </div>
          <textarea
            value={ua}
            onChange={(e) => setUa(e.target.value)}
            placeholder="Paste a user agent string..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        {parsed && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="text-3xl mb-3">🌐</div>
              <div className="text-sm text-[var(--muted-foreground)]">Browser</div>
              <div className="text-xl font-semibold">{parsed.browser.name}</div>
              {parsed.browser.version && (
                <div className="text-sm text-[var(--muted-foreground)]">v{parsed.browser.version}</div>
              )}
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="text-3xl mb-3">💻</div>
              <div className="text-sm text-[var(--muted-foreground)]">Operating System</div>
              <div className="text-xl font-semibold">{parsed.os.name}</div>
              {parsed.os.version && (
                <div className="text-sm text-[var(--muted-foreground)]">{parsed.os.version}</div>
              )}
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="text-3xl mb-3">📱</div>
              <div className="text-sm text-[var(--muted-foreground)]">Device Type</div>
              <div className="text-xl font-semibold">{parsed.device.type}</div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="text-3xl mb-3">⚙️</div>
              <div className="text-sm text-[var(--muted-foreground)]">Rendering Engine</div>
              <div className="text-xl font-semibold">{parsed.engine.name}</div>
              {parsed.engine.version && (
                <div className="text-sm text-[var(--muted-foreground)]">v{parsed.engine.version}</div>
              )}
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Sample User Agents</h3>
          <div className="space-y-2">
            {[
              { label: "Chrome on Windows", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
              { label: "Safari on iPhone", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" },
              { label: "Firefox on Linux", ua: "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0" },
            ].map(sample => (
              <button
                key={sample.label}
                onClick={() => setUa(sample.ua)}
                className="w-full text-left p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] text-sm transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
