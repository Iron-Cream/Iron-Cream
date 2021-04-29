require('dotenv/config');
const router = require('express').Router();
const { loginCheck } = require('./middlewares');
const { uploader, cloudinary } = require('../config/cloudinary');
const { getDetails, getPhotoUrl } = require('../config/placesApi');
const User = require('../models/User');
const Store = require('../models/Store');

router.get('/', (req, res) => {
  res.render('index', { user: req.user, apiKey: process.env.MAPS_API_KEY });
});

router.get('/profile', loginCheck(), (req, res, next) => {
  Store.find({ created_by: req.user._id })
    .then((stores) => {
      stores.forEach((store) => {
        store.picUrl = getPhotoUrl(store.pictureId, 400);
      });
      res.render('profile', { user: req.user, stores });
    })
    .catch((err) => next(err));
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
