const { search } = require("../services/searchService");

async function searchController(req, res, next) {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const results = await search(q);

    if (results.length === 0) {
      return res.status(200).json({
        message: "No results found",
        results: []
      });
    }

    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);

    res.json({
      page,
      limit,
      total: results.length,
      results: paginated.map(r => ({
        name: r.name,
        description: r.description,
        stars: r.stars,
        url: r.url
      }))
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { searchController };