const { buildTrie, setTrie } = require("./autocompleteService");
const Repo = require("../models/Repo");

let globalIndex = null;
let globalTrie = null;

async function buildIndex() {
  const repos = await Repo.find();

  const index = {};
  const allWords = [];

  for (const repo of repos) {
  // ✅ check INSIDE loop
  if (!Array.isArray(repo.tokens)) continue;

  repo.tokens.forEach(word => {
    if (!word || typeof word !== "string") return;

    word = word.toLowerCase();

    if (!Array.isArray(index[word])) {
      index[word] = [];
    }

    index[word].push({
      repoId: repo.repoId,
      freq: 1
    });
  });

  allWords.push(...repo.tokens);
}

  globalIndex = index;

  const uniqueWords = [...new Set(allWords)];

  console.log("⚡ Building trie...");
  globalTrie = buildTrie(uniqueWords);
  setTrie(globalTrie);
}

function getIndex() {
  return globalIndex;
}

module.exports = { buildIndex, getIndex };