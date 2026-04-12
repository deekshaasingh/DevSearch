const { getSuggestions } = require("../services/autocompleteService");

async function autocompleteController(req, res, next) {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ error: "Query required" });
    }

    const suggestions = await getSuggestions(q);

    res.json({ suggestions });

  } catch (err) {
    next(err);
  }
}

module.exports = { autocompleteController };