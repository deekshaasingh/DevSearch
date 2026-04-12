const express = require("express");

const searchRoutes = require("./routes/searchRoutes");
const repoRoutes = require("./routes/repoRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const autocompleteRoutes = require("../src/routes/autocompleteRoutes");

const app = express();

app.use(express.json());

// 🔥 routes
app.use("/search", searchRoutes);
app.use("/repos", repoRoutes);
app.use("/autocomplete", autocompleteRoutes);

// 🔥 error handler (MUST BE LAST)
app.use(errorHandler);

module.exports = app;