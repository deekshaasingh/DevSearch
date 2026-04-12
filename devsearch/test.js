require('dotenv').config();

const { connectDB } = require("./src/config/db");
const { fetchAndStoreRepos } = require("./src/services/repoService");

async function run() {
  try {
    // 🔥 connect to MongoDB
    await connectDB();

    console.log("🚀 Starting data pipeline...");

    // 🔥 fetch + process + store repos
    const count = await fetchAndStoreRepos("mern OR react OR nodejs");

    console.log(`✅ Stored ${count} repos`);

    console.log("🎉 Pipeline completed successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error running pipeline:", err.message);
    process.exit(1);
  }
}

run();