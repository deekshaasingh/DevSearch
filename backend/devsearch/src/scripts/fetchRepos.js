const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const Repo = require('../models/Repo');
const { processText } = require('../utils/textCleaner');

const MONGO_URI = process.env.MONGO_URI;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const topics = ['react', 'nodejs', 'api'];

async function fetchRepos() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Mongo connected");

  await Repo.deleteMany({});
  console.log("🧹 DB cleared");

  for (const topic of topics) {
    console.log(`\n🚀 Topic: ${topic}`);

    for (let page = 1; page <= 5; page++) {
      try {
        console.log(`📄 Page ${page}`);

        const res = await axios.get(
          `https://api.github.com/search/repositories?q=${topic}&sort=stars&page=${page}&per_page=30`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          }
        );

        const repos = res.data.items;

        for (const r of repos) {
          if (!r.description) continue;

          const tokens = processText(`${r.name} ${r.description}`);

          await Repo.updateOne(
            { repoId: r.id },
            {
              repoId: r.id,
              name: r.name,
              fullName: r.full_name,
              description: r.description,
              stars: r.stargazers_count,
              language: r.language,
              url: r.html_url,
              topics: r.topics || [],
              tokens,
            },
            { upsert: true }
          );
        }

        // 🔥 IMPORTANT: avoid rate limit
        await new Promise(res => setTimeout(res, 2000));

      } catch (err) {
        console.log("❌ ERROR:", err.response?.status, err.response?.data);
        break;
      }
    }
  }

  console.log("\n🔥 DONE");
  process.exit();
}

fetchRepos();