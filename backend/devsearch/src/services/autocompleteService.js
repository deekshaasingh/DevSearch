let trie = null;

function setTrie(newTrie) {
  trie = newTrie;
}

function buildTrie(words) {
  const root = {};

  for (const word of words) {
    let node = root;

    for (const char of word) {
      if (!node[char]) node[char] = {};
      node = node[char];
    }

    node.isEnd = true;
  }

  return root;
}

function getSuggestionsFromTrie(prefix, trie) {
  let node = trie;

  for (const char of prefix) {
    if (!node[char]) return [];
    node = node[char];
  }

  const results = [];

  function dfs(curr, path) {
    if (results.length >= 10) return;

    if (curr.isEnd) {
      results.push(path);
    }

    for (const ch in curr) {
      if (ch !== "isEnd") {
        dfs(curr[ch], path + ch);
      }
    }
  }

  dfs(node, prefix);

  return results;
}

async function getSuggestions(prefix) {
  if (!trie) return [];

  return getSuggestionsFromTrie(prefix.toLowerCase(), trie);
}

module.exports = { buildTrie, getSuggestions, setTrie };