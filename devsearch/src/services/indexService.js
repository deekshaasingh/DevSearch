const Repo = require("../models/Repo");

async function buildIndex() {
  const repos = await Repo.find();

  const index = {};

  for (const repo of repos) {
    for (const word of repo.tokens) {

      // 🔥 FORCE ARRAY ALWAYS
      if (!index[word] || !Array.isArray(index[word])) {
        index[word] = [];
      }

      const existing = index[word].find(
        entry => entry.repoId === repo.repoId
      );

      if (existing) {
        existing.freq += 1;
      } else {
        index[word].push({
          repoId: repo.repoId,
          freq: 1,
        });
      }
    }
  }

  return index;
}

module.exports = { buildIndex };