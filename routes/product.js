const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const {createProduct, upload, userProduct, getAllProducts, getSingleProduct} = require('../controllers/product');

const router = express.Router();

router.post('/add', verifyToken, upload.single('image'), createProduct);
router.get('/my-products', verifyToken, userProduct)

router.get('/all', getAllProducts);
router.get('/:id', getSingleProduct);

module.exports = router;