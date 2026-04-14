require("dotenv").config();

const { connectDB } = require("./src/config/db");
const { search } = require("./src/services/searchService");

async function run() {
  await connectDB();

  console.log("🔍 Searching...");

  const results = await search("react");

  console.log("Top results:");
  results.slice(0, 5).forEach(repo => {
    console.log(repo.name, "⭐", repo.stars);
  });

  process.exit();
}

run();