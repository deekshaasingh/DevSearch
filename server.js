require('dotenv').config();
const cors = require("cors");

const app = require("./backend/devsearch/src/app");
const { connectDB } = require("./backend/devsearch/src/config/db");
const { buildIndex } = require("./backend/devsearch/src/services/indexService");

app.use(cors());

async function startServer() {
  try {
    // ✅ wait for DB connection
    await connectDB();
    console.log("MongoDB connected");

    // ✅ build search index AFTER DB is ready
    console.log("⚡ Building search index...");
    await buildIndex();

    app.listen(5000, "0.0.0.0", () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.error("❌ Server start error:", err.message);
    process.exit(1);
  }
}

startServer();