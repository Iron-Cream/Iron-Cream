const router = require('express').Router();
const Store = require('../models/Store');
const User = require('../models/User');
const { loginCheck } = require('./middlewares');
const { getDetails, getPhotoUrl } = require('../config/placesApi');

router.get('/mapdata', (req, res) => {
  Store.find()
    .then((stores) => {
      res.send({ stores });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/view/:id', (req, res) => {
  Store.findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    })
    .then((store) => {
      store.picUrl = getPhotoUrl(store.pictureId, 400);
      res.render('stores/show', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/delete/:id', loginCheck(), (req, res) => {
  const id = req.params.id;
  const user = req.user._id;
  Store.findById(id).then((store) => {
    if (store.created_by.equals(user)) {
      Store.findOneAndRemove({ _id: id })
        .then(() => {
          console.log('removed!');
          res.redirect('/profile');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('no match!');
    }
  });
});

router.post('/add', async (req, res, next) => {
  try {
    const { placeId, comments } = req.body;
    const place = await getDetails(placeId);
    const {
      formatted_address: address,
      name,
      geometry: { location },
      opening_hours: { weekday_text: opening_hours } = null,
      price_level = null,
      rating: avg_rating = null,
    } = place;
    const pictureId = place.photos[0].photo_reference;

    const store = await Store.findOne({ placeId });

    if (store) {
      req.flash(
        'err_msg',
        'The stored you tried to add is already in the Database.',
      );
      res.redirect('/');
    } else {
      const newStore = await Store.create({
        // from map
        placeId,
        comments: comments ? { user: req.user._id, text: comments } : null,
        // from placesAPI
        name,
        address,
        pictureId,
        location: { coordinates: location },
        opening_hours,
        price_level,
        // from user
        created_by: req.user._id,
        avg_rating,
      });

      await User.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { favourites: newStore._id } },
      );

      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
