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

      // 🔥 combine all text for tokenization
      const text =
        (repo.description || "") +
        " " +
        repo.name +
        " " +
        (readme || "");

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
          tokens: processText(text), // includes README tokens
        });
      }
    } catch (err) {
      console.log("⚠️ Error processing repo:", repo.name);
    }
  }

  // 🔥 store repos
  await Repo.insertMany(cleaned, { ordered: false });

  return cleaned.length;
}

module.exports = { fetchAndStoreRepos };