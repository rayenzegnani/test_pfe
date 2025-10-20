const express = require('express');
const router=express.Router();
const { registerUser, loginUser } = require('../handlers/auth-handler');

router.post('/register', async (req, res) => {
    let model = req.body;
    // Accept either 'username' or 'nom'
    const username = model.username || model.nom;
    const { email, password } = model;

    if (username && email && password) {
        // pass a normalized model to registerUser
        await registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } else {
        res.status(400).json({ error: 'Missing required fields' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const email = (req.body && req.body.email || '').toString().trim();
        const password = (req.body && req.body.password || '').toString();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await loginUser(email, password);
        if (!result) {
            // Invalid credentials
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Si loginUser renvoie un token ou un objet { token, user }, adapter ici :
        // Par exemple ne renvoyer que le token et éventuellement des metas non sensibles
        if (result.token) {
            return res.status(200).json({ token: result.token });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('POST /auth/login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});
router.post('/logout', (req, res) => {
    // Cherche token dans Authorization ou cookie 'token'
    const authHeader = req.headers.authorization || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromHeader || (req.cookies && req.cookies.token);

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    const ok = logout(token);
    // clear cookie si présent
    try { res.clearCookie('token'); } catch (e) { /* ignore if cookie not used */ }

    if (ok) return res.status(200).json({ message: 'Logged out' });
    return res.status(400).json({ error: 'Unable to logout' });
});

module.exports = router;