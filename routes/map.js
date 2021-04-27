const router = require('express').Router();
const Store = require('../models/Store');

router.post('/view/:id', (req, res) => {
  const id = req.params.id;
  Store.findById(id)
    .then((store) => {
      console.log(store);
      res.render('stores/show', { store });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/map', (req, res) => {
  res.render('map');
});

router.post('/map', (req, res, next) => {
  console.log('this is the log:', req.body);
  const { name, placeId, location } = req.body;
  let lat = location.slice(1, location.indexOf(','));
  let lng = location.slice(location.indexOf(' ') + 1, location.indexOf(')'));

  Store.create({
    name,
    location: { type: 'Point', coordinates: { lat, lng } },
    placeId,
  })
    .then(() => {
      res.redirect('map');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
