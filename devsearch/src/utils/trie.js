class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;

    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    node.isEnd = true;
  }

  searchPrefix(prefix) {
    let node = this.root;

    for (let char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const results = [];

    function dfs(curr, path) {
      if (curr.isEnd) results.push(path);

      for (let ch in curr.children) {
        dfs(curr.children[ch], path + ch);
      }
    }

    dfs(node, prefix);

    return results.slice(0, 10); // limit suggestions
  }
}

module.exports = { Trie };