const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { validateSignUp, notLoggedInCheck } = require('./middlewares');

router.get('/signup', notLoggedInCheck(), (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', validateSignUp(), async (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  await User.create({ username, password: hash });

  // here send mail etc

  res.render(
    'auth/login',
    { msg: 'You Signed Up Successfully!' } /*, { fromSignUp: true }*/,
  );
});

router.get('/login', notLoggedInCheck(), (req, res) => {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true,
  }),
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
