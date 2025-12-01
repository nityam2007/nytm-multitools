"use client";

import { useState, useMemo } from "react";
import { toolsConfig, getToolsByCategory, ToolConfig } from "@/lib/tools-config";

type CategoryType = "text" | "image" | "dev" | "converter" | "generator" | "security" | "misc";

const categories = [
  { id: "all", name: "All Tools", icon: "🛠️" },
  { id: "text", name: "Text", icon: "📝" },
  { id: "image", name: "Image", icon: "🖼️" },
  { id: "dev", name: "Developer", icon: "💻" },
  { id: "converter", name: "Converter", icon: "🔄" },
  { id: "generator", name: "Generator", icon: "🎲" },
  { id: "security", name: "Security", icon: "🔐" },
  { id: "misc", name: "Misc", icon: "🔧" },
];

export default function ToolsManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);

  const filteredTools = useMemo(() => {
    let result: ToolConfig[] = selectedCategory === "all" 
      ? toolsConfig 
      : getToolsByCategory(selectedCategory as CategoryType);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tool: ToolConfig) => 
        tool.name.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords?.some((k: string) => k.toLowerCase().includes(query))
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    toolsConfig.forEach((tool: ToolConfig) => {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1;
    });
    return byCategory;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-text)]">Tools Management</h2>
          <p className="text-[var(--admin-muted)]">
            Browse and manage all {toolsConfig.length} tools in your collection
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" 
                ? "bg-violet-500/20 text-[var(--admin-primary)]" 
                : "bg-[var(--admin-card)] text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" 
                ? "bg-violet-500/20 text-[var(--admin-primary)]" 
                : "bg-[var(--admin-card)] text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              p-3 rounded-xl border transition-all
              ${selectedCategory === cat.id
                ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30"
                : "bg-[var(--admin-card)] border-[var(--admin-border)] hover:bg-[var(--admin-hover)]"
              }
            `}
          >
            <span className="text-2xl block mb-1">{cat.icon}</span>
            <span className="text-xs text-[var(--admin-muted)] block">{cat.name}</span>
            <span className="text-lg font-bold text-[var(--admin-text)]">
              {cat.id === "all" ? toolsConfig.length : stats[cat.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools by name, slug, or keywords..."
          className="w-full px-4 py-3 pl-12 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-text)] placeholder-[var(--admin-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--admin-muted)]">
        Showing {filteredTools.length} of {toolsConfig.length} tools
        {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Tools Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              onClick={() => setSelectedTool(tool)}
              className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4 cursor-pointer hover:bg-[var(--admin-hover)] hover:border-violet-500/30 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--admin-text)] truncate group-hover:text-[var(--admin-primary)] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[var(--admin-muted)]">/{tool.slug}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--admin-muted)] line-clamp-2 mb-3">
                {tool.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--admin-hover)] text-[var(--admin-muted)] capitalize">
                  {tool.category}
                </span>
                <span className="text-xs text-[var(--admin-muted)]">
                  {tool.inputType}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--admin-bg)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--admin-muted)]">Tool</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--admin-muted)] hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--admin-muted)] hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--admin-muted)] hidden lg:table-cell">Type</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--admin-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {filteredTools.map((tool) => (
                <tr key={tool.slug} className="hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{tool.icon}</span>
                      <div>
                        <p className="font-medium text-[var(--admin-text)]">{tool.name}</p>
                        <p className="text-xs text-[var(--admin-muted)] sm:hidden">/{tool.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--admin-muted)] hidden sm:table-cell">
                    /{tool.slug}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--admin-hover)] text-[var(--admin-muted)] capitalize">
                      {tool.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--admin-muted)] hidden lg:table-cell">
                    {tool.inputType}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-violet-500/10 text-[var(--admin-primary)] hover:bg-violet-500/20 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-[var(--admin-text)] font-medium">No tools found</p>
          <p className="text-sm text-[var(--admin-muted)]">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTool(null)}>
          <div 
            className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] w-full max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--admin-border)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedTool.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--admin-text)]">{selectedTool.name}</h2>
                    <p className="text-sm text-[var(--admin-muted)]">/{selectedTool.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--admin-muted)]">Description</label>
                <p className="text-[var(--admin-text)] mt-1">{selectedTool.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--admin-muted)]">Category</label>
                  <p className="text-[var(--admin-text)] capitalize mt-1">{selectedTool.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--admin-muted)]">Input Type</label>
                  <p className="text-[var(--admin-text)] mt-1">{selectedTool.inputType}</p>
                </div>
              </div>
              {selectedTool.keywords && selectedTool.keywords.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[var(--admin-muted)]">Keywords</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTool.keywords.map((keyword) => (
                      <span key={keyword} className="px-2 py-1 text-xs rounded-full bg-[var(--admin-hover)] text-[var(--admin-muted)]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-4 flex gap-3">
                <a
                  href={`/tools/${selectedTool.slug}`}
                  target="_blank"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-center font-medium hover:opacity-90 transition-opacity"
                >
                  Open Tool →
                </a>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 rounded-xl bg-[var(--admin-hover)] text-[var(--admin-text)] hover:bg-[var(--admin-border)] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
