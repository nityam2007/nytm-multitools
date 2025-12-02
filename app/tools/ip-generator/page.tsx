"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("ip-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "ip-generator");

type IPType = "ipv4" | "ipv4-private" | "ipv4-public" | "ipv6";

const privateRanges = [
  { start: [10, 0, 0, 0], mask: 8 },       // 10.0.0.0/8
  { start: [172, 16, 0, 0], end: [172, 31, 255, 255] }, // 172.16.0.0/12
  { start: [192, 168, 0, 0], mask: 16 },   // 192.168.0.0/16
];

export default function IPGeneratorPage() {
  const [ipType, setIPType] = useState<IPType>("ipv4");
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);

  const randomOctet = () => Math.floor(Math.random() * 256);
  const randomHex = () => Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");

  const isPrivate = (octets: number[]): boolean => {
    const [a, b] = octets;
    return (
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 127 // loopback
    );
  };

  const generateIPv4 = (): string => {
    return [randomOctet(), randomOctet(), randomOctet(), randomOctet()].join(".");
  };

  const generatePrivateIPv4 = (): string => {
    const rangeType = Math.floor(Math.random() * 3);
    switch (rangeType) {
      case 0: // 10.x.x.x
        return `10.${randomOctet()}.${randomOctet()}.${randomOctet()}`;
      case 1: // 172.16-31.x.x
        return `172.${16 + Math.floor(Math.random() * 16)}.${randomOctet()}.${randomOctet()}`;
      case 2: // 192.168.x.x
        return `192.168.${randomOctet()}.${randomOctet()}`;
      default:
        return `192.168.${randomOctet()}.${randomOctet()}`;
    }
  };

  const generatePublicIPv4 = (): string => {
    let ip: string;
    let octets: number[];
    do {
      octets = [randomOctet(), randomOctet(), randomOctet(), randomOctet()];
      // Avoid 0.x.x.x and 255.x.x.x
      if (octets[0] === 0) octets[0] = 1;
      if (octets[0] === 255) octets[0] = 254;
      ip = octets.join(".");
    } while (isPrivate(octets));
    return ip;
  };

  const generateIPv6 = (): string => {
    return Array.from({ length: 8 }, () => randomHex()).join(":");
  };

  const generate = () => {
    const ips: string[] = [];
    for (let i = 0; i < count; i++) {
      switch (ipType) {
        case "ipv4":
          ips.push(generateIPv4());
          break;
        case "ipv4-private":
          ips.push(generatePrivateIPv4());
          break;
        case "ipv4-public":
          ips.push(generatePublicIPv4());
          break;
        case "ipv6":
          ips.push(generateIPv6());
          break;
      }
    }
    setResults(ips);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">IP Type</label>
            <select
              value={ipType}
              onChange={(e) => setIPType(e.target.value as IPType)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="ipv4">IPv4 (Any)</option>
              <option value="ipv4-private">IPv4 Private</option>
              <option value="ipv4-public">IPv4 Public</option>
              <option value="ipv6">IPv6</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          Generate IP Addresses
        </button>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Results ({results.length})</label>
              <button
                onClick={copyAll}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((ip, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg"
                >
                  <code className="flex-1 font-mono text-sm">{ip}</code>
                  <button
                    onClick={() => copyToClipboard(ip)}
                    className="px-2 py-1 text-xs rounded bg-[var(--background)] hover:bg-[var(--accent)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Private IP Ranges</h3>
          <div className="space-y-2 text-sm font-mono">
            <div>10.0.0.0 - 10.255.255.255 (Class A)</div>
            <div>172.16.0.0 - 172.31.255.255 (Class B)</div>
            <div>192.168.0.0 - 192.168.255.255 (Class C)</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
