"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { getOtherToolsCount } from "@/lib/site-config";

const tool = getToolBySlug("ip-lookup")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "ip-lookup");

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  postal?: string;
}

export default function IPLookupPage() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (ipAddress?: string) => {
    setLoading(true);
    setError("");
    
    try {
      const url = ipAddress ? `https://ipinfo.io/${ipAddress}/json` : "https://ipinfo.io/json";
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("IP lookup failed");
      }
      
      const data = await response.json();
      setInfo(data);
    } catch {
      setError("Failed to lookup IP address. Please check the IP and try again.");
    } finally {
      setLoading(false);
    }
  };

  const lookupMyIP = () => {
    setIp("");
    lookup();
  };

  const lookupCustomIP = () => {
    if (ip.trim()) {
      lookup(ip.trim());
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={lookupMyIP}
            disabled={loading}
            className="py-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            Lookup My IP
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address..."
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)]"
            />
            <button
              onClick={lookupCustomIP}
              disabled={loading || !ip.trim()}
              className="px-4 rounded-xl bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-2">
              <svg className="animate-spin w-10 h-10 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="text-[var(--muted-foreground)]">Looking up IP information...</div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500">
            {error}
          </div>
        )}

        {info && !loading && (
          <div className="space-y-4">
            <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">IP Address</div>
              <div className="text-3xl font-mono font-bold">{info.ip}</div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {info.city && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">City</div>
                  <div className="font-medium">{info.city}</div>
                </div>
              )}
              {info.region && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Region</div>
                  <div className="font-medium">{info.region}</div>
                </div>
              )}
              {info.country && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Country</div>
                  <div className="font-medium">{info.country}</div>
                </div>
              )}
              {info.postal && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Postal Code</div>
                  <div className="font-medium">{info.postal}</div>
                </div>
              )}
              {info.loc && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Coordinates</div>
                  <div className="font-medium font-mono">{info.loc}</div>
                </div>
              )}
              {info.timezone && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Timezone</div>
                  <div className="font-medium">{info.timezone}</div>
                </div>
              )}
              {info.org && (
                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] sm:col-span-2">
                  <div className="text-sm text-[var(--muted-foreground)]">Organization / ISP</div>
                  <div className="font-medium">{info.org}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 text-amber-500 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <strong>Third-Party API Notice:</strong> This tool uses the ipinfo.io external API to retrieve IP geolocation data. 
            Your IP address is sent to ipinfo.io servers. This is the <strong>only tool</strong> on NYTM that makes external API calls. 
            All other {getOtherToolsCount(2)} tools process data entirely in your browser.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
