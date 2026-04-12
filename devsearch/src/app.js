const express = require("express");

const searchRoutes = require("./routes/searchRoutes");
const repoRoutes = require("./routes/repoRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const autocompleteRoutes = require("../src/routes/autocompleteRoutes");

const app = express();

app.use(express.json());

app.use("/search", searchRoutes);
app.use("/repos", repoRoutes);
app.use("/autocomplete", autocompleteRoutes);

app.use(errorHandler);

module.exports = app;