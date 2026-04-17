const Repo = require("../models/Repo");

async function getRepos(req, res, next) {
  try {
    const repos = await Repo.find().limit(50);

    res.json(repos);
  } catch (err) {
    next(err);
  }
}

async function getRepoStats(req, res) {
  try {
    const total = await Repo.countDocuments();

    res.json({
      totalRepos: total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}

module.exports = { getRepos, getRepoStats };