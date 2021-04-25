require("dotenv/config");
require("./db");
const express = require("express");
const app = express();
require("./config")(app);

// TITLE
app.locals.title = `For now: iceCreamProject`;

// ROUTES
const index = require("./routes/index");
app.use("/", index);

// ERROR HANDLiNG
require("./error-handling")(app);

module.exports = app;
