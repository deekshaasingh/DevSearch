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

module.exports = { fetchRepos };