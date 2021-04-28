const router = require('express').Router();
const Store = require('../models/Store');
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
  const id = req.params.id;
  Store.findById(id)
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    })
    .then((store) => {
      // store.picUrl = getPhotoUrl(store.pictureId, 400);
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
    } = place;

    let opening_hours, price_level;
    if (place.opening_hours) {
      opening_hours = place.opening_hours.weekday_text;
    }
    if (place.price_level) {
      price_level = place.price_level;
    }

    // const pictureId = place.photos[0].photo_reference;

    await Store.create({
      placeId,
      name,
      address,
      // pictureId,
      location: { coordinates: location },
      opening_hours,
      price_level,
      created_by: req.user._id,
      comments: comments ? { user: req.user._id, text: comments } : null,
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;