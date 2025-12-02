"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

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
            className="py-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            🌐 Lookup My IP
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
              className="px-4 rounded-xl bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50"
            >
              🔍
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-2">⏳</div>
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

        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 text-amber-500 text-sm">
          <strong>⚠️ Third-Party API Notice:</strong> This tool uses the ipinfo.io external API to retrieve IP geolocation data. 
          Your IP address is sent to ipinfo.io servers. This is the <strong>only tool</strong> on NYTM that makes external API calls. 
          All other 134 tools process data entirely in your browser.
        </div>
      </div>
    </ToolLayout>
  );
}
