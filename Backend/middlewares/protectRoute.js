const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) return next();

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = verifyToken;