const { tokenize } = require("./tokenizer");

function processText(text) {
  if (!text) return [];
  return tokenize(text);
}

module.exports = { processText };