const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../handlers/auth-handler');

const JWT_SECRET = process.env.JWT_SECRET || 'un_secret_par_defaut_a_changer';

const authMiddleware = (req, res, next) => {
    // Check for token in Authorization header first, then fall back to cookies
    let token = null;
    
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('🔑 Token found in Authorization header');
    }
    
    // Fall back to cookie if no Authorization header
    if (!token && req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log('🔑 Token found in cookie');
    }

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    if (isTokenBlacklisted(token)) {
        console.log('❌ Token is blacklisted');
        return res.status(401).json({ error: 'Unauthorized: Token has been revoked.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = { 
            userId: decoded.userId, 
            email: decoded.email, 
            role: decoded.role 
        };
        
        console.log('✅ Token verified for user:', decoded.email);
        next();
    } catch (err) {
        console.log('❌ Invalid token:', err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};

module.exports = authMiddleware;