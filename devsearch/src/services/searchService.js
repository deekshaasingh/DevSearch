const { processText } = require("../utils/textCleaner");
const { buildIndex } = require("./indexService");
const Repo = require("../models/Repo");

async function search(query) {
  // 🔹 1. convert query → tokens
  const words = processText(query);

  // 🔹 2. build index
  const index = await buildIndex();

  const scores = {}; // repoId → score

  // 🔹 3. lookup each word
  for (const word of words) {
    const entries = index[word];

    if (!entries) continue;

    for (const entry of entries) {
      if (!scores[entry.repoId]) {
        scores[entry.repoId] = 0;
      }

      // 🔥 rank by frequency
      scores[entry.repoId] += entry.freq;
    }
  }

  // 🔹 4. sort repos by score
  const sortedRepoIds = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]) // descending
    .map(entry => Number(entry[0]));

  // 🔹 5. fetch repo details from DB
  const repos = await Repo.find({
    repoId: { $in: sortedRepoIds },
  });

  // 🔹 6. maintain ranking order
  const repoMap = {};
  repos.forEach(repo => {
    repoMap[repo.repoId] = repo;
  });

  const orderedResults = sortedRepoIds.map(id => repoMap[id]);

  return orderedResults;
}

module.exports = { search };