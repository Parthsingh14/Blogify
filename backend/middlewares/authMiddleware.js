const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }

}

module.exports = authMiddleware;