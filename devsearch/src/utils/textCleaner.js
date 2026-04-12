const { tokenize } = require("./tokenizer");
const { stopwords } = require("./stopwords");

// 🔥 add extra useless words (very important)
const uselessWords = new Set([
  "https","http","www","com","img","svg",
  "badge","npm","package","build","test",
  "github","org","shields","actions","workflow",
  "using","used","use","project","code"
]);

function processText(text) {
  if (!text) return [];

  return tokenize(text.toLowerCase())
    .filter(word => word.length > 2)
    .filter(word => /^[a-z]+$/.test(word))
    .filter(word => !stopwords.has(word))
    .filter(word => !uselessWords.has(word));
}

module.exports = { processText };