const { Schema, model } = require('mongoose');

const storeSchema = new Schema({
  name: String,
  description: String,
  picture: String,
  location: { type: { type: String }, coordinates: [Number] },
});

storeSchema.index({ location: '2dsphere' });
const Store = model('Store', storeSchema);
module.exports = Store;
