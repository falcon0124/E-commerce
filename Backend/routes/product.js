const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const { storage } = require('../utils/cloudinary');
const multer = require('multer');
const {createProduct, userProduct, getAllProducts, getSingleProduct, deleteProduct, searchProduct, getProductByCategory} = require('../controllers/product');

const upload = multer({ storage });
const router = express.Router();

router.post('/add', verifyToken, upload.single('image'), createProduct);
router.get('/my-products', verifyToken, userProduct)
router.get('/search', searchProduct)
router.get('/category/:category', getProductByCategory);

router.get('/all', getAllProducts);
router.get('/:id', getSingleProduct);
router.delete('/:id', verifyToken, deleteProduct)

module.exports = router;