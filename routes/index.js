const router = require('express').Router();
const { loginCheck } = require('./middlewares');
const User = require('../models/User');
const { uploader, cloudinary } = require('../config/cloudinary');
const Store = require('../models/Store');

/* GET home page */
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/mapdata', (req, res) => {
  Store.find().then((stores) => {
    res.send({ stores });
  });
});

router.get('/profile', loginCheck(), (req, res) => {
  res.render('profile', { user: req.user });
});

router.post(
  '/new-pic/:id',
  loginCheck(),
  uploader.single('pic'),
  async (req, res, next) => {
    try {
      if (typeof req.file === 'undefined') {
        res.render('profile', {
          user: req.user,
          err_msg: "You haven't selected any image",
        });
        return;
      }

      let { filename: cloudinaryId, path, originalname } = req.file;

      path = cloudinary.url(cloudinaryId, {
        gravity: 'face',
        height: 200,
        width: 200,
        crop: 'thumb',
      });

      const oldUser = await User.findByIdAndUpdate(req.params.id, {
        avatar: { cloudinaryId, path, originalname },
      });

      if (oldUser.avatar !== null) {
        cloudinary.uploader.destroy(oldUser.avatar.cloudinaryId);
      }

      res.redirect('/profile');
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
