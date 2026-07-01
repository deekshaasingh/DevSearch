const Repo = require("../models/Repo");
const Readme = require("../models/Readme");
const { fetchRepos, fetchReadme } = require("./crawlerService");
const { processText } = require("../utils/textCleaner");
const { mapLimit } = require("../utils/concurrency");

// perPage: how many repos to pull from GitHub for this query
// concurrency: how many README fetches run in parallel (keeps on-demand
// crawls fast enough to fit inside a serverless request/timeout)
async function fetchAndStoreRepos(query, { perPage = 50, concurrency = 8 } = {}) {
  const repos = await fetchRepos(query, perPage);

  const cleaned = (
    await mapLimit(repos, concurrency, async (repo) => {
      try {
        // 🔥 fetch README
        const readme = await fetchReadme(repo.owner.login, repo.name);

        // 🔥 save README in separate collection
        if (readme) {
          await Readme.updateOne(
            { repoId: repo.id },
            { content: readme },
            { upsert: true }
          );
        }

        // 🔥 combine all text
        const text =
          (repo.description || "") +
          " " +
          repo.name +
          " " +
          (readme || "");

        // 🔥 generate tokens ONCE
        const tokens = processText(text);

        // 🔥 filter bad repos
        if (
          repo.description &&
          !repo.description.toLowerCase().includes("deprecated")
        ) {
          return {
            repoId: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url,
            topics: repo.topics,
            owner: repo.owner.login,
            tokens: tokens, // ✅ use generated tokens
          };
        }

        return null;
      } catch (err) {
        console.log("⚠️ Error processing repo:", repo.name);
        return null;
      }
    })
  ).filter(Boolean);

  // 🔥 store repos
  await mapLimit(cleaned, concurrency, (repo) =>
    Repo.updateOne({ repoId: repo.repoId }, repo, { upsert: true })
  );

  return cleaned.length;
}

module.exports = { fetchAndStoreRepos };