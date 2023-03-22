// import express
const express = require('express');

//initialize express router
const router = express.Router();

// import user controllers
const userAuthController = require('../controllers/user_auth');

const { userRegistrationValidator } = require('../validator/user_registration_validator')

// initial api
router.post('/register', userRegistrationValidator, userAuthController.register);
router.post('/signin', userAuthController.signin);
router.get('/signout', userAuthController.signout);

//export module
module.exports = router;