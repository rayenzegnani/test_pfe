const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../handlers/auth-handler');

// Register
router.post('/register', async (req, res) => {
    try {
        const { nom, email, password, isAdmin } = req.body;
        
        console.log('Registration request:', { nom, email, hasPassword: !!password, isAdmin });
        
        // Validate required fields
        if (!nom || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields (nom, email, password)' 
            });
        }
        
        const result = await registerUser({ nom, email, password, isAdmin });
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            data: result
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false,
                message: 'A user with this email already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: error.message || 'Registration failed' 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login request:', { email });
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }
        
        const result = await loginUser(email, password);
        
        if (!result) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Login failed' 
        });
    }
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