function tokenize(text) {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2);
}

module.exports = { tokenize };