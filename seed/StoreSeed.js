require('dotenv').config();
const mongoose = require('mongoose');
const Store = require("../models/Store");
const stores = require('./db');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

Store.insertMany(stores)
    .then(store => {
        console.log(`Store created in DB => ${store.name}`);
        mongoose.connection.close();
    }).catch(err => console.error(err));
