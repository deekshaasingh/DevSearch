const Repo = require("../models/Repo");
const { Trie } = require("../utils/trie");

let trie = null;

async function buildTrie() {
  if (trie) return trie;

  trie = new Trie();

  const repos = await Repo.find();

  repos.forEach(repo => {
    repo.tokens.forEach(word => {
      trie.insert(word);
    });
  });

  return trie;
}

async function getSuggestions(prefix) {
  const t = await buildTrie();
  return t.searchPrefix(prefix.toLowerCase());
}

module.exports = { getSuggestions };