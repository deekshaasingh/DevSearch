const { processText } = require("../utils/textCleaner");
const { getIndex } = require("./indexService");
const Repo = require("../models/Repo");
const { log } = require("../utils/logger");

// 🔥 cache repos too (important)
let cachedRepos = null;

async function getRepos() {
  if (!cachedRepos) {
    console.log("⚡ Caching repos...");
    cachedRepos = await Repo.find();
  }
  return cachedRepos;
}

async function search(query) {
  log(`Search query: ${query}`);

  // 🔥 preprocess query (remove duplicate words)
  const words = [...new Set(processText(query))];

  if (words.length === 0) return [];

  // 🔥 get cached data
  const index = await getIndex();
  const repos = await getRepos();

  const totalDocs = repos.length;

  const scores = {};

  // 🔥 fast lookup map
  const repoMap = {};
  repos.forEach(repo => {
    repoMap[repo.repoId] = repo;
  });

  // 🔥 scoring loop
  for (const word of words) {
    const entries = index[word];

    if (!entries || !Array.isArray(entries)) continue;

    const docsWithWord = entries.length;

    // 🔥 smooth IDF (avoids division issues)
    const idf = Math.log((totalDocs + 1) / (docsWithWord + 1));

    for (const entry of entries) {
      const repo = repoMap[entry.repoId];
      if (!repo) continue;

      const tf = entry.freq / (repo.tokens.length || 1);
      const score = tf * idf;

      if (!scores[entry.repoId]) {
        scores[entry.repoId] = 0;
      }

      // 🔥 TF-IDF + popularity boost
      scores[entry.repoId] += score + Math.log(repo.stars + 1);
    }
  }

  // 🔥 sort repos by score
  const sortedRepoIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => Number(entry[0]));

  if (sortedRepoIds.length === 0) return [];

  // 🔥 map results back
  const orderedResults = sortedRepoIds
    .map(id => repoMap[id])
    .filter(Boolean);

  return orderedResults;
}

module.exports = { search };