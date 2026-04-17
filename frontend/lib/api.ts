export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export interface Repo {
  name?: string;
  owner?: string;
  fullName?: string;
  description?: string;
  stars?: number;
  language?: string;
  url?: string;
  topics?: string[];
}

export interface SearchResponse {
  results: Repo[];
  total?: number;
}

export const LANG_COLORS: Record<string, string> = {
  JavaScript: '#F0BF4C',
  Python: '#5DCAA5',
  TypeScript: '#4B8BBE',
  Go: '#8B77E8',
  Rust: '#CE6849',
  Ruby: '#CC342D',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
};

export const KNOWN_LANGS = ['javascript', 'python', 'typescript', 'go', 'rust', 'ruby'];

export async function searchRepos(query: string) {
  const res = await fetch(`${API_BASE}/search?q=${query}&limit=100`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchAutocomplete(q: string) {
  if (!q) return [];

  const url = `${API_BASE}/autocomplete?q=${encodeURIComponent(q)}`;
  console.log("CALL:", url);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Autocomplete failed");
  }

  const data = await res.json();
  return data.suggestions || [];
}

export async function fetchRepoStats() {
  const res = await fetch(`${API_BASE}/repos/stats`);
  const data = await res.json();
  return data.totalRepos;
}