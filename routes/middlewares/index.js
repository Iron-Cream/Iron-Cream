const User = require('../../models/User');
const passwordRegExp = new RegExp(
  /^(?=.*[0-9])(?=.*[|<>!@%+'!#$^?:.(){}[\]+~\-_.])[a-zA-Z0-9|<>!@%+'!#$^?:.(){}[\]+~\-_.]{8,30}$/,
);

const loginCheck = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render('auth/login', {
        err_msg: 'User must me logged in to see this page.',
      });
    }
  };
};

const notLoggedInCheck = () => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/profile');
    }
  };
};

const validateSignUp = () => {
  return async (req, res, next) => {
    try {
      const { username, password, password2 } = req.body;
      const user = await User.findOne({ username: username });
      if (user !== null) {
        res.render('auth/signup', { msg: 'This username is already taken.' });
      } else if (password !== password2) {
        res.render('auth/signup', {
          err_msg: "The two provided passwords didn't match",
        });
      } else if (password.length < 8 || password.length > 30) {
        res.render('auth/signup', {
          err_msg:
            'Your password must have at least 8 characters and not more than 30',
        });
      } else if (passwordRegExp.test(password) === false) {
        console.log(password);
        res.render('auth/signup', {
          err_msg:
            "Your password must contain at least one number and one special character |<>!@%+'!#$^?:.(){}[]+~-_.)",
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  loginCheck,
  validateSignUp,
  notLoggedInCheck,
};
