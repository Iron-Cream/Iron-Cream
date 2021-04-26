const { Schema, model } = require('mongoose');

const markerSchema = new Schema({
  name: String,
  location: { type: { type: String }, coordinates: [Number] },
});

markerSchema.index({ location: '2dsphere' });
const Marker = model('Marker', markerSchema);
module.exports = Marker;
