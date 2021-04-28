const router = require('express').Router();
const Store = require('../models/Store');
const { loginCheck } = require('./middlewares');
const getDetails = require('../config/placesApi');

router.get('/mapdata', (req, res) => {
  Store.find()
    .then((stores) => {
      res.send({ stores });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/view/:id', loginCheck(), (req, res) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      res.render('stores/show', { store, user: req.user });
    })
    .catch((error) => {
      console.log(error);
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
      opening_hours: { weekday_text: opening_hours },
      price_level,
    } = place;
    // console.log(place.photos[0])

    await Store.create({
      placeId,
      name,
      address,
      location: { coordinates: location },
      opening_hours,
      price_level,
      created_by: req.user._id,
      comments: comments ? { user: req.user._id, comments: comments } : null,
    });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
