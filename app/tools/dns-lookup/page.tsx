// DNS Lookup Tool | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("dns-lookup")!;
const similarTools = getToolsByCategory("network").filter(t => t.slug !== "dns-lookup");

interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
  priority?: number;
}

interface DNSResult {
  domain: string;
  records: DNSRecord[];
  timestamp: string;
  resolver: string;
}

export default function DNSLookupPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DNSResult | null>(null);
  const [error, setError] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["A", "AAAA", "MX", "TXT", "NS", "CNAME"]);

  const recordTypes = [
    { id: "A", name: "A", description: "IPv4 address" },
    { id: "AAAA", name: "AAAA", description: "IPv6 address" },
    { id: "MX", name: "MX", description: "Mail server" },
    { id: "TXT", name: "TXT", description: "Text records" },
    { id: "NS", name: "NS", description: "Name servers" },
    { id: "CNAME", name: "CNAME", description: "Canonical name" },
    { id: "SOA", name: "SOA", description: "Start of Authority" },
  ];

  const toggleRecordType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const cleanDomain = (input: string): string => {
    let cleaned = input.trim().toLowerCase();
    // Remove protocol
    cleaned = cleaned.replace(/^https?:\/\//, "");
    // Remove path, query, fragment
    cleaned = cleaned.split("/")[0];
    cleaned = cleaned.split("?")[0];
    cleaned = cleaned.split("#")[0];
    // Remove port
    cleaned = cleaned.split(":")[0];
    return cleaned;
  };

  const isValidDomain = (d: string): boolean => {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(d);
  };

  const lookupDNS = async () => {
    const cleanedDomain = cleanDomain(domain);
    
    if (!cleanedDomain) {
      setError("Please enter a domain name");
      return;
    }

    if (!isValidDomain(cleanedDomain)) {
      setError("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    if (selectedTypes.length === 0) {
      setError("Please select at least one record type");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const records: DNSRecord[] = [];
      
      // Use Google DNS-over-HTTPS API (publicly available)
      for (const type of selectedTypes) {
        try {
          const response = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(cleanedDomain)}&type=${type}`,
            {
              headers: {
                "Accept": "application/dns-json"
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.Answer) {
              for (const answer of data.Answer) {
                let value = answer.data;
                let priority: number | undefined;
                
                // Parse MX records which have priority
                if (type === "MX" && value.includes(" ")) {
                  const parts = value.split(" ");
                  priority = parseInt(parts[0]);
                  value = parts.slice(1).join(" ");
                }
                
                records.push({
                  type: recordTypes.find(rt => rt.id === type)?.name || type,
                  value: value.replace(/\\"/g, '"'), // Unescape quotes in TXT records
                  ttl: answer.TTL,
                  priority
                });
              }
            }
          }
        } catch (e) {
          console.error(`Error fetching ${type} records:`, e);
        }
      }

      setResult({
        domain: cleanedDomain,
        records,
        timestamp: new Date().toISOString(),
        resolver: "Google Public DNS"
      });

    } catch (e) {
      console.error("DNS lookup error:", e);
      setError("Failed to perform DNS lookup. Please check the domain and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getRecordColor = (type: string): string => {
    const colors: Record<string, string> = {
      "A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "AAAA": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "MX": "bg-green-500/20 text-green-400 border-green-500/30",
      "TXT": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "NS": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "CNAME": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "SOA": "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Domain Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Domain Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupDNS()}
              placeholder="example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
            />
            <button
              onClick={lookupDNS}
              disabled={loading || !domain.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Looking up...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Lookup
                </>
              )}
            </button>
          </div>
        </div>

        {/* Record Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Record Types</label>
          <div className="flex flex-wrap gap-2">
            {recordTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleRecordType(type.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedTypes.includes(type.id)
                    ? "bg-violet-500/20 text-violet-400 border-violet-500/50"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)] hover:bg-violet-500/10"
                }`}
                title={type.description}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 flex gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[var(--muted-foreground)]">Domain</div>
                  <div className="text-xl font-mono font-bold">{result.domain}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--muted-foreground)]">Records Found</div>
                  <div className="text-xl font-bold">{result.records.length}</div>
                </div>
              </div>
            </div>

            {/* Records Table */}
            {result.records.length > 0 ? (
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                      <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">TTL</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {result.records.map((record, idx) => (
                      <tr key={idx} className="hover:bg-[var(--muted)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getRecordColor(record.type)}`}>
                            {record.type}
                          </span>
                          {record.priority !== undefined && (
                            <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                              (Priority: {record.priority})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-sm break-all max-w-xs sm:max-w-md">
                          {record.value}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--muted-foreground)] hidden sm:table-cell">
                          {record.ttl ? `${record.ttl}s` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => copyToClipboard(record.value)}
                            className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                            title="Copy value"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-[var(--muted)] rounded-xl">
                <div className="text-[var(--muted-foreground)]">No records found for selected types</div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
              <span>Resolver: {result.resolver}</span>
              <span>Queried: {new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-400 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <strong>How it works:</strong> This tool uses Google&apos;s public DNS-over-HTTPS service to query DNS records. Results are cached by DNS servers based on TTL (Time To Live) values.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
