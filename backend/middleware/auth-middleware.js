const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../handlers/auth-handler');

const JWT_SECRET = process.env.JWT_SECRET || 'un_secret_par_defaut_a_changer';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt; // Lire le token depuis le cookie

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ error: 'Unauthorized: Token has been revoked.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = { 
            userId: decoded.userId, 
            email: decoded.email, 
            role: decoded.role 
        };
        
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};

module.exports = authMiddleware;