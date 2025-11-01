const adminCheck = (req, res, next) => {
    // req.user est attaché par le auth-middleware
    if (req.user && req.user.role === true) {
        next(); // L'utilisateur est un admin, on continue
    } else {
        res.status(403).json({ error: 'Forbidden: Access is restricted to administrators.' });
    }
};

module.exports = adminCheck;