const { Schema, model } = require('mongoose');

const storeSchema = new Schema({
  name: String,
  description: String,
  picture: String,
  address: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
  },
  address: String,
  id: String,
});

storeSchema.index({ location: '2dsphere' });
const Store = model('Store', storeSchema);
module.exports = Store;
