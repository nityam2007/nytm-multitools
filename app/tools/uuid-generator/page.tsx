"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";

const tool = getToolBySlug("uuid-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "uuid-generator");

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<"v4" | "v1">("v4");
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const generateUuids = useCallback(async () => {
    const generated: string[] = [];
    const startTime = Date.now();

    for (let i = 0; i < count; i++) {
      let uuid = version === "v4" ? uuidv4() : uuidv1();
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, "");
      generated.push(uuid);
    }

    setUuids(generated);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "none",
      outputResult: generated.join("\n"),
      processingDuration: Date.now() - startTime,
      metadata: { version, count, uppercase, noDashes },
    });
  }, [version, count, uppercase, noDashes]);

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">UUID Version</label>
            <div className="flex gap-2">
              {(["v4", "v1"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    version === v
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  UUID {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Remove Dashes</span>
          </label>
        </div>

        <button
          onClick={generateUuids}
          className="btn btn-primary w-full py-3"
        >
          Generate UUID{count > 1 ? "s" : ""}
        </button>

        {/* Generated UUIDs */}
        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated UUIDs</label>
              {uuids.length > 1 && (
                <button
                  onClick={copyAll}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  {copied === -1 ? "Copied!" : "Copy All"}
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg font-mono text-sm"
                >
                  <span className="flex-1 break-all">{uuid}</span>
                  <button
                    onClick={() => copyToClipboard(uuid, index)}
                    className="p-1.5 rounded hover:bg-[var(--background)] transition-colors"
                  >
                    {copied === index ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
