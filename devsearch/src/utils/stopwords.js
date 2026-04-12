const stopwords = new Set([
  "a","an","the","is","are","was","were",
  "in","on","at","to","for","of","and","or",
  "with","this","that","it","as","by","from",
  "https","http","www","com","img","svg",
  "badge","npm","package","build","test",
  "github","org","shields","actions","workflow"
]);

module.exports = { stopwords };