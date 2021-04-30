const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const hbs = require('hbs');
const passport = require('./passport');
const flash = require('connect-flash');

// Middleware configuration
module.exports = (app) => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');
  hbs.registerPartials(__dirname + '/../views/partials');
  hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(
    favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')),
  );
  passport(app);
  app.use(flash());
};
