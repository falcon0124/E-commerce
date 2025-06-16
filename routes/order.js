const express = require('express');
const verifyToken = require('../middlewares/protectRoute');
const { placeOrder, viewUserOrder, deleteOder } = require('../controllers/order');
const isAdmin = require('../middlewares/isAdmin')

const router = express.Router();

router.post('/',verifyToken, placeOrder);
router.get('/view-orders', verifyToken, viewUserOrder);
router.delete('/:orderId', deleteOder);

module.exports = router;