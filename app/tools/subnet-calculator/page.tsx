// Subnet Calculator Tool | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("subnet-calculator")!;
const similarTools = getToolsByCategory("network").filter(t => t.slug !== "subnet-calculator");

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
  ipType: string;
  binaryMask: string;
  binaryNetwork: string;
}

export default function SubnetCalculatorPage() {
  const [ipAddress, setIpAddress] = useState("");
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [error, setError] = useState("");

  const ipToNumber = (ip: string): number => {
    const parts = ip.split(".").map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  };

  const numberToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join(".");
  };

  const cidrToMask = (cidrValue: number): number => {
    return cidrValue === 0 ? 0 : (~0 << (32 - cidrValue)) >>> 0;
  };

  const numberToBinary = (num: number, groups: boolean = true): string => {
    const binary = num.toString(2).padStart(32, "0");
    if (groups) {
      return binary.match(/.{8}/g)?.join(".") || binary;
    }
    return binary;
  };

  const getIPClass = (firstOctet: number): string => {
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D";
    if (firstOctet >= 240 && firstOctet <= 255) return "E";
    return "Unknown";
  };

  const getIPType = (ip: string): string => {
    const parts = ip.split(".").map(Number);
    
    // Loopback
    if (parts[0] === 127) return "Loopback";
    
    // Private ranges
    if (parts[0] === 10) return "Private (Class A)";
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return "Private (Class B)";
    if (parts[0] === 192 && parts[1] === 168) return "Private (Class C)";
    
    // Link-local
    if (parts[0] === 169 && parts[1] === 254) return "Link-Local (APIPA)";
    
    // Multicast
    if (parts[0] >= 224 && parts[0] <= 239) return "Multicast";
    
    // Reserved
    if (parts[0] >= 240) return "Reserved";
    
    return "Public";
  };

  const isValidIP = (ip: string): boolean => {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
  };

  const calculate = () => {
    const cleanIP = ipAddress.trim();
    
    // Handle CIDR notation in IP field
    let ip = cleanIP;
    let cidrValue = cidr;
    
    if (cleanIP.includes("/")) {
      const parts = cleanIP.split("/");
      ip = parts[0];
      cidrValue = parseInt(parts[1], 10);
      if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32) {
        setError("Invalid CIDR notation. Must be between 0 and 32.");
        return;
      }
      setCidr(cidrValue);
    }

    if (!isValidIP(ip)) {
      setError("Please enter a valid IPv4 address (e.g., 192.168.1.1)");
      return;
    }

    setError("");

    const ipNum = ipToNumber(ip);
    const maskNum = cidrToMask(cidrValue);
    const wildcardNum = ~maskNum >>> 0;
    
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;
    
    const totalHosts = Math.pow(2, 32 - cidrValue);
    const usableHosts = cidrValue >= 31 ? (cidrValue === 32 ? 1 : 2) : totalHosts - 2;
    
    const firstHostNum = cidrValue >= 31 ? networkNum : networkNum + 1;
    const lastHostNum = cidrValue >= 31 ? broadcastNum : broadcastNum - 1;

    const firstOctet = parseInt(ip.split(".")[0], 10);

    setResult({
      networkAddress: numberToIp(networkNum),
      broadcastAddress: numberToIp(broadcastNum),
      firstHost: numberToIp(firstHostNum),
      lastHost: numberToIp(lastHostNum),
      subnetMask: numberToIp(maskNum),
      wildcardMask: numberToIp(wildcardNum),
      totalHosts,
      usableHosts,
      cidr: cidrValue,
      ipClass: getIPClass(firstOctet),
      ipType: getIPType(ip),
      binaryMask: numberToBinary(maskNum),
      binaryNetwork: numberToBinary(networkNum),
    });
  };

  const commonSubnets = [
    { cidr: 8, mask: "255.0.0.0", hosts: "16,777,214" },
    { cidr: 16, mask: "255.255.0.0", hosts: "65,534" },
    { cidr: 24, mask: "255.255.255.0", hosts: "254" },
    { cidr: 25, mask: "255.255.255.128", hosts: "126" },
    { cidr: 26, mask: "255.255.255.192", hosts: "62" },
    { cidr: 27, mask: "255.255.255.224", hosts: "30" },
    { cidr: 28, mask: "255.255.255.240", hosts: "14" },
    { cidr: 29, mask: "255.255.255.248", hosts: "6" },
    { cidr: 30, mask: "255.255.255.252", hosts: "2" },
    { cidr: 31, mask: "255.255.255.254", hosts: "2 (P2P)" },
    { cidr: 32, mask: "255.255.255.255", hosts: "1" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">IP Address</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
              placeholder="192.168.1.1 or 192.168.1.0/24"
              className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CIDR / Prefix Length</label>
            <div className="flex gap-2">
              <span className="flex items-center text-[var(--muted-foreground)] text-xl">/</span>
              <input
                type="number"
                value={cidr}
                onChange={(e) => setCidr(Math.min(32, Math.max(0, parseInt(e.target.value) || 0)))}
                min="0"
                max="32"
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all font-mono"
              />
              <button
                onClick={calculate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* CIDR Slider */}
        <div>
          <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-2">
            <span>More hosts</span>
            <span>Fewer hosts</span>
          </div>
          <input
            type="range"
            value={cidr}
            onChange={(e) => setCidr(parseInt(e.target.value))}
            min="0"
            max="32"
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--muted)] accent-violet-500"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>/0</span>
            <span>/8</span>
            <span>/16</span>
            <span>/24</span>
            <span>/32</span>
          </div>
        </div>

        {/* Error */}
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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Usable Hosts</div>
                <div className="text-2xl font-bold">{result.usableHosts.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">CIDR</div>
                <div className="text-2xl font-bold font-mono">/{result.cidr}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">IP Class</div>
                <div className="text-2xl font-bold">Class {result.ipClass}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Type</div>
                <div className="text-lg font-bold">{result.ipType}</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { label: "Network Address", value: result.networkAddress },
                    { label: "Broadcast Address", value: result.broadcastAddress },
                    { label: "First Usable Host", value: result.firstHost },
                    { label: "Last Usable Host", value: result.lastHost },
                    { label: "Subnet Mask", value: result.subnetMask },
                    { label: "Wildcard Mask", value: result.wildcardMask },
                    { label: "Total Addresses", value: result.totalHosts.toLocaleString() },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--muted)]/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{row.label}</td>
                      <td className="px-4 py-3 font-mono font-medium">{row.value}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => copyToClipboard(row.value.toString())}
                          className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
                          title="Copy"
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

            {/* Binary Representation */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Binary Representation</h3>
              <div className="bg-[var(--muted)] rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-[var(--muted-foreground)] w-24">Subnet Mask:</span>
                  <span className="text-violet-400">{result.binaryMask}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[var(--muted-foreground)] w-24">Network:</span>
                  <span className="text-blue-400">{result.binaryNetwork}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Common Subnets Reference */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Common Subnet Reference</h3>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)]">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">CIDR</th>
                  <th className="px-4 py-2 text-left font-medium">Subnet Mask</th>
                  <th className="px-4 py-2 text-left font-medium">Usable Hosts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {commonSubnets.map((subnet, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-[var(--muted)]/50 transition-colors cursor-pointer ${result?.cidr === subnet.cidr ? "bg-violet-500/10" : ""}`}
                    onClick={() => setCidr(subnet.cidr)}
                  >
                    <td className="px-4 py-2 font-mono">/{subnet.cidr}</td>
                    <td className="px-4 py-2 font-mono">{subnet.mask}</td>
                    <td className="px-4 py-2">{subnet.hosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-400 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <strong>100% Client-Side:</strong> All calculations are performed locally in your browser. No data is sent to any server. You can enter IP addresses with CIDR notation (e.g., 192.168.1.0/24) or separately.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
