const { check, validationResult } = require('express-validator');

exports.userRegistrationValidator = [
    check('email')
        .isLength({
            min: 4,
            max: 32
        })
        .withMessage('Email must be between 4 to 32 characters.')
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        .withMessage('Email must contain @'),
        
    check('password')
        .isLength({ min: 4 })
        .withMessage('Password must contain at least 6 characters.')
        .matches(/\d/)
        .withMessage('Password must contain a number.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({
                success: false,
                error: errors.errors[0].msg
        });
        next();
    }
];
