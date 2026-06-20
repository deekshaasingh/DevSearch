const express = require("express");
const cors = require("cors");
require("dotenv").config();

const searchRoutes = require("./routes/searchRoutes");
const repoRoutes = require("./routes/repoRoutes");
const autocompleteRoutes = require("./routes/autocompleteRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/search", searchRoutes);
app.use("/repos", repoRoutes);
app.use("/autocomplete", autocompleteRoutes);

app.use(errorHandler);

module.exports = app; // Vercel uses this export