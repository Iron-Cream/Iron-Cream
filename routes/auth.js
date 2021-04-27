const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const { validateSignUp, notLoggedInCheck } = require('./middlewares');

router.get('/signup', notLoggedInCheck(), (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', validateSignUp(), async (req, res) => {
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  await User.create({ username, email, password: hash });

  // here send mail etc

  res.render('auth/login', {
    msg: 'You Signed Up Successfully!',
    justSignedUp:
      "Validate your account thorough the link we've send you to your email account (not yet implemented)",
  });
});

router.get('/login', notLoggedInCheck(), (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render('auth/login', info);
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.render('profile', { user });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
