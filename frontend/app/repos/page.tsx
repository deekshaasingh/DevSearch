'use client';

import { useEffect, useState, useCallback } from 'react';
import RepoCard from '@/components/RepoCard';
import Pagination from '@/components/Pagination';
import { ErrorState, LoadingBlock } from '@/components/StateBlocks';
import { searchRepos, API_BASE } from '@/lib/api';
import type { Repo } from '@/types/repo';

type SortOption = 'stars' | 'name';
const BROWSE_PER_PAGE = 12;

export default function ReposPage() {
  const [allRepos, setAllRepos] = useState<Repo[]>([]);
  const [sorted, setSorted] = useState<Repo[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams(window.location.search);
const query = params.get("q") || "react";

const repos = await searchRepos(query);
        setAllRepos(repos);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const applySortAndPage = useCallback(
    (repos: Repo[], sort: SortOption) => {
      const arr = [...repos];
      if (sort === 'stars') arr.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      else arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setSorted(arr);
      setPage(1);
    },
    []
  );

  useEffect(() => {
    if (allRepos.length) applySortAndPage(allRepos, sortBy);
  }, [allRepos, sortBy, applySortAndPage]);

  const totalPages = Math.ceil(sorted.length / BROWSE_PER_PAGE);
  const pageItems = sorted.slice((page - 1) * BROWSE_PER_PAGE, page * BROWSE_PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="browse-wrap">
      <div className="browse-topbar">
        <div>
          <h2 className="browse-title">All Repositories</h2>
          <p className="browse-subtitle">Browse everything indexed in DevSearch</p>
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="stars">Most Stars</option>
          <option value="name">Name A → Z</option>
        </select>
      </div>

      {loading ? (
        <div className="browse-grid">
          <div style={{ gridColumn: '1 / -1' }}>
            <LoadingBlock message="Loading repositories…" />
          </div>
        </div>
      ) : error ? (
        <div className="browse-grid">
          <div style={{ gridColumn: '1 / -1' }}>
            <ErrorState body={`Could not reach backend at ${API_BASE}`} />
          </div>
        </div>
      ) : (
        <>
          <div className="browse-grid">
            {pageItems.map((r, i) => (
              <RepoCard key={r.name ?? i} repo={r} delay={i * 40} />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onPage={handlePageChange} />
        </>
      )}
    </div>
  );
}
