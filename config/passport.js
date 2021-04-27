const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      saveUninitialized: false,
      resave: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (user === null || !bcrypt.compareSync(password, user.password)) {
            console.log({ username, password });
            console.log(user);
            done(null, false, { err_msg: 'Wrong Credentials' });
          } else {
            console.log(user);
            done(null, user);
          }
        })
        .catch((err) => done(err));
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
