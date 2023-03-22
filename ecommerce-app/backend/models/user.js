// import and initialize mongoose
const mongoose = require('mongoose');

const crypto = require('crypto')

const uuidv1 = require('uuid')

// initialize mongoose schema
const Schema = mongoose.Schema;

// create user schema
const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }

}, { timestamps: true});

// virtual field
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1.v1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

userSchema.methods = {
    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        } catch (err) {
            return console.log(err)
        }
    }
}

// export schema
module.exports = mongoose.model('User', userSchema)
