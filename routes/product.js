const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const {createProduct, upload} = require('../controllers/product');

const router = express.Router();

router.post('/add', verifyToken, upload.single('image'), createProduct);

module.exports = router;