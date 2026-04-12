const natural = require("natural");
const TfIdf = natural.TfIdf;

function extractKeywords(text) {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);

  return tfidf.listTerms(0)
    .slice(0, 10)
    .map(item => item.term);
}

module.exports = extractKeywords;