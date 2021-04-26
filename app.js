require('dotenv/config');
require('./db');
const express = require('express');
const app = express();
require('./config')(app);
require('./models/Store');

// TITLE
app.locals.title = `For now: iceCreamProject`;

// ROUTES
const index = require('./routes/index');
app.use('/', index);

const map = require('./routes/map');
app.use('/', map);

// ERROR HANDLiNG
require('./error-handling')(app);

module.exports = app;
