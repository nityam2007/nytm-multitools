"use client";

import { useState } from "react";
import { ArchiveRecord } from "@/lib/archive";
import { fetchRecords, deleteRecordAction } from "../actions";

interface ActivityLogProps {
  initialRecords: ArchiveRecord[];
  initialTotal: number;
  toolStats: { tool: string; count: number }[];
  categoryStats: { category: string; count: number }[];
}

const categoryIcons: Record<string, string> = {
  text: "📝",
  image: "🖼️",
  dev: "💻",
  converter: "🔄",
  generator: "🎲",
  security: "🔐",
  misc: "🔧",
};

export default function ActivityLog({
  initialRecords,
  initialTotal,
  toolStats,
  categoryStats,
}: ActivityLogProps) {
  const [records, setRecords] = useState(initialRecords);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(null);
  
  // Filters
  const [toolFilter, setToolFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const limit = 50;
  const totalPages = Math.ceil(total / limit);

  const loadRecords = async (newPage: number = 1) => {
    setLoading(true);
    try {
      const result = await fetchRecords({
        page: newPage,
        limit,
        tool: toolFilter || undefined,
        category: categoryFilter || undefined,
        search: searchQuery || undefined,
      });
      setRecords(result.records);
      setTotal(result.total);
      setPage(newPage);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await deleteRecordAction(id);
      loadRecords(page);
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete all ${total} filtered records? This cannot be undone!`)) return;
    // Note: Would need a server action for bulk delete
    alert("Bulk delete not implemented yet");
  };

  const clearFilters = () => {
    setToolFilter("");
    setCategoryFilter("");
    setSearchQuery("");
    setDateFilter("");
    loadRecords(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-text)]">Activity Log</h2>
          <p className="text-[var(--admin-muted)]">
            Complete history of all tool operations ({total.toLocaleString()} records)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadRecords(page)}
            className="px-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:bg-[var(--admin-hover)] transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-[var(--admin-muted)] block mb-1">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in data..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="w-44">
            <label className="text-xs text-[var(--admin-muted)] block mb-1">Tool</label>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All Tools</option>
              {toolStats.map((stat) => (
                <option key={stat.tool} value={stat.tool}>{stat.tool} ({stat.count})</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="text-xs text-[var(--admin-muted)] block mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All Categories</option>
              {categoryStats.map((stat) => (
                <option key={stat.category} value={stat.category}>{stat.category} ({stat.count})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => loadRecords(1)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-[var(--admin-hover)] text-[var(--admin-text)] text-sm hover:bg-[var(--admin-border)] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-[var(--admin-text)] font-medium">No records found</p>
            <p className="text-sm text-[var(--admin-muted)]">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--admin-bg)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">Tool</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider hidden lg:table-cell">Input</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--admin-border)]">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-[var(--admin-hover)] transition-colors">
                      <td className="px-4 py-3 text-sm text-[var(--admin-muted)]">
                        #{record.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryIcons[record.tool_category] || "🛠️"}</span>
                          <span className="text-sm font-medium text-[var(--admin-text)]">{record.tool_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--admin-hover)] text-[var(--admin-muted)] capitalize">
                          {record.tool_category}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-[var(--admin-muted)] truncate block max-w-[200px]">
                          {record.raw_input?.substring(0, 50) || record.file_path || "-"}
                          {(record.raw_input?.length || 0) > 50 && "..."}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--admin-muted)]">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="p-1.5 rounded-lg hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-primary)] transition-colors"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => record.id && handleDelete(record.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--admin-muted)] hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-[var(--admin-border)] flex items-center justify-between">
              <p className="text-sm text-[var(--admin-muted)]">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadRecords(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-[var(--admin-hover)] text-[var(--admin-text)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--admin-border)] transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-sm text-[var(--admin-muted)]">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => loadRecords(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[var(--admin-hover)] text-[var(--admin-text)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--admin-border)] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--admin-border)] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--admin-text)]">Record #{selectedRecord.id}</h2>
                <p className="text-sm text-[var(--admin-muted)]">{selectedRecord.tool_name}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Tool</label>
                  <p className="text-[var(--admin-text)]">{selectedRecord.tool_name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Category</label>
                  <p className="text-[var(--admin-text)] capitalize">{selectedRecord.tool_category}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Input Type</label>
                  <p className="text-[var(--admin-text)]">{selectedRecord.input_type}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Timestamp</label>
                  <p className="text-[var(--admin-text)]">{new Date(selectedRecord.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {selectedRecord.raw_input && (
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Input</label>
                  <pre className="mt-1 p-3 rounded-xl bg-[var(--admin-bg)] text-sm text-[var(--admin-text)] overflow-auto max-h-[200px] whitespace-pre-wrap">
                    {selectedRecord.raw_input}
                  </pre>
                </div>
              )}

              {selectedRecord.output_result && (
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">Output</label>
                  <pre className="mt-1 p-3 rounded-xl bg-[var(--admin-bg)] text-sm text-[var(--admin-text)] overflow-auto max-h-[200px] whitespace-pre-wrap">
                    {selectedRecord.output_result}
                  </pre>
                </div>
              )}

              {selectedRecord.file_path && (
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">File Path</label>
                  <p className="text-[var(--admin-text)] font-mono text-sm">{selectedRecord.file_path}</p>
                </div>
              )}

              {selectedRecord.user_agent && (
                <div>
                  <label className="text-xs font-medium text-[var(--admin-muted)]">User Agent</label>
                  <p className="text-[var(--admin-text)] text-sm break-all">{selectedRecord.user_agent}</p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    if (selectedRecord.id) {
                      handleDelete(selectedRecord.id);
                      setSelectedRecord(null);
                    }
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
                >
                  🗑️ Delete Record
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2 rounded-xl bg-[var(--admin-hover)] text-[var(--admin-text)] hover:bg-[var(--admin-border)] transition-colors"
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
