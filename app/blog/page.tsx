// Blog Listing Page | TypeScript
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { blogEntries } from '@/lib/blog-info';
import { SearchIcon, ChevronRightIcon } from '@/assets/icons';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'text', name: 'Text' },
  { id: 'image', name: 'Image' },
  { id: 'dev', name: 'Developer' },
  { id: 'converter', name: 'Converters' },
  { id: 'generator', name: 'Generators' },
  { id: 'security', name: 'Security' },
  { id: 'network', name: 'Network' },
  { id: 'misc', name: 'Misc' },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredEntries = useMemo(() => {
    let entries = [...blogEntries];

    if (selectedCategory !== 'all') {
      entries = entries.filter(e => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    return entries;
  }, [selectedCategory, searchQuery]);

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredEntries.slice(start, start + perPage);
  }, [filteredEntries, page]);

  const totalPages = Math.ceil(filteredEntries.length / perPage);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Free Online Tools</h1>
        <p className="text-[var(--muted-foreground)]">
          Browse our collection of {blogEntries.length.toLocaleString()} free online tools - no sign up required
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full px-4 py-3 pl-11 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 text-sm transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-6 overflow-x-auto -mx-4 px-4">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((category) => {
            const count = category.id === 'all'
              ? blogEntries.length
              : blogEntries.filter(e => e.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-violet-500/10'
                }`}
              >
                {category.name}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                  selectedCategory === category.id ? 'bg-white/20' : 'bg-[var(--background)]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-[var(--muted-foreground)]">
        Showing {paginatedEntries.length} of {filteredEntries.length.toLocaleString()} results
        {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {paginatedEntries.map((entry) => (
          <Link
            key={entry.blogSlug}
            href={`/blog/${entry.blogSlug}`}
            className="group p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-violet-500/50 hover:shadow-lg transition-all"
          >
            <h2 className="font-semibold text-[var(--foreground)] group-hover:text-violet-500 transition-colors line-clamp-2 mb-2">
              {entry.title}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
              {entry.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] capitalize">
                {entry.category}
              </span>
              <span className="text-xs text-violet-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                Use Tool
                <ChevronRightIcon className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-[var(--muted)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500/10 transition-colors"
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
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-violet-500 text-white'
                      : 'bg-[var(--muted)] hover:bg-violet-500/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-[var(--muted)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 p-6 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4">Free Online Tools - No Sign Up Required</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--muted-foreground)]">
          <p>
            Welcome to our comprehensive collection of free online tools. All tools work directly in your browser 
            with no registration, no email, and no downloads required. Your data stays private as everything 
            processes locally on your device.
          </p>
          <p className="mt-3">
            Whether you need text manipulation, image conversion, developer utilities, or security tools - 
            we have you covered with over 150 free tools available instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
