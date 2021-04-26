const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
    },
    address: {
        type: String,
        minLength: 10,
    },
    location: {
        lat: Number,
        lng: Number,
    },
    // rating: {
    //     type: Number,
    //     max: 5,
    //     min: 0,
    // default: 0,
    // },
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            text: {
                type: String,
                minLength: 10,
                maxLength: 300,
            }
        }
    ],
    ratings: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            rating: {
                type: Number,
                max: 5,
                min: 0,
                default: 0,
            }
        }
    ]
}, { timestamps: true });

const Store = model("Store", storeSchema);

module.exports = Store;
