// My IP Address Tool | TypeScript
"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("my-ip")!;
const similarTools = getToolsByCategory("network").filter(t => t.slug !== "my-ip");

interface IPInfo {
  ip: string;
  version: "IPv4" | "IPv6";
}

interface NetworkInfo {
  userAgent: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
  online: boolean;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  timezoneOffset: number;
}

export default function MyIPPage() {
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPs = async () => {
      setLoading(true);
      
      // Fetch IPv4
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpv4(data.ip);
      } catch (e) {
        console.error("Failed to fetch IPv4:", e);
      }

      // Fetch IPv6
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        // Only set if it's actually IPv6 (contains colons)
        if (data.ip.includes(":")) {
          setIpv6(data.ip);
        }
      } catch (e) {
        console.error("Failed to fetch IPv6:", e);
      }

      // Collect browser/network info (all client-side, no API calls)
      if (typeof window !== "undefined") {
        setNetworkInfo({
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          online: navigator.onLine,
          screenResolution: `${window.screen.width} x ${window.screen.height}`,
          colorDepth: window.screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: new Date().getTimezoneOffset(),
        });
      }

      setLoading(false);
    };

    fetchIPs();
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const refresh = () => {
    setIpv4(null);
    setIpv6(null);
    setLoading(true);
    
    const fetchIPs = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpv4(data.ip);
      } catch (e) {
        console.error("Failed to fetch IPv4:", e);
      }

      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        if (data.ip.includes(":")) {
          setIpv6(data.ip);
        }
      } catch (e) {
        console.error("Failed to fetch IPv6:", e);
      }

      setLoading(false);
    };

    fetchIPs();
  };

  const isIPv4 = (ip: string): boolean => {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  };

  const getIPClass = (ip: string): string => {
    if (!isIPv4(ip)) return "N/A";
    const firstOctet = parseInt(ip.split(".")[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
    if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
    if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
    if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
    if (firstOctet >= 240 && firstOctet <= 255) return "Class E (Reserved)";
    return "Unknown";
  };

  const isPrivateIP = (ip: string): boolean => {
    if (!isIPv4(ip)) return false;
    const parts = ip.split(".").map(Number);
    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;
    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;
    return false;
  };

  const getBrowserInfo = (): string => {
    if (!networkInfo) return "Unknown";
    const ua = networkInfo.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    return "Unknown";
  };

  const getOSInfo = (): string => {
    if (!networkInfo) return "Unknown";
    const platform = networkInfo.platform;
    if (platform.includes("Win")) return "Windows";
    if (platform.includes("Mac")) return "macOS";
    if (platform.includes("Linux")) return "Linux";
    if (platform.includes("Android")) return "Android";
    if (platform.includes("iPhone") || platform.includes("iPad")) return "iOS";
    return platform;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[var(--muted)] hover:bg-violet-500/10 hover:text-violet-400 transition-all flex items-center gap-2 text-sm border border-[var(--border)]"
          >
            <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
        </div>

        {/* IP Address Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* IPv4 Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">IPv4</span>
              </div>
              {ipv4 && (
                <button
                  onClick={() => copyToClipboard(ipv4, "ipv4")}
                  className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                  title="Copy IPv4"
                >
                  {copiedField === "ipv4" ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin w-6 h-6 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[var(--muted-foreground)]">Detecting...</span>
              </div>
            ) : ipv4 ? (
              <>
                <div className="text-3xl font-mono font-bold mb-2">{ipv4}</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {getIPClass(ipv4)} • {isPrivateIP(ipv4) ? "Private" : "Public"}
                </div>
              </>
            ) : (
              <div className="text-[var(--muted-foreground)]">Not detected</div>
            )}
          </div>

          {/* IPv6 Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium">IPv6</span>
              </div>
              {ipv6 && (
                <button
                  onClick={() => copyToClipboard(ipv6, "ipv6")}
                  className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                  title="Copy IPv6"
                >
                  {copiedField === "ipv6" ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin w-6 h-6 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[var(--muted-foreground)]">Detecting...</span>
              </div>
            ) : ipv6 ? (
              <>
                <div className="text-xl sm:text-2xl font-mono font-bold mb-2 break-all">{ipv6}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Global Address</div>
              </>
            ) : (
              <div className="text-[var(--muted-foreground)]">Not detected (IPv6 may not be available on your network)</div>
            )}
          </div>
        </div>

        {/* Network Information */}
        {networkInfo && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Network & Browser Information</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Browser</div>
                <div className="font-medium">{getBrowserInfo()}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Operating System</div>
                <div className="font-medium">{getOSInfo()}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Language</div>
                <div className="font-medium">{networkInfo.language}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Screen Resolution</div>
                <div className="font-medium">{networkInfo.screenResolution}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Timezone</div>
                <div className="font-medium">{networkInfo.timezone}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Color Depth</div>
                <div className="font-medium">{networkInfo.colorDepth}-bit</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Cookies</div>
                <div className="font-medium">{networkInfo.cookiesEnabled ? "Enabled" : "Disabled"}</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Online Status</div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${networkInfo.online ? "bg-green-400" : "bg-red-400"}`}></span>
                  <span className="font-medium">{networkInfo.online ? "Online" : "Offline"}</span>
                </div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Do Not Track</div>
                <div className="font-medium">{networkInfo.doNotTrack === "1" ? "Enabled" : "Not Set"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-4 text-amber-500 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <strong>External API Notice:</strong> This tool uses the ipify.org service to detect your public IP address. Your IP is only used for detection purposes. All other browser information is collected locally without any external requests.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
