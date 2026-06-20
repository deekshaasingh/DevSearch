require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");

// Import your app
const app = require("./backend/devsearch/src/app");
const { connectDB } = require("./backend/devsearch/src/config/db");
const { buildIndex } = require("./backend/devsearch/src/services/indexService");

// 1. Ensure 'app' is actually the express instance
// If app is exported as an object with properties, we grab the right one
const expressApp = app.use ? app : (app.app || app.default);

// Apply middleware safely
expressApp.use(cors());

// 2. Handle Asynchronous DB Connection for Serverless Runtimes
let isConnected = false;
let isIndexBuilt = false;

expressApp.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("MongoDB connected cleanly via serverless hook.");
    }
    
    if (!isIndexBuilt) {
      console.log("⚡ Building search index...");
      await buildIndex();
      isIndexBuilt = true;
    }
    next();
  } catch (err) {
    console.error("❌ Serverless initialization error:", err.message);
    res.status(500).json({ error: "Database initialization failed", details: err.message });
  }
});

// 3. Export the app instance for Vercel Serverless Functions
module.exports = expressApp;