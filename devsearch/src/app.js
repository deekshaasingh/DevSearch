const express = require("express");
const { search } = require("../src/services/searchService");

const app = express();

app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    const results = await search(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;