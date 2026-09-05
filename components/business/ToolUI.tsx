// Accessible controls for business tools | TypeScript
"use client";
import { useId, useState, type ReactNode } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { downloadText } from "@/lib/browser-files";

export function Workspace({
  slug,
  children,
  help,
}: {
  slug: string;
  children: ReactNode;
  help?: ReactNode;
}) {
  const tool = getToolBySlug(slug)!;
  return (
    <ToolLayout
      tool={tool}
      similarTools={getToolsByCategory(tool.category).filter(
        (t) => t.slug !== slug,
      )}
    >
      <div className="space-y-6 business-workspace">
        {children}
        {help && (
          <aside className="border-t border-[var(--border)] pt-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {help}
          </aside>
        )}
      </div>
    </ToolLayout>
  );
}
export function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  step,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  multiline?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder={placeholder}
          className="field-control w-full"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="field-control w-full"
        />
      )}
    </div>
  );
}
export function Choice({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className="field-control w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Result({
  text,
  filename = "result.txt",
  label = "Result",
}: {
  text: string;
  filename?: string;
  label?: string;
}) {
  const [notice, setNotice] = useState("");
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{label}</h2>
      <textarea
        aria-label={label}
        readOnly
        value={text}
        rows={Math.min(14, Math.max(3, text.split("\n").length))}
        className="w-full font-mono text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="btn btn-primary"
          disabled={!text}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setNotice("Copied.");
            } catch {
              setNotice("Copy unavailable. Select the result or download it.");
            }
          }}
        >
          Copy
        </button>
        <button
          className="btn btn-secondary"
          disabled={!text}
          onClick={() => downloadText(text, filename)}
        >
          Download
        </button>
        <span role="status" className="text-sm">
          {notice}
        </span>
      </div>
    </section>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap"
    >
      {children}
    </p>
  );
}
