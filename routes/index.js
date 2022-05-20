const express = require('express');
const router = express.Router();
const product = require("../controller/product");

router.post('/create-product',product.create);
router.get('/all-products',product.findAll);
router.get('/one-products/:id',product.findOne);

//most viewed top 10 product
router.get('/most-viewed',product.mostViewed);

//delete functionalities 
router.delete('/delete-product/:id',product.deleteProduct);

module.exports = router;