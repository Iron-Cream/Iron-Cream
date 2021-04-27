const router = require('express').Router();
const { loginCheck } = require('./middlewares');
const Store = require('../models/Store');
const axios = require('axios').default;

/* GET home page */
router.get('/', (req, res) => {
  res.render('index');

  // Store.find().then((stores) => {
  //   console.log(stores);
  //   res.render('index', { stores });
  // });
});

router.get('/mapdata', (req, res) => {
  Store.find().then((stores) => {
    res.send({ stores });
  });
});

router.get('/profile', loginCheck(), (req, res) => {
  res.render('profile', req.user);
});

module.exports = router;
