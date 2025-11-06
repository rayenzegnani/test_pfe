const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../handlers/auth-handler');
const authMiddleware = require('../middleware/auth-middleware');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

// Route d'inscription (publique)
router.post('/register', async (req, res) => {
    try {
        const { nom, email, password, role } = req.body;
        
        console.log('Registration request:', { nom, email, hasPassword: !!password, role });
        
        // Validate required fields
        if (!nom || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields (nom, email, password)' 
            });
        }
        
        const userRole = (String(role).toLowerCase() === 'true');
        await registerUser({ nom, email, password, role: userRole });
        
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials after registration' 
            });
        }

        // Génère le token et le place dans un cookie HttpOnly
        generateTokenAndSetCookie(res, result.user._id, result.user.email, result.user.role);

        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            user: result.user
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000 || error.message === 'Email already in use') {
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

// Route de connexion (publique)
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

        // Génère le token et le place dans un cookie HttpOnly
        generateTokenAndSetCookie(res, result.user._id, result.user.email, result.user.role);
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Login failed' 
        });
    }
});

// Route de déconnexion (protégée)
router.post('/logout', (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            logout(token);
        }

        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('LOGOUT ERROR:', error);
        res.status(500).json({ 
            success: false,
            message: 'Logout failed' 
        });
    }
});

module.exports = router;