const Repo = require("../models/Repo");
const Readme = require("../models/Readme");
const { fetchRepos, fetchReadme } = require("./crawlerService");
const { processText } = require("../utils/textCleaner");

async function fetchAndStoreRepos(query) {
  const repos = await fetchRepos(query);

  const cleaned = [];

  for (const repo of repos) {
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
        cleaned.push({
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
        });
      }
    } catch (err) {
      console.log("⚠️ Error processing repo:", repo.name);
    }
  }

  // 🔥 store repos
  for (const repo of cleaned) {
  await Repo.updateOne(
    { repoId: repo.repoId },
    repo,
    { upsert: true }
  );
}

  return cleaned.length;
}

module.exports = { fetchAndStoreRepos };