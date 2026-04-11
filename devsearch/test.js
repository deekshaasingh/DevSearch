require('dotenv').config();
const mongoose = require("mongoose");
const Repo = require("./src/models/Repo");
const { fetchRepos } = require("./src/services/crawlerService");
const { processText } = require("./src/utils/textCleaner");

async function test() {
  await mongoose.connect(process.env.MONGO_URI);

  const repos = await fetchRepos("mern OR react OR nodejs");

  const cleaned = repos
    .map(repo => {
      const text = (repo.description || "") + " " + repo.name;

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
        tokens: processText(text),
      };
    })
    .filter(repo =>
      repo.description &&
      !repo.description.toLowerCase().includes("deprecated")
    );

  await Repo.insertMany(cleaned, { ordered: false });

  console.log("✅ Data saved to DB");
  console.log("\nSample:\n", cleaned[0]);

  await mongoose.disconnect();
}

test();