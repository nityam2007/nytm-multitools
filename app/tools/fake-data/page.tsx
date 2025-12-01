"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("fake-data")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "fake-data");

const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com", "company.org"];
const streets = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Elm St", "Washington Ave", "Lake Dr", "Hill Rd", "Park Ave"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
const companies = ["Acme Corp", "Global Tech", "Innovative Solutions", "Premier Services", "Quality Systems", "Advanced Networks", "Dynamic Solutions", "Enterprise Holdings", "Nexus Group", "Pinnacle Inc"];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generators = {
  fullName: () => `${random(firstNames)} ${random(lastNames)}`,
  firstName: () => random(firstNames),
  lastName: () => random(lastNames),
  email: () => `${random(firstNames).toLowerCase()}.${random(lastNames).toLowerCase()}${randomInt(1, 99)}@${random(domains)}`,
  phone: () => `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
  address: () => `${randomInt(100, 9999)} ${random(streets)}`,
  city: () => random(cities),
  zipCode: () => String(randomInt(10000, 99999)),
  company: () => random(companies),
  username: () => `${random(firstNames).toLowerCase()}${randomInt(1, 999)}`,
  password: () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return Array.from({ length: 12 }, () => chars[randomInt(0, chars.length - 1)]).join("");
  },
  creditCard: () => `${randomInt(4000, 4999)}-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
  date: () => {
    const d = new Date(Date.now() - randomInt(0, 365 * 50) * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  },
  ipAddress: () => `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
  uuid: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  }),
};

type GeneratorType = keyof typeof generators;

export default function FakeDataPage() {
  const [selectedTypes, setSelectedTypes] = useState<GeneratorType[]>(["fullName", "email", "phone"]);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<Record<GeneratorType, string>[]>([]);

  const generate = () => {
    const data: Record<GeneratorType, string>[] = [];
    for (let i = 0; i < count; i++) {
      const row: Record<GeneratorType, string> = {} as Record<GeneratorType, string>;
      selectedTypes.forEach(type => {
        row[type] = generators[type]();
      });
      data.push(row);
    }
    setResults(data);
  };

  const toggleType = (type: GeneratorType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const copyAsJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
  };

  const copyAsCSV = () => {
    if (results.length === 0) return;
    const headers = selectedTypes.join(",");
    const rows = results.map(row => selectedTypes.map(t => `"${row[t]}"`).join(","));
    navigator.clipboard.writeText([headers, ...rows].join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Select Data Types</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(Object.keys(generators) as GeneratorType[]).map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="w-4 h-4"
                />
                <span className="text-sm capitalize">{type.replace(/([A-Z])/g, " $1")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Number of Records</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <button
            onClick={generate}
            disabled={selectedTypes.length === 0}
            className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Generate
          </button>
        </div>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Results ({results.length} records)</label>
              <div className="flex gap-2">
                <button
                  onClick={copyAsJSON}
                  className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  Copy JSON
                </button>
                <button
                  onClick={copyAsCSV}
                  className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  Copy CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    {selectedTypes.map(type => (
                      <th key={type} className="px-4 py-2 text-left capitalize">
                        {type.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "" : "bg-[var(--muted)]/30"}>
                      <td className="px-4 py-2 text-[var(--muted-foreground)]">{idx + 1}</td>
                      {selectedTypes.map(type => (
                        <td key={type} className="px-4 py-2 font-mono text-xs">{row[type]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
