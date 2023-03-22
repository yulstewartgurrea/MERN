const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create schema
const userProfileSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    }
}, { timestamps: true});

// export schema
module.exports = mongoose.model('user', userSchema)