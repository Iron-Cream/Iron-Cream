const loginCheck = () => {
  return (req, res, next) => {
    console.log('is authenticated?', req.isAuthenticated());
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render('auth/login', {
        message: 'User must me logged in to see the profile page',
      });
    }
  };
};

module.exports = {
  loginCheck,
};
