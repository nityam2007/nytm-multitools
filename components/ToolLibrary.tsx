// Searchable, shareable tool library with pins and pagination | TypeScript
"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ToolCard } from "./ToolCard";
import { toolsConfig } from "@/lib/tools-config";
import { discoveryCategories } from "@/lib/tool-discovery";
import { rankTools } from "@/lib/tool-search";
import { usePreference } from "@/lib/tool-history";

const pageSize = 24;
export function ToolLibrary({
  category: fixedCategory,
}: {
  category?: string;
}) {
  const params = useSearchParams(),
    pathname = usePathname();
  const query = params.get("q") || params.get("search") || "";
  const category =
    fixedCategory ||
    (discoveryCategories.some((c) => c.id === params.get("category"))
      ? params.get("category")!
      : "all");
  const file = ["pdf", "image", "document"].includes(params.get("file") || "")
    ? params.get("file")!
    : "all";
  const scope = ["pinned", "new"].includes(params.get("scope") || "")
    ? params.get("scope")!
    : "all";
  const sort = ["name", "category"].includes(params.get("sort") || "")
    ? params.get("sort")!
    : "relevance";
  const view = params.get("view") === "list" ? "list" : "grid";
  const saved = usePreference("pinnedTools", "[]");
  let pins: string[] = [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed))
      pins = parsed.filter((s): s is string => typeof s === "string");
  } catch {}
  const searchInput = useRef<HTMLInputElement>(null);
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
        searchInput.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  function href(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    next.delete("search");
    if (params.has("search") && !params.has("q")) next.set("q", query);
    if (!("page" in changes)) next.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (
        !value ||
        value === "all" ||
        (key === "sort" && value === "relevance") ||
        (key === "view" && value === "grid")
      )
        next.delete(key);
      else next.set(key, value);
    }
    return pathname + (next.size ? `?${next}` : "");
  }
  function update(changes: Record<string, string>, replace = false) {
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      href(changes),
    );
  }
  const base = toolsConfig.filter(
    (tool) =>
      (category === "all" || tool.category === category) &&
      (file === "all" ||
        tool.fileTypes?.includes(file as "pdf" | "image" | "document")) &&
      (scope === "all" ||
        (scope === "pinned" ? pins.includes(tool.slug) : tool.isNew)),
  );
  const matches = rankTools(base, query);
  if (sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "category")
    matches.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
    );
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const requestedPage = Number(params.get("page"));
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, pages)
      : 1;
  const visible = matches.slice((page - 1) * pageSize, page * pageSize);
  const active =
    !!query || category !== "all" || file !== "all" || scope !== "all";
  const categoryName = discoveryCategories.find((c) => c.id === category)?.name;
  return (
    <section aria-label="Find a tool">
      <div className="library-controls">
        <div className="library-search-row">
          <div>
            <label htmlFor="library-query">
              Search{" "}
              {fixedCategory
                ? categoryName?.toLowerCase()
                : `all ${toolsConfig.length} tools`}
            </label>
            <div className="library-search-box">
              <input
                ref={searchInput}
                id="library-query"
                name="q"
                type="search"
                placeholder="Tool, file type, or task…"
                autoComplete="off"
                value={query}
                onChange={(event) => update({ q: event.target.value }, true)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    update({ q: "" });
                    searchInput.current?.focus();
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="library-file">File type</label>
            <select
              id="library-file"
              value={file}
              onChange={(event) => update({ file: event.target.value })}
            >
              <option value="all">Any file type</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
            </select>
          </div>
          <div>
            <label htmlFor="library-sort">Sort results</label>
            <select
              id="library-sort"
              value={sort}
              onChange={(event) => update({ sort: event.target.value })}
            >
              <option value="relevance">
                {query ? "Best match" : "Featured order"}
              </option>
              <option value="name">Name A–Z</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
        {!fixedCategory && (
          <div
            className="filter-row"
            role="group"
            aria-label="Filter by category"
          >
            <button
              className="filter-chip"
              aria-pressed={category === "all"}
              onClick={() => update({ category: "all" })}
            >
              All categories <small>{toolsConfig.length}</small>
            </button>
            {discoveryCategories.map((c) => (
              <button
                key={c.id}
                className="filter-chip"
                aria-pressed={category === c.id}
                onClick={() => update({ category: c.id })}
              >
                {c.name}
                <small>
                  {toolsConfig.filter((t) => t.category === c.id).length}
                </small>
              </button>
            ))}
          </div>
        )}
        <div
          className="filter-row"
          role="group"
          aria-label="Personal collection"
        >
          <button
            className="filter-chip"
            aria-pressed={scope === "all"}
            onClick={() => update({ scope: "all" })}
          >
            All tools
          </button>
          <button
            className="filter-chip"
            aria-pressed={scope === "pinned"}
            onClick={() => update({ scope: "pinned" })}
          >
            Pinned{" "}
            <small>
              {toolsConfig.filter((t) => pins.includes(t.slug)).length}
            </small>
          </button>
          <button
            className="filter-chip"
            aria-pressed={scope === "new"}
            onClick={() => update({ scope: "new" })}
          >
            Recently added
          </button>
          {active && (
            <button
              className="filter-chip"
              onClick={() =>
                update({ q: "", category: "all", file: "all", scope: "all" })
              }
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
      <div className="library-results-heading" id="tool-results">
        <div>
          <h2 role="status" aria-live="polite">
            {matches.length} {matches.length === 1 ? "tool" : "tools"}
            {query
              ? ` matching “${query}”`
              : categoryName
                ? ` in ${categoryName.toLowerCase()}`
                : " ready to use"}
          </h2>
          <p>
            {matches.length
              ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, matches.length)}. Open a tool, or pin it for next time.`
              : "Try fewer filters or another search term."}
          </p>
        </div>
        <div className="view-options" role="group" aria-label="Results layout">
          <button
            aria-pressed={view === "grid"}
            onClick={() => update({ view: "grid", page: String(page) })}
          >
            Grid
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => update({ view: "list", page: String(page) })}
          >
            List
          </button>
        </div>
      </div>
      {visible.length ? (
        <div className={view === "list" ? "tool-list" : "tool-grid"}>
          {visible.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <h3>
            {scope === "pinned" && !pins.length
              ? "Keep your useful tools close"
              : "No tools match these filters"}
          </h3>
          <p>
            {scope === "pinned" && !pins.length
              ? "Use the Pin button on any tool card. Your pinned tools are saved in this browser and appear here."
              : "Try “PDF”, “image”, or “JSON”. You can also reset your filters and browse the collection."}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() =>
              update({ q: "", category: "all", file: "all", scope: "all" })
            }
          >
            Show {fixedCategory ? "category" : "all"} tools →
          </button>
          {fixedCategory && (
            <Link className="btn btn-secondary ml-2" href="/tools">
              Search all tools
            </Link>
          )}
        </div>
      )}
      {pages > 1 && (
        <nav className="library-pagination" aria-label="Tool results pages">
          {page > 1 ? (
            <Link
              className="btn btn-secondary"
              href={href({ page: String(page - 1) }) + "#tool-results"}
            >
              ← Previous
            </Link>
          ) : (
            <span
              className="btn btn-secondary disabled-page"
              aria-disabled="true"
            >
              ← Previous
            </span>
          )}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              className="btn btn-secondary"
              href={href({ page: String(page + 1) }) + "#tool-results"}
            >
              Next →
            </Link>
          ) : (
            <span
              className="btn btn-secondary disabled-page"
              aria-disabled="true"
            >
              Next →
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
