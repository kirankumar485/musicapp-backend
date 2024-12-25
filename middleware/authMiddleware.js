
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');

dotenv.config()


// Middleware for Authentication
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch(err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


// Middleware for Role-Based Access Control
const authorize = (roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

module.exports = {
    authorize, authenticate
}