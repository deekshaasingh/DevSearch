const { octokit } = require("../config/github");

async function fetchRepos(searchQuery) {
  const response = await octokit.search.repos({
    q: searchQuery,
    sort: "stars",
    order: "desc",
    per_page: 50,
  });

  return response.data.items;
}

async function fetchReadme(owner, repo) {
  try {
    const res = await octokit.repos.getReadme({
      owner,
      repo,
    });

    const content = Buffer.from(res.data.content, "base64").toString("utf-8");

    return content;
  } catch (err) {
    return ""; // if README not found
  }
}

module.exports = { fetchRepos, fetchReadme };