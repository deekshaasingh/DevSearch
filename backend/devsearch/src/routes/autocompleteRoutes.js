const express = require("express");
const router = express.Router();

const { getSuggestions } = require("../services/autocompleteService");

router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.json({ suggestions: [] });
  }

  const suggestions = await getSuggestions(q);

  res.json({ suggestions });
});

module.exports = router;