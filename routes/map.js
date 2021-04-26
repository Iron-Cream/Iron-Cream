const app = require('express').Router();
const Store = require('../models/Store');

app.get('/map', (req, res) => {
  res.render('map');
});

app.post('/map', (req, res, next) => {
  console.log('this is the log:', req.body);
  const { name, lat, lng } = req.body;
  Store.create({
    name,
    location: { type: 'Point', coordinates: [lat, lng] },
  })
    .then(() => {
      res.redirect('map');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = app;
