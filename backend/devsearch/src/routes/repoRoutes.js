const express = require("express");
const { getRepos } = require("../controllers/repoController");
const { getRepoStats } = require("../controllers/repoController");

const router = express.Router();

router.get("/", getRepos);
router.get("/stats", getRepoStats);

module.exports = router;