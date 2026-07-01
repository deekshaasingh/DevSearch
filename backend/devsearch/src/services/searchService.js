const { processText } = require("../utils/textCleaner");
const { getIndex, buildIndex } = require("./indexService");
const { fetchAndStoreRepos } = require("./repoService");
const Repo = require("../models/Repo");
const { log } = require("../utils/logger");

let cachedRepos = null;

// Crawls currently in flight, keyed by normalized query — prevents two
// concurrent requests for the same term from triggering duplicate
// GitHub crawls.
const pendingCrawls = new Map();

// Queries that were just crawled and still came up empty (e.g. typos,
// gibberish). Avoids re-hitting the GitHub API on every repeat request.
// Cleared after NEGATIVE_CACHE_TTL_MS.
const recentlyEmptyQueries = new Map();
const NEGATIVE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function getRepos() {
  if (!cachedRepos) {
    console.log("⚡ Caching repos...");
    cachedRepos = await Repo.find();
  }
  return cachedRepos;
}

function invalidateRepoCache() {
  cachedRepos = null;
}

function isRecentlyEmpty(normalizedQuery) {
  const crawledAt = recentlyEmptyQueries.get(normalizedQuery);
  if (!crawledAt) return false;

  if (Date.now() - crawledAt > NEGATIVE_CACHE_TTL_MS) {
    recentlyEmptyQueries.delete(normalizedQuery);
    return false;
  }
  return true;
}

// Crawls GitHub for `query`, stores whatever it finds, and rebuilds the
// in-memory index/trie so the new data is immediately searchable.
// Concurrent calls for the same query share one crawl instead of firing
// GitHub requests multiple times in parallel.
async function crawlAndReindex(normalizedQuery) {
  if (pendingCrawls.has(normalizedQuery)) {
    return pendingCrawls.get(normalizedQuery);
  }

  const crawlPromise = (async () => {
    try {
      log(`No DB results for "${normalizedQuery}" — crawling GitHub live`);

      const storedCount = await fetchAndStoreRepos(normalizedQuery, {
        perPage: 30,
        concurrency: 8,
      });

      if (storedCount > 0) {
        invalidateRepoCache();
        await buildIndex();
      }

      return storedCount;
    } catch (err) {
      console.error("⚠️ Live crawl failed:", err.message);
      return 0; // degrade gracefully — search just returns what it has
    } finally {
      pendingCrawls.delete(normalizedQuery);
    }
  })();

  pendingCrawls.set(normalizedQuery, crawlPromise);
  return crawlPromise;
}

// Scores + ranks repos already in the DB/index for `words`. Pulled out so
// `search()` can run it once before a crawl and again after, without
// duplicating the TF-IDF logic.
async function scoreAgainstIndex(words) {
  const index = await getIndex();

  if (!index) {
    console.log("⚠️ Index not ready");
    return [];
  }

  const repos = await getRepos();
  const totalDocs = repos.length;

  const scores = {};
  const repoMap = {};
  repos.forEach(repo => {
    repoMap[repo.repoId] = repo;
  });

  for (const word of words) {
    const entries = index[word];

    if (!entries || !Array.isArray(entries)) continue;

    const docsWithWord = entries.length;
    const idf = Math.log((totalDocs + 1) / (docsWithWord + 1));

    for (const entry of entries) {
      const repo = repoMap[entry.repoId];
      if (!repo) continue;

      const tf = entry.freq / (repo.tokens.length || 1);
      const score = tf * idf;

      if (!scores[entry.repoId]) {
        scores[entry.repoId] = 0;
      }

      scores[entry.repoId] += score + Math.log(repo.stars + 1);
    }
  }

  const sortedRepoIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => Number(entry[0]));

  if (sortedRepoIds.length === 0) return [];

  return sortedRepoIds.map(id => repoMap[id]).filter(Boolean);
}

async function search(query) {
  log(`Search query: ${query}`);

  const words = [...new Set(processText(query))];

  if (words.length === 0) return [];

  let results = await scoreAgainstIndex(words);

  if (results.length === 0) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!isRecentlyEmpty(normalizedQuery)) {
      await crawlAndReindex(normalizedQuery);
      results = await scoreAgainstIndex(words);

      if (results.length === 0) {
        recentlyEmptyQueries.set(normalizedQuery, Date.now());
      }
    }
  }

  return results;
}

module.exports = { search };