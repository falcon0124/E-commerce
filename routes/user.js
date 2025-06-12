const express = require('express');
const verifyToken = require('../middlewares/protectRoute')
const {getUserProfile, updateUserProfile, deleteUser} = require('../controllers/user')

const router = express.Router();

router.get('/profile',verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.delete('/profile', verifyToken, deleteUser);

module.exports = router;