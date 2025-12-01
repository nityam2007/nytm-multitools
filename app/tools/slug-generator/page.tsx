"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("slug-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "slug-generator");

export default function SlugGeneratorPage() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(0);

  const stopWords = ["a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "with", "by"];

  const generateSlug = (): string => {
    let result = text.trim();
    
    // Remove accents
    result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Convert to lowercase if option is set
    if (lowercase) {
      result = result.toLowerCase();
    }
    
    // Remove stop words if option is set
    if (removeStopWords) {
      const words = result.split(/\s+/);
      result = words.filter(word => !stopWords.includes(word.toLowerCase())).join(" ");
    }
    
    // Replace special characters with separator
    result = result.replace(/[^a-zA-Z0-9\s]/g, "");
    
    // Replace spaces with separator
    result = result.replace(/\s+/g, separator);
    
    // Remove consecutive separators
    result = result.replace(new RegExp(`${separator}+`, "g"), separator);
    
    // Remove leading/trailing separators
    result = result.replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
    
    // Apply max length if set
    if (maxLength > 0 && result.length > maxLength) {
      result = result.substring(0, maxLength);
      // Remove trailing separator
      result = result.replace(new RegExp(`${separator}$`, "g"), "");
    }
    
    return result;
  };

  const slug = generateSlug();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a title or phrase to convert to a slug..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Separator</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Length (0 = no limit)</label>
            <input
              type="number"
              min="0"
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Lowercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Remove stop words</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Generated Slug</label>
            <button
              onClick={copyToClipboard}
              disabled={!slug}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] font-mono break-all">
            {slug || <span className="text-[var(--muted-foreground)]">Slug will appear here...</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Input Length</div>
            <div className="text-2xl font-bold">{text.length}</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Slug Length</div>
            <div className="text-2xl font-bold">{slug.length}</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
