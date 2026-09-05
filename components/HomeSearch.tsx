// Accessible homepage search with direct tool suggestions | TypeScript
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getToolBySlug, toolsConfig } from "@/lib/tools-config";
import { featuredSlugs } from "@/lib/tool-discovery";
import { rankTools } from "@/lib/tool-search";
import { SearchIcon, ArrowRightIcon, CloseIcon, getToolIcon } from "@/assets/icons";

const suggestedTools = featuredSlugs.slice(0, 5).map(getToolBySlug).filter((tool) => tool !== undefined);
const resultsId = "home-search-results";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const listbox = useRef<HTMLDivElement>(null);
  const pointerInside = useRef(false);
  const hasQuery = query.trim().length > 0;
  const matches = hasQuery ? rankTools(toolsConfig, query).slice(0, 5) : suggestedTools;
  const activeTool = open ? matches[activeIndex] : undefined;

  function resetSearch() {
    setQuery("");
    setActiveIndex(-1);
    setOpen(true);
    input.current?.focus();
  }

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.key === "/" && !event.metaKey && !event.ctrlKey &&
        !event.altKey && !event.isComposing && target instanceof HTMLElement &&
        !target.closest("input,textarea,select,[contenteditable=true]")
      ) {
        event.preventDefault();
        input.current?.focus({ preventScroll: true });
        const bounds = form.current?.getBoundingClientRect();
        if (bounds && (bounds.top < 96 || bounds.bottom > window.innerHeight)) {
          form.current?.scrollIntoView({ block: "start", behavior: "instant" });
        }
      }
    };
    const dismissOutside = (event: PointerEvent) => {
      pointerInside.current = !!form.current?.contains(event.target as Node);
      if (!pointerInside.current) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    const releasePointer = () => { pointerInside.current = false; };
    window.addEventListener("keydown", shortcut);
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

  useEffect(() => {
    if (open && activeIndex >= 0) {
      const option = listbox.current?.querySelector('[aria-selected="true"]');
      const menu = listbox.current?.parentElement;
      if (option && menu) {
        const optionBounds = option.getBoundingClientRect();
        const menuBounds = menu.getBoundingClientRect();
        if (optionBounds.bottom > menuBounds.bottom) {
          menu.scrollTop += optionBounds.bottom - menuBounds.bottom;
        } else if (optionBounds.top < menuBounds.top) {
          menu.scrollTop -= menuBounds.top - optionBounds.top;
        }
      }
    }
  }, [activeIndex, open]);

  return (
    <form
      ref={form}
      action="/tools"
      method="get"
      role="search"
      className="home-search"
      onBlur={(event) => {
        // Safari may not focus clicked links. Keep suggestions mounted until their click.
        if (!pointerInside.current && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.nativeEvent.isComposing) {
          event.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <label htmlFor="home-search" className="search-label">What would you like to do?</label>
      <div className="home-search-input">
        <span aria-hidden="true"><SearchIcon className="w-5 h-5" /></span>
        <input
          ref={input}
          id="home-search"
          name="q"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? resultsId : undefined}
          aria-activedescendant={activeTool ? `home-search-option-${activeTool.slug}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              if (!matches.length) return;
              const direction = event.key === "ArrowDown" ? 1 : -1;
              setActiveIndex((current) =>
                !open || current < 0
                  ? direction === 1 ? 0 : matches.length - 1
                  : (current + direction + matches.length) % matches.length,
              );
            } else if (event.key === "Enter" && activeTool) {
              event.preventDefault();
              setOpen(false);
              setActiveIndex(-1);
              router.push(`/tools/${activeTool.slug}`);
            }
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search tools or tasks…"
          aria-describedby="search-hint"
        />
        {query && (
          <button className="home-search-clear" type="button" aria-label="Clear search" onClick={resetSearch}>
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
        <button className="btn btn-primary" type="submit">
          Search <span aria-hidden="true"><ArrowRightIcon className="w-4 h-4" /></span>
        </button>
      </div>
      <p id="search-hint" className="search-hint">
        Search by tool, file type, or task.{" "}
        <span className="hidden sm:inline">Press <kbd>/</kbd> to jump here.</span>
      </p>
      {open && (
        <div className="quick-matches">
          <p role="status">
            {!hasQuery ? "Useful tools to get you started" : matches.length
              ? `${matches.length} matching ${matches.length === 1 ? "tool" : "tools"}`
              : "No tools found. Try “PDF”, “image” or “JSON”."}
          </p>
          <div ref={listbox} id={resultsId} className="quick-match-list" role="listbox" aria-label={hasQuery ? "Matching tools" : "Suggested tools"}>
            {matches.map((tool, index) => {
              const Icon = getToolIcon(tool.icon || "document-text");
              return (
                <Link
                  key={tool.slug}
                  id={`home-search-option-${tool.slug}`}
                  href={`/tools/${tool.slug}`}
                  prefetch={false}
                  className="quick-match"
                  role="option"
                  aria-selected={activeIndex === index}
                  aria-label={tool.name}
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => { setOpen(false); setActiveIndex(-1); }}
                >
                  <span className="quick-match-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
                  <span className="quick-match-copy">{tool.name}<small>{tool.description}</small></span>
                  <span className="quick-match-arrow" aria-hidden="true"><ArrowRightIcon className="w-4 h-4" /></span>
                </Link>
              );
            })}
          </div>
          <div className="quick-match-footer">
            {hasQuery && !matches.length ? (
              <button
                key="reset"
                type="button"
                className="btn btn-secondary quick-match-reset"
                onClick={(event) => {
                  event.preventDefault();
                  resetSearch();
                }}
              >Clear search and start again</button>
            ) : (
              <button key="submit" type="submit" className="btn btn-secondary">
                {hasQuery ? "See all search results" : "Browse all tools"}
                <span aria-hidden="true"><ArrowRightIcon className="w-4 h-4" /></span>
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
