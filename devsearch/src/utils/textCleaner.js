const { tokenize } = require("./tokenizer");
const { stopwords } = require("./stopwords");

function processText(text) {
  if (!text) return [];

  return tokenize(text.toLowerCase())
    .filter(word => word.length > 2)          // remove short words
    .filter(word => !stopwords.has(word));    // remove stopwords
}

module.exports = { processText };