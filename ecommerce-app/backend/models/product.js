// import and initialize mongoose
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema

// initialize mongoose schema
const Schema = mongoose.Schema;

// create user schema
const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max_length: 32
    },
    description: {
        type: String,
        max_length: 2000,
        default: ""
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        max_length: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        max_length: 32
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: Boolean
    }

}, { timestamps: true});

// export schema
module.exports = mongoose.model('Product', productSchema)