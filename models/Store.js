const { Schema, model } = require('mongoose');

const storeSchema = new Schema(
  {
    placeId: String,
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
    },
    description: {
      type: String,
    },
    // picture: {
    //   picPath: String,
    // },
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
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    opening_hours: [String],
    price_level: Number,
    // flavours: [
    //     { flavour: String }
    // ],
  },
  { timestamps: true },
);

storeSchema.index({ location: '2dsphere' });
const Store = model('Store', storeSchema);

module.exports = Store;
