require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('../models/Store');
// const { getDetails } = require('../config/placesApi');
let stores = require('./db');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

stores = stores.map((store) => {
  const {
    formatted_address: address,
    place_id,
    name,
    geometry: { location },
    price_level,
    rating: avg_rating,
  } = store;

  let pictureId;
  if (store.photos) {
    pictureId = store.photos[0].photo_reference;
  }

  return {
    address,
    placeId: place_id,
    name,
    price_level,
    location: { coordinates: location },
    avg_rating,
    pictureId,
  };
});

Store.insertMany(stores)
  .then((store) => {
    console.log(`Store created in DB => ${store.name}`);
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
