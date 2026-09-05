// Homepage search with direct links to matching tools | TypeScript
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toolsConfig } from "@/lib/tools-config";
import { rankTools } from "@/lib/tool-search";
import { SearchIcon, ArrowRightIcon } from "@/assets/icons";
export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const pointerInside = useRef(false);
  const matches = query.trim() ? rankTools(toolsConfig, query).slice(0, 5) : [];
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !target.closest("input,textarea,select,[contenteditable=true]")
      ) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    const dismissOutside = (event: PointerEvent) => {
      pointerInside.current = !!form.current?.contains(event.target as Node);
      if (!pointerInside.current) setOpen(false);
    };
    const releasePointer = () => {
      pointerInside.current = false;
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("pointerup", releasePointer);
    document.addEventListener("pointercancel", releasePointer);
    return () => {
      window.removeEventListener("keydown", shortcut);
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("pointerup", releasePointer);
      document.removeEventListener("pointercancel", releasePointer);
    };
  }, []);
  return (
    <form
      ref={form}
      action="/tools"
      method="get"
      role="search"
      className="home-search"
      onBlur={(event) => {
        // Safari does not focus clicked links; let pointerdown handle those
        // clicks so a suggestion survives until its navigation event.
        if (
          !pointerInside.current &&
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <label htmlFor="home-search" className="search-label">
        What would you like to do?
      </label>
      <div className="home-search-input">
        <span aria-hidden="true">
          <SearchIcon className="w-5 h-5" />
        </span>
        <input
          ref={input}
          id="home-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          placeholder="Try “compress PDF” or “resize image”…"
          aria-describedby="search-hint"
        />
        <button className="btn btn-primary" type="submit">
          Search{" "}
          <span aria-hidden="true">
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        </button>
      </div>
      <p id="search-hint" className="search-hint">
        Search by tool, file type, or task.{" "}
        <span className="hidden sm:inline">
          Press <kbd>/</kbd> to jump here.
        </span>
      </p>
      {open && query.trim() && (
        <div className="quick-matches" aria-label="Quick tool matches">
          <p role="status">
            {matches.length
              ? "Open a matching tool"
              : "No exact matches. Try a file type or a shorter task."}
          </p>
          {matches.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <span>
                {tool.name}
                <small>{tool.description}</small>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <button type="submit" className="btn btn-secondary">
            Search the full library →
          </button>
        </div>
      )}
    </form>
  );
}
