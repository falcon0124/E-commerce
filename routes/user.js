const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const {getUserProfile, updateUserProfile} = require('../controllers/user')

const router = express.Router();

router.get('/profile',verifyToken, getUserProfile)
router.put('/profile', verifyToken, updateUserProfile)

module.exports = router;