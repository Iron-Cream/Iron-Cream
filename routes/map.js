const app = require('express').Router();
const Store = require('../models/Store');

app.get('/map', (req, res) => {
  res.render('map');
});

app.post('/map', (req, res, next) => {
  Store.create({ description })
    .then(() => {
      res.redirect('map');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = app;
