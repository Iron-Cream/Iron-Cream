const router = require('express').Router();
const { loginCheck } = require('./middlewares');

/* GET home page */
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/profile', loginCheck(), (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
