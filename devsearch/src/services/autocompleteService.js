const Repo = require("../models/Repo");
const { Trie } = require("../utils/trie");

let trie = null;

async function buildTrie() {
  const repos = await Repo.find();
  const newTrie = new Trie();

  repos.forEach(repo => {
    repo.tokens.forEach(word => {
      newTrie.insert(word);
    });
  });

  return newTrie;
}

async function getTrie() {
  if (!trie) {
    console.log("⚡ Building trie...");
    trie = await buildTrie();
  }
  return trie;
}

async function getSuggestions(prefix) {
  const t = await getTrie();
  return t.searchPrefix(prefix.toLowerCase());
}

module.exports = { getSuggestions };