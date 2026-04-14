const Repo = require("../models/Repo");

async function getRepos(req, res, next) {
  try {
    const repos = await Repo.find().limit(50);

    res.json(repos);
  } catch (err) {
    next(err);
  }
}

module.exports = { getRepos };