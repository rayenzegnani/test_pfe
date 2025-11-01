const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'un_secret_par_defaut_a_changer';

const generateTokenAndSetCookie = (res, userId, email, role) => {
    const token = jwt.sign({ userId, email, role }, SECRET, {
        expiresIn: '1d',
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Empêche l'accès via JavaScript côté client
        secure: process.env.NODE_ENV !== 'development', // Utilise HTTPS en production
        sameSite: 'strict', // Protection contre les attaques CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 jour, doit correspondre à 'expiresIn'
    });

    return token;
};

module.exports = generateTokenAndSetCookie;