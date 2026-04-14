const { processText } = require("../utils/textCleaner");
const { getIndex } = require("./indexService");
const Repo = require("../models/Repo");
const { log } = require("../utils/logger");

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

  const words = [...new Set(processText(query))];

  if (words.length === 0) return [];

  const index = await getIndex();
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

  const orderedResults = sortedRepoIds
    .map(id => repoMap[id])
    .filter(Boolean);

  return orderedResults;
}

module.exports = { search };