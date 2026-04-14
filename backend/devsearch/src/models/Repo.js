const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema({
  repoId: { type: Number, unique: true },
  name: String,
  fullName: String,
  description: String,
  stars: Number,
  language: String,
  url: String,
  topics: [String],
  owner: String,
  tokens: [String],
});

module.exports = mongoose.model("Repo", repoSchema);