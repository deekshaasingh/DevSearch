const { search } = require("../services/searchService");

async function searchController(req, res, next) {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    // 🔥 pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await search(q);

    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    res.json({
      page,
      limit,
      total: results.length,
      results: paginatedResults,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { searchController };