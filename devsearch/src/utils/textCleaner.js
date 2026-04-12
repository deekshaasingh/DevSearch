const { tokenize } = require("./tokenizer");
const { stopwords } = require("./stopwords");

function processText(text) {
  if (!text) return [];

  return tokenize(text.toLowerCase())
    .filter(word => word.length > 2)
    .filter(word => /^[a-z]+$/.test(word))
    .filter(word => !stopwords.has(word));
}

module.exports = { processText }; 