const mongoose = require('mongoose');
require('dotenv').config();
const Repo = require('../models/Repo');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Repo.countDocuments();
  console.log("TOTAL REPOS:", count);
  process.exit();
})();