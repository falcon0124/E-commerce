const express = require('express');
const verifyToken = require('../middlewares/protectRoute');
const { placeOrder, viewUserOrder } = require('../controllers/order');
const isAdmin = require('../middlewares/isAdmin')

const router = express.Router();

router.post('/',verifyToken, placeOrder);
router.get('/view-orders', verifyToken, viewUserOrder);

module.exports = router;