'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import RepoCard from '@/components/RepoCard';
import Pagination from '@/components/Pagination';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/StateBlocks';
import { useSearch } from '@/hooks/useSearch';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const rangeRef = useRef<HTMLInputElement>(null);

  const {
    doSearch,
    isLoading,
    hasError,
    currentQuery,
    filteredResults,
    pageItems,
    currentPage,
    setCurrentPage,
    totalPages,
    langs,
    updateLang,
    minStars,
    updateMinStars,
    sortBy,
    updateSortBy,
    resetFilters,
    apiBase,
  } = useSearch();

  // Kick off search when URL query changes
  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Sync range slider background
  useEffect(() => {
    if (rangeRef.current) {
      const pct = (minStars / 100000) * 100;
      rangeRef.current.style.background = `linear-gradient(90deg, var(--p500) ${pct}%, var(--surface-4) ${pct}%)`;
    }
  }, [minStars]);

  const refineSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }, [router]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-layout">
      {/* Sidebar */}
      <aside className="filter-sidebar">
        <div className="sidebar-sticky">
          {/* Refine search */}
          <div className="filter-group">
            <div className="filter-group-title">Refine Search</div>
            <div className="inline-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="inline-input"
                placeholder="New query…"
                defaultValue={currentQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') refineSearch((e.target as HTMLInputElement).value);
                }}
              />
              <button
                className="inline-btn"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  refineSearch(input.value);
                }}
              >
                Go
              </button>
            </div>
          </div>

          {/* Language filter */}
          <div className="filter-group">
            <div className="filter-group-title">Language</div>
            <div className="lang-filter-list">
              {langs.map((l) => (
                <label key={l.key} className="lang-option">
                  <input
                    type="checkbox"
                    checked={l.checked}
                    onChange={(e) => updateLang(l.key, e.target.checked)}
                  />
                  <span className="lang-dot" style={{ background: l.color }} />
                  {l.label}
                </label>
              ))}
            </div>
          </div>

          {/* Stars filter */}
          <div className="filter-group">
            <div className="filter-group-title">Minimum Stars</div>
            <div className="star-filter-wrap">
              <input
                ref={rangeRef}
                type="range"
                min={0}
                max={100000}
                value={minStars}
                step={500}
                onChange={(e) => updateMinStars(Number(e.target.value))}
              />
              <div className="star-display">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{minStars.toLocaleString()}</span>+
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <div className="filter-group-title">Sort By</div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => updateSortBy(e.target.value as 'relevance' | 'stars' | 'name')}
            >
              <option value="relevance">Relevance</option>
              <option value="stars">Stars (high → low)</option>
              <option value="name">Name A → Z</option>
            </select>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset filters
          </button>
        </div>
      </aside>

      {/* Results */}
      <main className="results-main">
        <div className="results-topbar">
          {!isLoading && !hasError && filteredResults.length > 0 && (
            <div className="results-meta">
              <strong>{filteredResults.length.toLocaleString()}</strong>{' '}
              result{filteredResults.length !== 1 ? 's' : ''} for{' '}
              <strong>&ldquo;{currentQuery}&rdquo;</strong>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingBlock message={`Searching for "${currentQuery}"…`} />
        ) : hasError ? (
          <ErrorState body={`Could not reach backend at <code style="font-family:var(--font-mono);color:var(--p300)">${apiBase}</code>`} />
        ) : filteredResults.length === 0 && currentQuery ? (
          <EmptyState title="No results found" body="Try different keywords or adjust your filters." />
        ) : (
          <>
            <div>
              {pageItems.map((r, i) => (
                <RepoCard key={r.name ?? i} repo={r} delay={i * 50} />
              ))}
            </div>
            <Pagination current={currentPage} total={totalPages} onPage={handlePageChange} />
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading-block"><div className="spin-ring" /><span>Loading…</span></div>}>
      <SearchContent />
    </Suspense>
  );
}
