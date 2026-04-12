const { processText } = require("../utils/textCleaner");
const { buildIndex } = require("./indexService");
const Repo = require("../models/Repo");

async function search(query) {
  const words = processText(query);

  const index = await buildIndex();
  const repos = await Repo.find();

  const totalDocs = repos.length;

  const scores = {}; // repoId → score

  for (const word of words) {
    const entries = index[word];
    if (!entries) continue;

    const docsWithWord = entries.length;

    // 🔥 IDF
    const idf = Math.log(totalDocs / docsWithWord);

    for (const entry of entries) {
      const repo = repos.find(r => r.repoId === entry.repoId);
      if (!repo) continue;

      // 🔥 TF
      const tf = entry.freq / repo.tokens.length;

      // 🔥 TF-IDF score
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

  // 🔥 MAINTAIN ORDER
  const repoMap = {};
  resultRepos.forEach(repo => {
    repoMap[repo.repoId] = repo;
  });

  

  const orderedResults = sortedRepoIds.map(id => repoMap[id]);

  return orderedResults;
}

module.exports = { search };