require('dotenv').config();

const { connectDB } = require("./src/config/db");
const { fetchAndStoreRepos } = require("./src/services/repoService");

async function run() {
  await connectDB();

  const count = await fetchAndStoreRepos("mern OR react OR nodejs");

  console.log(`✅ Stored ${count} repos`);

  process.exit();
}

run();