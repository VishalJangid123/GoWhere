const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.header('Authorization');
    token = token.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        
        next();
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
