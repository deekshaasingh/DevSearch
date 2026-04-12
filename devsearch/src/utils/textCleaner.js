const { tokenize } = require("./tokenizer");
const { stopwords } = require("./stopwords");

const uselessWords = new Set([
  "https","http","www","com","img","svg",
  "badge","npm","package","build","test",
  "github","org","shields","actions","workflow",
  "using","used","use","project","code"
]);

// 🔥 max allowed frequency per word
const MAX_FREQ = 3;

function processText(text) {
  if (!text) return [];

  const rawTokens = tokenize(text.toLowerCase())
    .filter(word => word.length > 2)
    .filter(word => /^[a-z]+$/.test(word))
    .filter(word => !stopwords.has(word))
    .filter(word => !uselessWords.has(word));

  // 🔥 frequency control
  const freqMap = {};
  const finalTokens = [];

  for (const word of rawTokens) {
    if (!freqMap[word]) {
      freqMap[word] = 0;
    }

    if (freqMap[word] < MAX_FREQ) {
      finalTokens.push(word);
      freqMap[word]++;
    }
  }

  return finalTokens;
}

module.exports = { processText };