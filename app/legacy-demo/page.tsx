"use client";

import { useState, useEffect } from "react";

/**
 * This demo shows that OLD legacy code automatically gets the new modern design!
 * No need to update existing tool files - they're already upgraded via global CSS.
 */

export default function LegacyCodeDemo() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState("json");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Auto-Styled Legacy Code</h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          All this code uses OLD class names - but looks MODERN automatically!
        </p>
      </div>

      <div className="tool-container space-y-6">
        <div className="alert alert-success">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm font-medium">
            All elements below use standard HTML and old class names - no updates needed!
          </div>
        </div>

        {/* OLD CODE - Textarea */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Standard Textarea (No Component)
          </label>
          <textarea
            placeholder="This is a plain HTML textarea - but it's styled automatically!"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Just a regular <code>&lt;textarea&gt;</code> tag
          </p>
        </div>

        {/* OLD CODE - Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Standard Text Input
            </label>
            <input
              type="text"
              placeholder="Type something..."
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Standard Number Input
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>

        {/* OLD CODE - Select */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Standard Select Dropdown
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full"
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
            <option value="csv">CSV</option>
          </select>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Plain <code>&lt;select&gt;</code> with custom arrow and styling
          </p>
        </div>

        {/* OLD CODE - Buttons with old classes */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Old Button Classes</p>
            <div className="flex gap-3">
              <button className="btn btn-primary">
                btn-primary
              </button>
              <button className="btn btn-secondary">
                btn-secondary
              </button>
            </div>
          </div>
        </div>

        {/* OLD CODE - Checkboxes and Radio */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Standard Checkbox</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <span className="text-sm">Enable advanced features</span>
            </label>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Standard Radio Buttons</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="size" value="small" defaultChecked />
                <span className="text-sm">Small</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="size" value="medium" />
                <span className="text-sm">Medium</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="size" value="large" />
                <span className="text-sm">Large</span>
              </label>
            </div>
          </div>
        </div>

        {/* Scrollbar demo */}
        <div>
          <p className="text-sm font-medium mb-2">Custom Scrollbars</p>
          <div className="p-4 bg-[var(--muted)] rounded-xl h-32 overflow-auto">
            <p className="whitespace-pre-wrap">
              Scroll me! Both vertical and horizontal scrollbars are styled.{"\n"}
              {Array(20).fill("Line of text that demonstrates the custom scrollbar styling. ").join("\n")}
            </p>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Violet gradient scrollbars everywhere
          </p>
        </div>

        <div className="separator">
          <span>All styled automatically via globals.css</span>
        </div>

        <div className="alert alert-info">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <strong>Result:</strong> All {tool.count || "100+"} tools automatically look modern without any code changes!
          </div>
        </div>
      </div>
    </div>
  );
}

const tool = { count: 100 };
