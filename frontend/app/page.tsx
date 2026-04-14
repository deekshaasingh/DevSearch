'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RepoCard from '@/components/RepoCard';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/StateBlocks';
import { searchRepos, fetchAutocomplete, API_BASE} from '@/lib/api';
import type { Repo } from '@/types/repo';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAC, setShowAC] = useState(false);
  const [previewRepos, setPreviewRepos] = useState<Repo[] | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [repoCount, setRepoCount] = useState<string>('—');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Load home preview
  useEffect(() => {
    async function load() {
      try {
        const repos = await searchRepos("react");
        setRepoCount(repos.length + '+');
        setPreviewRepos(repos.slice(0, 6));
      } catch {
        setPreviewError(true);
      }
    }
    load();
  }, []);

  // Autocomplete
  const handleInput = useCallback((val: string) => {
  setQuery(val);

  if (debounceRef.current) clearTimeout(debounceRef.current);

  // ❌ STOP invalid calls
  if (!val || val.trim().length < 2) {
    setShowAC(false);
    return;
  }

  debounceRef.current = setTimeout(async () => {
    try {
      const results = await fetchAutocomplete(val);

      if (results.length > 0) {
        setSuggestions(results.slice(0, 7));
        setShowAC(true);
      } else {
        setShowAC(false);
      }
    } catch (err) {
      console.error("Autocomplete failed:", err);
      setShowAC(false);
    }
  }, 300);
}, []);

  // Close autocomplete on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowAC(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const doSearch = useCallback((q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setShowAC(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  const setAndSearch = (q: string) => {
    setQuery(q);
    doSearch(q);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <div className="eyebrow-line" />
          <span>TF-IDF Powered · NLP Enhanced · GitHub Indexed</span>
          <div className="eyebrow-line" />
        </div>

        <h1 className="hero-title">
          Discover the
          <br />
          <span className="title-accent">perfect repository</span>
        </h1>

        <p className="hero-subtitle">
          Semantic search across thousands of GitHub repositories.
          <br />
          Natural language queries. Intelligent ranking.
        </p>

        <div className="hero-search-wrap" ref={wrapRef}>
          <div className="hero-search">
            <div className="search-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Search by topic, language, or description…"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') doSearch();
                if (e.key === 'Escape') setShowAC(false);
              }}
            />
            <button className="search-btn" onClick={() => doSearch()}>
              <span>Search</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Autocomplete */}
          {showAC && suggestions.length > 0 && (
            <div className="autocomplete-panel">
              {suggestions.map((s) => (
                <div key={s} className="ac-item" onClick={() => setAndSearch(s)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-tags">
          <span className="qtag-label">Try:</span>
          {['machine learning python', 'react typescript hooks', 'rest api express node', 'kubernetes docker devops', 'rust systems low level'].map((tag) => (
            <button key={tag} className="qtag" onClick={() => setAndSearch(tag)}>
              {tag.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
      </section>

      {/* Stats ribbon */}
      <div className="stats-ribbon">
        <div className="stat-block">
          <div className="stat-num">{repoCount}</div>
          <div className="stat-label">Repositories</div>
        </div>
        <div className="stat-sep" />
        <div className="stat-block">
          <div className="stat-num">TF-IDF</div>
          <div className="stat-label">Ranking Engine</div>
        </div>
        <div className="stat-sep" />
        <div className="stat-block">
          <div className="stat-num">Trie</div>
          <div className="stat-label">Autocomplete</div>
        </div>
        <div className="stat-sep" />
        <div className="stat-block">
          <div className="stat-num">NLP</div>
          <div className="stat-label">Text Processing</div>
        </div>
      </div>

      {/* Recent repos preview */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">Recent Repositories</h2>
          <button className="see-all-btn" onClick={() => router.push('/repos')}>
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="home-repo-grid">
          {previewError ? (
            <ErrorState body={`Start the server at <code style="font-family:var(--font-mono);color:var(--p300)">${API_BASE}</code>`} />
          ) : previewRepos === null ? (
            <LoadingBlock message="Loading repositories…" />
          ) : previewRepos.length === 0 ? (
            <EmptyState title="No repositories found." body="Run the crawler to index some repos." />
          ) : (
            previewRepos.map((r, i) => (
              <RepoCard key={r.name ?? i} repo={r} delay={i * 60} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
