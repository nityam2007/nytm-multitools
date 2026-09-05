"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecentTools } from "@/components/RecentTools";
import { readToolList } from "@/lib/tool-history";
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
  { id: "network", name: "Network" },
  { id: "misc", name: "Misc" },
];

const fileTypes = [
  { id: "all", name: "All Files", icon: "M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" },
  { id: "pdf", name: "PDF", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  { id: "image", name: "Images", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  { id: "document", name: "Documents", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
];

const sortOptions = [
  { id: "pinned", name: "Pinned First" },
  { id: "name", name: "Name" },
  { id: "newest", name: "Newest" },
  { id: "category", name: "Category" },
];

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("pinned");
  const [pinnedTools, setPinnedTools] = useState<string[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Load pinned tools from localStorage
  useEffect(() => {
    const loadPinned = () => {
      const pinned = readToolList("pinnedTools");
      setPinnedTools(pinned);
    };
    loadPinned();
    window.addEventListener("pinnedToolsChanged", loadPinned);
    return () => window.removeEventListener("pinnedToolsChanged", loadPinned);
  }, []);

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

    // Filter by file type
    if (selectedFileType !== "all") {
      tools = tools.filter((tool) => tool.fileTypes?.includes(selectedFileType as "pdf" | "image" | "document"));
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

    // Show pinned tools first (always, regardless of sort option)
    if (sortBy === "pinned") {
      tools.sort((a, b) => {
        const aIsPinned = pinnedTools.includes(a.slug);
        const bIsPinned = pinnedTools.includes(b.slug);
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        return 0;
      });
    }

    return tools;
  }, [selectedCategory, selectedFileType, searchQuery, sortBy, pinnedTools]);

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-2">
      <RecentTools />
      <Link href="/business-tools" className="inline-block mb-5 text-sm underline">Explore tools for your business →</Link>
      {/* Header - Swiss style with animation */}
      <div className="mb-6 sm:mb-8 md:mb-12 animate-fade-slide-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-2 sm:mb-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.03em]">Tools</h1>
          <span className="text-xs sm:text-sm text-[var(--muted-foreground)] tabular-nums bg-[var(--muted)] px-2 py-0.5 sm:py-1 rounded-lg">{toolsConfig.length} total</span>
        </div>
        <p className="text-sm sm:text-base text-[var(--muted-foreground)]" style={{ lineHeight: '1.6' }}>
          Browse our complete collection of free online tools
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-slide-up animate-delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        {/* Search - Improved */}
        <div className="relative flex-1 max-w-2xl">
          <input
            id="tools-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 180+ tools..."
            className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pl-12 sm:pl-14 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] focus:border-violet-500 focus:bg-violet-500/5 focus:shadow-lg focus:shadow-violet-500/10 text-base transition-all duration-300 placeholder:text-[var(--muted-foreground)]"
          />
          <SearchIcon
            className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]"
          />
          <span className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 kbd text-xs hidden sm:flex px-2 py-1">/</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-12 sm:right-16 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-violet-400 transition-colors p-1.5 hover:bg-violet-500/10 rounded-lg"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full sm:w-auto px-4 sm:px-5 py-3.5 sm:py-4 pr-10 sm:pr-12 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] focus:border-violet-500 text-base transition-all duration-300 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                Sort: {option.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none"
          />
        </div>
      </div>

      {/* File Type Filter Pills */}
      <div className="mb-4 sm:mb-5 overflow-x-auto -mx-1 px-1 animate-fade-slide-up animate-delay-150" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex gap-2 min-w-max pb-2">
          {fileTypes.map((ft) => {
            const count = ft.id === "all" 
              ? toolsConfig.length 
              : toolsConfig.filter(t => t.fileTypes?.includes(ft.id as "pdf" | "image" | "document")).length;
            return (
              <button
                key={ft.id}
                onClick={() => setSelectedFileType(ft.id)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 active:scale-95 ${selectedFileType === ft.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-[var(--muted-foreground)] hover:bg-orange-500/10 hover:text-orange-400 border border-[var(--border)]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ft.icon} />
                </svg>
                <span>{ft.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedFileType === ft.id ? "bg-white/20" : "bg-[var(--muted)]"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills - Enhanced */}
      <div className="mb-4 sm:mb-6 md:mb-8 overflow-x-auto -mx-1 px-1 animate-fade-slide-up animate-delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex gap-1.5 sm:gap-2 min-w-max pb-2">
          {categories.map((category) => {
            const count = category.id === "all" 
              ? toolsConfig.length 
              : toolsConfig.filter(t => t.category === category.id).length;
            const CategoryIcon = getCategoryIcon(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 active:scale-95 ${selectedCategory === category.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-[var(--muted-foreground)] hover:bg-violet-500/10 hover:text-violet-400 border border-[var(--border)]"
                }`}
              >
                <CategoryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{category.name}</span>
                <span className="xs:hidden">{category.name.substring(0, 3)}</span>
                <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md ${selectedCategory === category.id ? "bg-white/20" : "bg-[var(--muted)]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""}
          {searchQuery && <span className="ml-1">for &quot;{searchQuery}&quot;</span>}
        </span>
      </div>

      {/* Tools Grid - Optimized density */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredTools.map((tool, index) => (
            <div 
              key={tool.slug}
              className="animate-fade-slide-up"
              style={{ 
                opacity: 0, 
                animationFillMode: 'forwards',
                animationDelay: `${Math.min(index * 20, 200)}ms`
              }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-20 border border-[var(--border)] rounded-xl sm:rounded-2xl bg-[var(--card)]">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 font-mono">∅</div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No tools found</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-4 sm:mb-6 px-4">
            Try adjusting your search or filter
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedFileType("all");
            }}
            className="px-4 py-2 text-sm rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors active:scale-95"
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
