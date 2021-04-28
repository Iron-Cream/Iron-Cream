const { Schema, model } = require('mongoose');

const storeSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
    },
    picture: {
      picPath: String,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    placeId: String,
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          minLength: 10,
          maxLength: 300,
        },
      },
    ],
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          max: 5,
          min: 0,
          default: 0,
        },
      },
    ],
    // flavours: [
    //     { flavour: String }
    // ],
  },
  { timestamps: true },
);

storeSchema.index({ location: '2dsphere' });
const Store = model('Store', storeSchema);

module.exports = Store;
