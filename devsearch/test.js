require("dotenv").config();

const { connectDB } = require("./src/config/db");
const { buildIndex } = require("./src/services/indexService");

async function run() {
  try {
    // 🔥 CONNECT FIRST
    await connectDB();

    console.log("🚀 Building index...");

    const index = await buildIndex();

    console.log("React results:");
    console.log(index["react"]);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

run();