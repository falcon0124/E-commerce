const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const isAdmin = require('../middlewares/isAdmin');
const { getAllUser } = require('../controllers/user');

const router = express.Router();

router.get('/users', verifyToken, isAdmin, getAllUser);

module.exports = router;

