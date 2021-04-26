const express = require('express');
require('dotenv/config');
require('./db');

// APP
const app = express();
require('./config')(app);

// TITLE
app.locals.title = `Iron-Cream`;

// ROUTES
const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// ERROR HANDLiNG
require('./error-handling')(app);

module.exports = app;
