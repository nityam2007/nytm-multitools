"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("ascii-table")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "ascii-table");

const asciiData = Array.from({ length: 128 }, (_, i) => {
  let char = "";
  let description = "";
  
  if (i < 32) {
    const controlChars: Record<number, string> = {
      0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ", 6: "ACK", 7: "BEL",
      8: "BS", 9: "TAB", 10: "LF", 11: "VT", 12: "FF", 13: "CR", 14: "SO", 15: "SI",
      16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
      24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS", 30: "RS", 31: "US",
    };
    char = controlChars[i];
    description = "Control";
  } else if (i === 32) {
    char = "SP";
    description = "Space";
  } else if (i === 127) {
    char = "DEL";
    description = "Delete";
  } else {
    char = String.fromCharCode(i);
    if (i >= 48 && i <= 57) description = "Digit";
    else if (i >= 65 && i <= 90) description = "Upper";
    else if (i >= 97 && i <= 122) description = "Lower";
    else description = "Symbol";
  }
  
  return {
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, "0"),
    oct: i.toString(8).padStart(3, "0"),
    bin: i.toString(2).padStart(8, "0"),
    char,
    description,
  };
});

export default function AsciiTablePage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredData = asciiData.filter(item => {
    if (filter === "printable" && (item.dec < 32 || item.dec === 127)) return false;
    if (filter === "control" && item.dec >= 32 && item.dec !== 127) return false;
    if (filter === "letters" && item.description !== "Upper" && item.description !== "Lower") return false;
    if (filter === "digits" && item.description !== "Digit") return false;
    
    if (search) {
      const s = search.toLowerCase();
      return (
        item.dec.toString().includes(s) ||
        item.hex.toLowerCase().includes(s) ||
        item.char.toLowerCase().includes(s)
      );
    }
    
    return true;
  });

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by decimal, hex, or character..."
            className="flex-1 min-w-48 px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          >
            <option value="all">All Characters</option>
            <option value="printable">Printable Only</option>
            <option value="control">Control Characters</option>
            <option value="letters">Letters Only</option>
            <option value="digits">Digits Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Dec</th>
                <th className="px-4 py-3 text-left font-medium">Hex</th>
                <th className="px-4 py-3 text-left font-medium">Oct</th>
                <th className="px-4 py-3 text-left font-medium">Bin</th>
                <th className="px-4 py-3 text-left font-medium">Char</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.dec} className={idx % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--muted)]/30"}>
                  <td className="px-4 py-2 font-mono">{item.dec}</td>
                  <td className="px-4 py-2 font-mono">{item.hex}</td>
                  <td className="px-4 py-2 font-mono">{item.oct}</td>
                  <td className="px-4 py-2 font-mono text-xs">{item.bin}</td>
                  <td className="px-4 py-2 font-mono font-bold">{item.char}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.description === "Control" ? "bg-red-500/20 text-red-500" :
                      item.description === "Upper" ? "bg-blue-500/20 text-blue-500" :
                      item.description === "Lower" ? "bg-green-500/20 text-green-500" :
                      item.description === "Digit" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-purple-500/20 text-purple-500"
                    }`}>
                      {item.description}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-[var(--muted-foreground)]">
          Showing {filteredData.length} of 128 characters
        </div>
      </div>
    </ToolLayout>
  );
}
