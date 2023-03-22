const User = require('../models/user');

exports.userById = (req, res, next) => {
    const user_id = req.params.user_id;
    User.findById(user_id)
        .then(user => {
            if (!user) {
                const error = new Error('User does not exist.');
                error.statusCode = 404;
                throw error;
            }
            req.profile = user;
            user.salt = undefined
            user.hashed_password = undefined
            res.status(200).json({message: 'Success', data: user})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 404;
            }
            next(err)
        });
};

exports.updateUser = (req, res) => {
    user_id = req.params.user_id
    User
        .findOneAndUpdate(
            {_id: user_id},
            {$set: req.body},
            {new: true},
            (err, user) => {
                if(err) {
                    if (!user) {
                        return res.status(404).json({message: "User does not exist."})
                    }
                }
                // user.hashed_password = undefined;
                // user.salt = undefined;
                return res.json({message: "Success", data: user})
            })
}