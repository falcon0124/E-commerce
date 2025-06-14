const express = require('express');
const verifyToken = require('../middlewares/protectRoute');
const {addToCart, viewCart, deleteItem, clearCart} = require('../controllers/cart');

const router = express.Router();

router.post('/add-items', verifyToken, addToCart);
router.get('/view', verifyToken, viewCart);
router.delete('/remove/:productId', verifyToken, deleteItem);

router.delete('/clear', verifyToken, clearCart);

module.exports = router;
