"use client";

import { useState } from "react";
import { ArchiveRecord } from "@/lib/archive";
import { EyeIcon, TrashIcon, CloseIcon } from "@/assets/icons";

interface AdminTableProps {
  records: ArchiveRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (record: ArchiveRecord) => void;
}

export function AdminTable({
  records,
  total,
  page,
  limit,
  onPageChange,
  onDelete,
  onViewDetails,
}: AdminTableProps) {
  const totalPages = Math.ceil(total / limit);

  const truncate = (str: string | null, maxLength: number = 50) => {
    if (!str) return "-";
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Tool</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Input Preview</th>
              <th className="px-4 py-3 text-left font-medium">Output Preview</th>
              <th className="px-4 py-3 text-left font-medium">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-[var(--muted)]/50">
                  <td className="px-4 py-3 font-mono">{record.id}</td>
                  <td className="px-4 py-3 font-medium">{record.tool_name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-[var(--muted)]">
                      {record.tool_category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs max-w-[150px]">
                    {truncate(record.raw_input)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs max-w-[150px]">
                    {truncate(record.output_result)}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">
                    {formatDate(record.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(record)}
                        className="p-1 rounded hover:bg-[var(--muted)] transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => record.id && onDelete(record.id)}
                        className="p-1 rounded hover:bg-[var(--destructive)]/20 text-[var(--destructive)] transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-[var(--muted-foreground)]">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg transition-colors ${
                      page === pageNum
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "hover:bg-[var(--muted)]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface RecordDetailModalProps {
  record: ArchiveRecord | null;
  onClose: () => void;
}

export function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Record Details #{record.id}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Tool Name</label>
              <p className="font-medium">{record.tool_name}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Category</label>
              <p className="font-medium">{record.tool_category}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Input Type</label>
              <p className="font-medium">{record.input_type}</p>
            </div>
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Input Size</label>
              <p className="font-medium">{record.input_size || 0} chars</p>
            </div>
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Processing Duration</label>
              <p className="font-medium">{record.processing_duration || 0}ms</p>
            </div>
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Timestamp</label>
              <p className="font-medium">{new Date(record.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--muted-foreground)]">IP Address</label>
            <p className="font-mono text-sm">{record.ip_address || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-[var(--muted-foreground)]">User Agent</label>
            <p className="font-mono text-xs break-all">{record.user_agent || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-[var(--muted-foreground)]">Raw Input</label>
            <pre className="mt-1 p-3 bg-[var(--muted)] rounded-lg text-sm font-mono overflow-auto max-h-40">
              {record.raw_input || "-"}
            </pre>
          </div>

          <div>
            <label className="text-sm text-[var(--muted-foreground)]">Output Result</label>
            <pre className="mt-1 p-3 bg-[var(--muted)] rounded-lg text-sm font-mono overflow-auto max-h-40">
              {record.output_result || "-"}
            </pre>
          </div>

          {record.metadata && (
            <div>
              <label className="text-sm text-[var(--muted-foreground)]">Metadata</label>
              <pre className="mt-1 p-3 bg-[var(--muted)] rounded-lg text-sm font-mono overflow-auto max-h-40">
                {JSON.stringify(JSON.parse(record.metadata), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
