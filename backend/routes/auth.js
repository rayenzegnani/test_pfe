const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../handlers/auth-handler');

// Register
router.post('/register', async (req, res) => {
    const { username, nom, email, password } = req.body;
    const userName = username || nom;
    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    await registerUser({ username: userName, email, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await loginUser(email, password);
    if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json(result);
});

// Logout
router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromHeader || (req.cookies && req.cookies.token);

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    const ok = logout(token);
    try { res.clearCookie('token'); } catch (e) {}
    if (ok) return res.status(200).json({ message: 'Logged out' });
    return res.status(400).json({ error: 'Unable to logout' });
});

module.exports = router; 