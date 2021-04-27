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
  id: String,
});

storeSchema.index({ location: '2dsphere' });

// const Store = model('Store', storeSchema);
// const storeSchema = new Schema(
//   {
//     name: {
//       type: String,
//       unique: true,
//       required: true,
//       minLength: 3,
//     },
//     address: {
//       type: String,
//       minLength: 10,
//     },
//     location: {
//       lat: Number,
//       lng: Number,
//     },
//     picture: {
//       picPath: String,
//     },
//     comments: [
//       {
//         user: {
//           type: Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         text: {
//           type: String,
//           minLength: 10,
//           maxLength: 300,
//         },
//       },
//     ],
//     ratings: [
//       {
//         user: {
//           type: Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         rating: {
//           type: Number,
//           max: 5,
//           min: 0,
//           default: 0,
//         },
//       },
//     ],

//     // rating: {
//     //     type: Number,
//     //     max: 5,
//     //     min: 0,
//     // default: 0,
//     // },

//     // flavours: [
//     //     { flavour: String }
//     // ],
//   },
//   { timestamps: true },
// );

const Store = model('Store', storeSchema);

module.exports = Store;
