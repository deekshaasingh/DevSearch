const { processText } = require("../utils/textCleaner");
const { buildIndex } = require("./indexService");
const Repo = require("../models/Repo");

async function search(query) {
  const words = processText(query);

  const index = await buildIndex();
  const repos = await Repo.find();

  const totalDocs = repos.length;

  const scores = {}; // repoId → score

  // 🔥 FAST lookup map
  const repoMap = {};
  repos.forEach(repo => {
    repoMap[repo.repoId] = repo;
  });

  for (const word of words) {
    const entries = index[word];
    if (!entries) continue;

    const docsWithWord = entries.length;

    // 🔥 prevent divide-by-zero
    const idf = Math.log((totalDocs + 1) / (docsWithWord + 1));

    for (const entry of entries) {
      const repo = repoMap[entry.repoId];
      if (!repo) continue;

      const tf = entry.freq / (repo.tokens.length || 1);
      const score = tf * idf;

      if (!scores[entry.repoId]) {
        scores[entry.repoId] = 0;
      }

      scores[entry.repoId] += score;
    }
  }

  // 🔥 SORT
  const sortedRepoIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => Number(entry[0]));

  // 🔥 FETCH DATA
  const resultRepos = await Repo.find({
    repoId: { $in: sortedRepoIds },
  });

  // 🔥 maintain order
  const resultMap = {};
  resultRepos.forEach(repo => {
    resultMap[repo.repoId] = repo;
  });

  const orderedResults = sortedRepoIds.map(id => resultMap[id]);

  return orderedResults;
}

module.exports = { search };