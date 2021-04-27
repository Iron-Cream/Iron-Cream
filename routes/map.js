const router = require('express').Router();
const Store = require('../models/Store');
const { loginCheck } = require('./middlewares');

router.get('/view/:id', loginCheck(), (req, res) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      console.log(store);
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
      console.log(store);
      res.render('stores/show', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/mapdata', (req, res) => {
  Store.find().then((stores) => {
    res.send({ stores });
  });
});

router.get('/add', loginCheck(), (req, res) => {
  res.render('stores/add', { user: req.user });
});

router.post('/add', (req, res, next) => {
  const { name, placeId, location } = req.body;
  let lat = location.slice(1, location.indexOf(','));
  let lng = location.slice(location.indexOf(' ') + 1, location.indexOf(')'));

  Store.create({
    name,
    location: { type: 'Point', coordinates: { lat, lng } },
    placeId,
  })
    .then(() => {
      res.redirect('map');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
