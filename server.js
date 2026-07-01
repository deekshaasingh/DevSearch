require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = require("./backend/devsearch/src/app");
const { connectDB } = require("./backend/devsearch/src/config/db");
const { buildIndex } = require("./backend/devsearch/src/services/indexService");

const expressApp = app.use ? app : (app.app || app.default);
expressApp.use(cors());

let isConnected = false;
let isIndexBuilt = false;

expressApp.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    if (!isIndexBuilt) {
      await buildIndex();
      isIndexBuilt = true;
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Database initialization failed", details: err.message });
  }
});

// 👇 only listen when run directly (local dev), not when imported by Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = expressApp;