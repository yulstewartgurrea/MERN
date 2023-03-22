// import express
const express = require('express');

//initialize express router
const router = express.Router();

const userAuthController = require('../controllers/user_auth');

const userController = require('../controllers/user');

router.get('/user/:user_id',
    userAuthController.authenticateJWT,
    userAuthController.isAuth,
    userController.userById
)

router.put('/user/:user_id',
    userAuthController.authenticateJWT,
    userAuthController.isAuth,
    userController.updateUser
)

//export module
module.exports = router;