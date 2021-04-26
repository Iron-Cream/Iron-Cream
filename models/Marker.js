const { Schema, model } = require('mongoose');

const markerSchema = new Schema({
  name: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
  },
});

markerSchema.index({ location: '2dsphere' });
var Marker = mongoose.model('Marker', markerSchema);
