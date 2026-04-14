require('dotenv').config();
const app = require("./backend/devsearch/src/app");
const { connectDB } = require("./backend/devsearch/src/config/db");

connectDB();

const { buildIndex } = require("./backend/devsearch/src/services/indexService");

app.listen(5000, "0.0.0.0", async () => {
  console.log("Server running on port 5000");
  await buildIndex();   // 🔥 THIS LINE
});