const mongoose = require("mongoose");

const readmeSchema = new mongoose.Schema({
  repoId: { type: Number, unique: true },
  content: String,
});

module.exports = mongoose.model("Readme", readmeSchema);