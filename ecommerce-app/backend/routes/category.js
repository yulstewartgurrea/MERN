// import express
const express = require('express');

//initialize express router
const router = express.Router();

const userAuthController = require('../controllers/user_auth');

const categoryController = require('../controllers/category');

router.post('/category', userAuthController.authenticateJWT, userAuthController.isAadmin, categoryController.createCategory)
router.get('/category/:cid', userAuthController.authenticateJWT, categoryController.getCategory)
router.get('/categories', userAuthController.authenticateJWT, categoryController.getCategories)
router.put('/categories/:cid', userAuthController.authenticateJWT, userAuthController.isAadmin, categoryController.updateCategory)
router.delete('/categories/:cid', userAuthController.authenticateJWT, userAuthController.isAadmin, categoryController.deleteCategory)

//export module
module.exports = router;