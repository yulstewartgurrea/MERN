const User = require('../models/user');
const { findByIdAndRemove } = require('../models/user');

const { dbErrorHandler } = require('../helpers/dbErrorHandler');

// generate signed token
const jwt = require('jsonwebtoken')
// authorization token
const expressjwt = require("express-jwt");


exports.register = (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user
        .save()
        .then(result => {
            result.salt = undefined
            result.hashed_password = undefined
            return res.status(201).json({
                message: "Success",
                success: true,
                post: result
            });
        })
        .catch(err => {
            console.log(err)
            return res.status(404).json({
                success: false,
                error: dbErrorHandler(err)
            });
        })
        
};

exports.signin = (req, res, next) => {
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if(err|| !user) {
            return res.status(400).json({
                message: 'User does not exists.'
            })
        }
        // If user is found make sure email and password matches
        // create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }

        // generate a signed token with user id and secret
        const token = jwt.sign(
            {_id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET
        )

        // presist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})

        // return response with user and token to fe client
        const {_id, email, role} = user

        // return res.json({token, user: {_id, email, role}})
        return res.json({token, user: {_id, email, role}})
    })

}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({message: 'Sign out successful.'})
}

// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(403).json({
                    message: "Unauthorized access.",
                    error: err
                });
            }

            console.log("role", user.role)
            req.auth = user;
            next();
        });
    } else {
        res.status(401).json({
            message: "Unauthorized access."
        });
    }
};

exports.isAuth = (req, res, next) => {
    // console.log('req profile', req.params.user_id)
    // console.log('req auth', req.auth)
    // console.log('req auth', req.auth._id)
    // console.log(res)
    let user = req.auth && req.params.user_id === req.auth._id
    if(!user) {
        res.status(403).json({
            message: "Unauthorized access."
        }); 
    }
    next();
};

exports.isAadmin = (req, res, next) => {
    if(req.auth.role === 0) {
        res.status(403).json({
            message: "Admin resource! Unauthorized access."
        }); 
    }
    next();
};