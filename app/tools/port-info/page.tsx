// Port Reference Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("port-info")!;
const similarTools = getToolsByCategory("network").filter(t => t.slug !== "port-info");

interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  description: string;
  category: string;
}

const portDatabase: PortInfo[] = [
  // Well-Known Ports (0-1023)
  { port: 20, protocol: "TCP", service: "FTP Data", description: "File Transfer Protocol (data transfer)", category: "File Transfer" },
  { port: 21, protocol: "TCP", service: "FTP Control", description: "File Transfer Protocol (control/command)", category: "File Transfer" },
  { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell - encrypted remote login", category: "Remote Access" },
  { port: 23, protocol: "TCP", service: "Telnet", description: "Unencrypted remote login (deprecated)", category: "Remote Access" },
  { port: 25, protocol: "TCP", service: "SMTP", description: "Simple Mail Transfer Protocol - email sending", category: "Email" },
  { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System - resolves domain names", category: "Infrastructure" },
  { port: 67, protocol: "UDP", service: "DHCP Server", description: "Dynamic Host Configuration Protocol (server)", category: "Infrastructure" },
  { port: 68, protocol: "UDP", service: "DHCP Client", description: "Dynamic Host Configuration Protocol (client)", category: "Infrastructure" },
  { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol", category: "File Transfer" },
  { port: 80, protocol: "TCP", service: "HTTP", description: "Hypertext Transfer Protocol - web traffic", category: "Web" },
  { port: 110, protocol: "TCP", service: "POP3", description: "Post Office Protocol v3 - email retrieval", category: "Email" },
  { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol", category: "Messaging" },
  { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol - time synchronization", category: "Infrastructure" },
  { port: 135, protocol: "TCP", service: "MS RPC", description: "Microsoft Remote Procedure Call", category: "Windows" },
  { port: 137, protocol: "UDP", service: "NetBIOS Name", description: "NetBIOS Name Service", category: "Windows" },
  { port: 138, protocol: "UDP", service: "NetBIOS Datagram", description: "NetBIOS Datagram Service", category: "Windows" },
  { port: 139, protocol: "TCP", service: "NetBIOS Session", description: "NetBIOS Session Service", category: "Windows" },
  { port: 143, protocol: "TCP", service: "IMAP", description: "Internet Message Access Protocol - email retrieval", category: "Email" },
  { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management Protocol", category: "Infrastructure" },
  { port: 162, protocol: "UDP", service: "SNMP Trap", description: "SNMP Trap notifications", category: "Infrastructure" },
  { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol - internet routing", category: "Infrastructure" },
  { port: 194, protocol: "TCP", service: "IRC", description: "Internet Relay Chat", category: "Messaging" },
  { port: 389, protocol: "TCP", service: "LDAP", description: "Lightweight Directory Access Protocol", category: "Infrastructure" },
  { port: 443, protocol: "TCP", service: "HTTPS", description: "HTTP over TLS/SSL - secure web traffic", category: "Web" },
  { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block - Windows file sharing", category: "Windows" },
  { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP over SSL (deprecated, use 587)", category: "Email" },
  { port: 514, protocol: "UDP", service: "Syslog", description: "System Logging Protocol", category: "Infrastructure" },
  { port: 515, protocol: "TCP", service: "LPD", description: "Line Printer Daemon - printing", category: "Printing" },
  { port: 520, protocol: "UDP", service: "RIP", description: "Routing Information Protocol", category: "Infrastructure" },
  { port: 587, protocol: "TCP", service: "SMTP Submission", description: "Email message submission (with STARTTLS)", category: "Email" },
  { port: 631, protocol: "TCP", service: "IPP", description: "Internet Printing Protocol (CUPS)", category: "Printing" },
  { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP over SSL", category: "Infrastructure" },
  { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP over SSL - secure email retrieval", category: "Email" },
  { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 over SSL - secure email retrieval", category: "Email" },
  
  // Registered Ports (1024-49151)
  { port: 1080, protocol: "TCP", service: "SOCKS", description: "SOCKS proxy protocol", category: "Proxy" },
  { port: 1433, protocol: "TCP", service: "MS SQL", description: "Microsoft SQL Server", category: "Database" },
  { port: 1434, protocol: "UDP", service: "MS SQL Browser", description: "Microsoft SQL Server Browser", category: "Database" },
  { port: 1521, protocol: "TCP", service: "Oracle DB", description: "Oracle Database listener", category: "Database" },
  { port: 1701, protocol: "UDP", service: "L2TP", description: "Layer 2 Tunneling Protocol", category: "VPN" },
  { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling Protocol", category: "VPN" },
  { port: 1812, protocol: "UDP", service: "RADIUS Auth", description: "RADIUS Authentication", category: "Security" },
  { port: 1813, protocol: "UDP", service: "RADIUS Acct", description: "RADIUS Accounting", category: "Security" },
  { port: 2049, protocol: "TCP/UDP", service: "NFS", description: "Network File System", category: "File Transfer" },
  { port: 2082, protocol: "TCP", service: "cPanel", description: "cPanel default port", category: "Web" },
  { port: 2083, protocol: "TCP", service: "cPanel SSL", description: "cPanel SSL default port", category: "Web" },
  { port: 2222, protocol: "TCP", service: "DirectAdmin", description: "DirectAdmin control panel", category: "Web" },
  { port: 3306, protocol: "TCP", service: "MySQL", description: "MySQL Database Server", category: "Database" },
  { port: 3389, protocol: "TCP", service: "RDP", description: "Remote Desktop Protocol (Windows)", category: "Remote Access" },
  { port: 3690, protocol: "TCP", service: "SVN", description: "Subversion version control", category: "Development" },
  { port: 4443, protocol: "TCP", service: "Pharos", description: "Pharos / Alternative HTTPS", category: "Web" },
  { port: 5060, protocol: "TCP/UDP", service: "SIP", description: "Session Initiation Protocol (VoIP)", category: "VoIP" },
  { port: 5061, protocol: "TCP", service: "SIP TLS", description: "SIP over TLS (VoIP)", category: "VoIP" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL Database Server", category: "Database" },
  { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing", category: "Remote Access" },
  { port: 5901, protocol: "TCP", service: "VNC :1", description: "VNC Display 1", category: "Remote Access" },
  { port: 6379, protocol: "TCP", service: "Redis", description: "Redis in-memory database", category: "Database" },
  { port: 6443, protocol: "TCP", service: "Kubernetes API", description: "Kubernetes API Server", category: "Container" },
  { port: 6667, protocol: "TCP", service: "IRC", description: "Internet Relay Chat (alternate)", category: "Messaging" },
  { port: 8000, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP port", category: "Web" },
  { port: 8080, protocol: "TCP", service: "HTTP Proxy", description: "HTTP Proxy / Alternative HTTP", category: "Web" },
  { port: 8443, protocol: "TCP", service: "HTTPS Alt", description: "Alternative HTTPS port", category: "Web" },
  { port: 8888, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP / Admin", category: "Web" },
  { port: 9000, protocol: "TCP", service: "PHP-FPM", description: "PHP FastCGI Process Manager", category: "Web" },
  { port: 9090, protocol: "TCP", service: "Prometheus", description: "Prometheus monitoring", category: "Monitoring" },
  { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch HTTP", category: "Database" },
  { port: 9300, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch Transport", category: "Database" },
  { port: 9418, protocol: "TCP", service: "Git", description: "Git protocol", category: "Development" },
  { port: 10000, protocol: "TCP", service: "Webmin", description: "Webmin admin panel", category: "Web" },
  { port: 11211, protocol: "TCP/UDP", service: "Memcached", description: "Memcached caching system", category: "Database" },
  { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB Database Server", category: "Database" },
  { port: 27018, protocol: "TCP", service: "MongoDB", description: "MongoDB shard server", category: "Database" },
  { port: 50000, protocol: "TCP", service: "DB2", description: "IBM DB2 Database", category: "Database" },
];

const categories = [...new Set(portDatabase.map(p => p.category))].sort();

export default function PortInfoPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [portInput, setPortInput] = useState("");
  const [lookupResult, setLookupResult] = useState<PortInfo | null>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  const filteredPorts = useMemo(() => {
    let filtered = portDatabase;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.service.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.protocol.toLowerCase().includes(searchLower) ||
        p.port.toString().includes(searchLower)
      );
    }

    return filtered;
  }, [search, selectedCategory]);

  const lookupPort = () => {
    const portNum = parseInt(portInput.trim(), 10);
    if (isNaN(portNum) || portNum < 0 || portNum > 65535) {
      setLookupResult(null);
      setLookupNotFound(true);
      return;
    }

    const found = portDatabase.find(p => p.port === portNum);
    setLookupResult(found || null);
    setLookupNotFound(!found);
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Web": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Email": "bg-green-500/20 text-green-400 border-green-500/30",
      "Database": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Remote Access": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "File Transfer": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Infrastructure": "bg-gray-500/20 text-gray-400 border-gray-500/30",
      "Security": "bg-red-500/20 text-red-400 border-red-500/30",
      "VPN": "bg-teal-500/20 text-teal-400 border-teal-500/30",
      "Windows": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      "Messaging": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "VoIP": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "Development": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "Container": "bg-violet-500/20 text-violet-400 border-violet-500/30",
      "Monitoring": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    };
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getProtocolColor = (protocol: string): string => {
    if (protocol === "TCP") return "bg-blue-500/20 text-blue-400";
    if (protocol === "UDP") return "bg-green-500/20 text-green-400";
    return "bg-purple-500/20 text-purple-400";
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Port Lookup */}
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Port Lookup</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupPort()}
              placeholder="Enter port number (0-65535)"
              min="0"
              max="65535"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all font-mono"
            />
            <button
              onClick={lookupPort}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all"
            >
              Lookup
            </button>
          </div>

          {lookupResult && (
            <div className="mt-4 bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-mono font-bold text-violet-400">{lookupResult.port}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{lookupResult.service}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProtocolColor(lookupResult.protocol)}`}>
                      {lookupResult.protocol}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{lookupResult.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(lookupResult.category)}`}>
                    {lookupResult.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {lookupNotFound && !lookupResult && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
              Port not found in database. This could be a dynamic/ephemeral port or a custom application port.
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ports, services, or protocols..."
              className="w-full px-4 py-3 pl-11 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-[var(--muted-foreground)]">
          Showing {filteredPorts.length} of {portDatabase.length} ports
        </div>

        {/* Ports Table */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Port</th>
                <th className="px-4 py-3 text-left font-medium">Protocol</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPorts.map((port) => (
                <tr key={`${port.port}-${port.protocol}`} className="hover:bg-[var(--muted)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-violet-400">{port.port}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProtocolColor(port.protocol)}`}>
                      {port.protocol}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{port.service}</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)] hidden md:table-cell">{port.description}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryColor(port.category)}`}>
                      {port.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPorts.length === 0 && (
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            No ports found matching your search criteria.
          </div>
        )}

        {/* Port Ranges Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="text-sm font-medium mb-1">Well-Known Ports</div>
            <div className="text-2xl font-mono font-bold text-blue-400">0 - 1023</div>
            <div className="text-xs text-[var(--muted-foreground)]">Reserved for system services</div>
          </div>
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="text-sm font-medium mb-1">Registered Ports</div>
            <div className="text-2xl font-mono font-bold text-purple-400">1024 - 49151</div>
            <div className="text-xs text-[var(--muted-foreground)]">Assigned by IANA for applications</div>
          </div>
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="text-sm font-medium mb-1">Dynamic Ports</div>
            <div className="text-2xl font-mono font-bold text-green-400">49152 - 65535</div>
            <div className="text-xs text-[var(--muted-foreground)]">Ephemeral/private ports</div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-400 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <strong>100% Client-Side:</strong> This is a reference tool containing a database of common port numbers and their associated services. All data is stored locally - no external lookups are performed.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
