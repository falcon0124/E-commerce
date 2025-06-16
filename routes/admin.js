const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const isAdmin = require('../middlewares/isAdmin');
const { getAllUser } = require('../controllers/user');
const { viewOrdersAdmin, updateStatus } = require('../controllers/order');


const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUser);
router.get('/orders', verifyToken, isAdmin, viewOrdersAdmin);
router.patch('/:orderId/status', verifyToken, isAdmin, updateStatus);


module.exports = router;

