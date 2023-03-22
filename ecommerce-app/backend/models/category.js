// import and initialize mongoose
const mongoose = require('mongoose');

// initialize mongoose schema
const Schema = mongoose.Schema;

// create user schema
const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max_length: 32,
        unique: true
    },
    description: {
        type: String,
        default: ""
    }

}, { timestamps: true});

// export schema
module.exports = mongoose.model('Category', categorySchema)