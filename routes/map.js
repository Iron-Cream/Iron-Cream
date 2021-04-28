const router = require('express').Router();
const Store = require('../models/Store');
const { loginCheck } = require('./middlewares');

router.get('/mapdata', (req, res) => {
  Store.find().then((stores) => {
    res.send({ stores });
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

router.get('/add/:id', (req, res, next) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      res.render('stores/add', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/add/:id', (req, res, next) => {
  // Store.findOneAndUpdate
  // res.redirect('/');
});

module.exports = router;
