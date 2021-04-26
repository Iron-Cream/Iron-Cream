const app = require('express').Router();
const Store = require('../models/Store');

app.get('/map', (req, res) => {
  res.render('map');
});

app.post('/map', (req, res, next) => {
  const { description } = req.body;
  //   console.log(markers);
  console.log(req.body);
  Store.create({ description })
    .then(() => {
      res.redirect('map');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = app;
