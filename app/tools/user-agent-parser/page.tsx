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
              <div className="w-8 h-8 mb-3 text-[var(--foreground)]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Browser</div>
              <div className="text-xl font-semibold">{parsed.browser.name}</div>
              {parsed.browser.version && (
                <div className="text-sm text-[var(--muted-foreground)]">v{parsed.browser.version}</div>
              )}
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="w-8 h-8 mb-3 text-[var(--foreground)]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Operating System</div>
              <div className="text-xl font-semibold">{parsed.os.name}</div>
              {parsed.os.version && (
                <div className="text-sm text-[var(--muted-foreground)]">{parsed.os.version}</div>
              )}
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="w-8 h-8 mb-3 text-[var(--foreground)]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">Device Type</div>
              <div className="text-xl font-semibold">{parsed.device.type}</div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="w-8 h-8 mb-3 text-[var(--foreground)]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
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
