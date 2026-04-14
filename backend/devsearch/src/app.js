const express = require("express");
const cors = require("cors");

const searchRoutes = require("./routes/searchRoutes");
const repoRoutes = require("./routes/repoRoutes");
const autocompleteRoutes = require("./routes/autocompleteRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors()); // 🔥 MUST BE HERE
app.use(express.json());

app.use("/search", searchRoutes);
app.use("/repos", repoRoutes);
app.use("/autocomplete", autocompleteRoutes);

app.use(errorHandler);

module.exports = app;