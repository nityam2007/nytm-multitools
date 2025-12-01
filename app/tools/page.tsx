"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ToolCard } from "@/components/ToolCard";
import { toolsConfig } from "@/lib/tools-config";
import { SearchIcon, CloseIcon, ChevronDownIcon, getCategoryIcon } from "@/assets/icons";

const categories = [
  { id: "all", name: "All" },
  { id: "text", name: "Text" },
  { id: "image", name: "Image" },
  { id: "dev", name: "Developer" },
  { id: "converter", name: "Converters" },
  { id: "generator", name: "Generators" },
  { id: "security", name: "Security" },
  { id: "misc", name: "Misc" },
];

const sortOptions = [
  { id: "name", name: "Name" },
  { id: "newest", name: "Newest" },
  { id: "category", name: "Category" },
];

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          document.getElementById("tools-search")?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    let tools = [...toolsConfig];

    // Filter by category
    if (selectedCategory !== "all") {
      tools = tools.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.keywords?.some((k) => k.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === "name") {
      tools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      tools.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === "category") {
      tools.sort((a, b) => a.category.localeCompare(b.category));
    }

    return tools;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Swiss style with animation */}
      <div className="mb-12 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex items-baseline gap-4 mb-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]">Tools</h1>
          <span className="text-sm text-[var(--muted-foreground)] tabular-nums bg-[var(--muted)] px-2 py-1 rounded-lg">{toolsConfig.length} total</span>
        </div>
        <p className="text-[var(--muted-foreground)] text-base" style={{ lineHeight: '1.6' }}>
          Browse our complete collection of free online tools
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-fade-slide-up animate-delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            id="tools-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full px-4 py-3 pl-11 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 focus:bg-violet-500/5 text-sm transition-all duration-200"
          />
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 kbd text-[10px] hidden sm:flex">/</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-violet-400 transition-colors"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 text-sm transition-all duration-200 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Sort: {option.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none"
          />
        </div>
      </div>

      {/* Category Pills - Enhanced */}
      <div className="mb-8 overflow-x-auto animate-fade-slide-up animate-delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((category) => {
            const count = category.id === "all" 
              ? toolsConfig.length 
              : toolsConfig.filter(t => t.category === category.id).length;
            const CategoryIcon = getCategoryIcon(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-[var(--muted-foreground)] hover:bg-violet-500/10 hover:text-violet-400 border border-[var(--border)]"
                }`}
              >
                <CategoryIcon className="w-4 h-4" />
                {category.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedCategory === category.id ? "bg-white/20" : "bg-[var(--muted)]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-[var(--muted-foreground)]">
          {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
          {searchQuery && <span className="ml-1">for &quot;{searchQuery}&quot;</span>}
        </span>
      </div>

      {/* Tools Grid - Optimized density */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, index) => (
            <div 
              key={tool.slug}
              className="animate-fade-slide-up"
              style={{ 
                opacity: 0, 
                animationFillMode: 'forwards',
                animationDelay: `${Math.min(index * 30, 300)}ms`
              }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-[var(--border)] rounded-2xl bg-[var(--card)]">
          <div className="text-4xl mb-4 font-mono">∅</div>
          <h3 className="text-lg font-semibold mb-2">No tools found</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Try adjusting your search or filter
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 text-sm rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-[var(--muted)] rounded w-32 mb-2" />
          <div className="h-4 bg-[var(--muted)] rounded w-64 mb-10" />
          <div className="h-10 bg-[var(--muted)] rounded w-80 mb-6" />
          <div className="flex gap-1 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-[var(--muted)] rounded w-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 bg-[var(--muted)] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ToolsContent />
    </Suspense>
  );
}
