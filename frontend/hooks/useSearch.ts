'use client';

import { useState, useCallback } from 'react';
import { Repo, KNOWN_LANGS, searchRepos, API_BASE } from '@/lib/api';

export type SortOption = 'relevance' | 'stars' | 'name';

export interface LangFilter {
  label: string;
  key: string;
  color: string;
  checked: boolean;
}

const DEFAULT_LANGS: LangFilter[] = [
  { label: 'JavaScript', key: 'javascript', color: '#F0BF4C', checked: true },
  { label: 'Python',     key: 'python',     color: '#5DCAA5', checked: true },
  { label: 'TypeScript', key: 'typescript', color: '#4B8BBE', checked: true },
  { label: 'Go',         key: 'go',         color: '#8B77E8', checked: true },
  { label: 'Rust',       key: 'rust',       color: '#CE6849', checked: true },
  { label: 'Ruby',       key: 'ruby',       color: '#CC342D', checked: true },
  { label: 'Other',      key: 'other',      color: '#666',    checked: true },
];

export function useSearch() {
  const [allResults, setAllResults] = useState<Repo[]>([]);
  const [filteredResults, setFilteredResults] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const [langs, setLangs] = useState<LangFilter[]>(DEFAULT_LANGS);
  const [minStars, setMinStars] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const RESULTS_PER_PAGE = 8;

  const applyFiltersAndSort = useCallback(
    (results: Repo[], langFilters: LangFilter[], stars: number, sort: SortOption) => {
      const enabledKeys = langFilters.filter((l) => l.checked).map((l) => l.key);

      let filtered = results.filter((r) => {
        if ((r.stars || 0) < stars) return false;
        const lang = (r.language || '').toLowerCase();
        if (lang && KNOWN_LANGS.includes(lang)) return enabledKeys.includes(lang);
        return enabledKeys.includes('other');
      });

      if (sort === 'stars') filtered = [...filtered].sort((a, b) => (b.stars || 0) - (a.stars || 0));
      else if (sort === 'name') filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setFilteredResults(filtered);
      setCurrentPage(1);
    },
    []
  );

  const doSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setIsLoading(true);
      setHasError(false);
      setCurrentQuery(query);
      setAllResults([]);
      setFilteredResults([]);
      setCurrentPage(1);

      try {
        const results = await searchRepos(query);
        setAllResults(results);
        applyFiltersAndSort(results, langs, minStars, sortBy);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [langs, minStars, sortBy, applyFiltersAndSort]
  );

  const updateLang = useCallback(
    (key: string, checked: boolean) => {
      const next = langs.map((l) => (l.key === key ? { ...l, checked } : l));
      setLangs(next);
      applyFiltersAndSort(allResults, next, minStars, sortBy);
    },
    [langs, allResults, minStars, sortBy, applyFiltersAndSort]
  );

  const updateMinStars = useCallback(
    (val: number) => {
      setMinStars(val);
      applyFiltersAndSort(allResults, langs, val, sortBy);
    },
    [allResults, langs, sortBy, applyFiltersAndSort]
  );

  const updateSortBy = useCallback(
    (val: SortOption) => {
      setSortBy(val);
      applyFiltersAndSort(allResults, langs, minStars, val);
    },
    [allResults, langs, minStars, applyFiltersAndSort]
  );

  const resetFilters = useCallback(() => {
    const reset = DEFAULT_LANGS.map((l) => ({ ...l, checked: true }));
    setLangs(reset);
    setMinStars(0);
    setSortBy('relevance');
    applyFiltersAndSort(allResults, reset, 0, 'relevance');
  }, [allResults, applyFiltersAndSort]);

  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const pageItems = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return {
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
    apiBase: API_BASE,
  };
}
