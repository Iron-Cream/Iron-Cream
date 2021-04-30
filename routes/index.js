require('dotenv/config');
const router = require('express').Router();
const { loginCheck } = require('./middlewares');
const { uploader, cloudinary } = require('../config/cloudinary');
const { getPhotoUrl } = require('../config/placesApi');
const User = require('../models/User');
const Store = require('../models/Store');

router.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
    err_msg: req.flash('err_msg'),
    apiKey: process.env.MAPS_API_KEY,
  });
});

router.get('/profile', loginCheck(), (req, res, next) => {
  Store.find({
    _id: { $in: req.user.favourites },
  })
    .then((stores) => {
      stores.forEach((store) => {
        store.picUrl = getPhotoUrl(store.pictureId, 400);
      });
      res.render('profile', { user: req.user, stores });
    })
    .catch((err) => next(err));
});

router.get('/favourites/add/:id', async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { favourites: req.params.id } },
    );

    res.redirect(`/view/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/favourites/delete/:id', async (req, res, next) => {
  try {
    const newFavourites = req.user.favourites.filter((fav) => {
      console.log(fav);
      return fav !== req.params.id;
    });

    console.log(req.user.favourites);
    console.log(newFavourites);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { favourites: req.params.id } },
    );

    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
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
