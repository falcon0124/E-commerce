const express = require('express');
const verifyToken = require('../middlewares/protectRoute');
const addToCart = require('../controllers/cart');

const router = express.Router();

router.post('/add-items', verifyToken, addToCart);

module.exports = router;
