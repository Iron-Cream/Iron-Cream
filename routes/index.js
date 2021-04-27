const router = require('express').Router();
const { loginCheck } = require('./middlewares');
const User = require('../models/User');
const { uploader, cloudinary } = require('../config/cloudinary');

/* GET home page */
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
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
      const { filename: cloudinaryId, path, originalname } = req.file;

      const oldUser = await User.findByIdAndUpdate(req.params.id, {
        avatar: { cloudinaryId, path, originalname },
      });

      if (oldUser.avatar !== null) {
        cloudinary.uploader.destroy(oldUser.avatar.cloudinaryId);
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
