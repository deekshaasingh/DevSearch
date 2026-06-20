const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Added if you need to connect to DB
require("dotenv").config(); // Ensures environment variables load

const searchRoutes = require("./routes/searchRoutes");
const repoRoutes = require("./routes/repoRoutes");
const autocompleteRoutes = require("./routes/autocompleteRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB (Make sure MONGODB_URI is set in Vercel Dashboard)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log("MongoDB Connected"))
      .catch(err => console.error("MongoDB connection error:", err));
}

app.use(cors()); 
app.use(express.json());

app.use("/search", searchRoutes);
app.use("/repos", repoRoutes);
app.use("/autocomplete", autocompleteRoutes);

app.use(errorHandler);

module.exports = app; // Vercel uses this export