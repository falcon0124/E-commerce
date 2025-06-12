const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const verifyToken = require('../middlewares/protectRoute');
dotenv.config();

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;
    if (await User.findOne({ email })) {
        return res.status(409).json('email already exists');
    }
    const user = await User.create({ fullName, email, password });

    const token = jwt.sign({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET);

    const userFrontEnd = {
        fullName: user.fullName,
        email: user.email
    }

    return res.status(201).json({ message: "User created", token, user: userFrontEnd });
}

async function loginUser(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const token = jwt.sign({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET);

        const userFrontEnd = {
            fullName: user.fullName,
            email: user.email
        }

        return res.status(201).json({ message: "Welcome", token, user: userFrontEnd });
    } else {
        return res.status(401).json({ message: "Invalid credentials" })
    }
}

async function getUserProfile(req, res) {
    try {
        const userData = req.user;
        return res.status(200).json({
            fullName: userData.fullName,
            email: userData.email,
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function updateUserProfile(req, res) {
    const userId = req.user._id;
    const { fullName, password } = req.body;

    try {
        const user = await User.findById(userId);

        if (fullName) user.fullName = fullName;
        if (password) user.password = password;

        await user.save();

        return res.status(200).json({ message: "Credentials updated" });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }

}
module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };