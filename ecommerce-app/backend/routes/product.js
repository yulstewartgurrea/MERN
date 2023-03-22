// import express
const express = require('express');

//initialize express router
const router = express.Router();

const userAuthController = require('../controllers/user_auth');

const productController = require('../controllers/product');

router.post('/product', userAuthController.authenticateJWT, userAuthController.isAadmin, productController.createProduct)
router.get('/product/:pid', userAuthController.authenticateJWT, productController.getProduct)
router.get('/products', userAuthController.authenticateJWT, productController.getProducts)
router.put('/product/:pid', userAuthController.authenticateJWT, userAuthController.isAadmin, productController.updateProduct)
router.delete('/product/:pid', userAuthController.authenticateJWT, userAuthController.isAadmin, productController.deleteProduct)

router.get("/product/photo/:pid", productController.getProductPhoto);

router.get('/products/categories', userAuthController.authenticateJWT, productController.getProductbyCategory)
router.post('/products/search', userAuthController.authenticateJWT, productController.productSearch)

//export module
module.exports = router;
