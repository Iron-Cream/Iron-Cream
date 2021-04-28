const router = require('express').Router();
const Store = require('../models/Store');
const { loginCheck } = require('./middlewares');

router.get('/mapdata', (req, res) => {
  Store.find()
    .then((stores) => {
      res.send({ stores });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/view/:id', loginCheck(), (req, res) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      res.render('stores/show', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/view/:id', (req, res) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      res.render('stores/show', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/add', (req, res, next) => {
  let store = req.body;
  res.render('stores/add', { store });
});

router.post('/add', (req, res, next) => {
  const { name, placeId, coords } = req.body;
  const lat = coords.slice(1, coords.indexOf(','));
  const lng = coords.slice(coords.indexOf(' ') + 1, coords.indexOf(')'));

  Store.create({
    name,
    location: { type: 'Point', coordinates: { lat, lng } },
    placeId,
  })
    .then((store) => {
      res.redirect('/add', { store });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
