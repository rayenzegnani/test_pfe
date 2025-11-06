const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../handlers/auth-handler');
const authMiddleware = require('../middleware/auth-middleware');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

// ... La route /register reste la même ...
router.post('/register', async (req, res) => {
    try {

        const { nom, email, password, role } = req.body;
        if (!nom || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const userRole = (String(role).toLowerCase() === 'true');
        await registerUser({ nom, email, password, role: userRole });
        
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials after registration' });
        }

        generateTokenAndSetCookie(res, result.user._id, result.user.email, result.user.role);

        res.status(201).json({ message: 'User registered successfully', user: result.user });

    } catch (err) {
        console.error('REGISTER ERROR:', err.message);
        if (err.message === 'Email already in use') {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: 'Registration failed' });

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


// Route de connexion (publique)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Génère le token et le place dans un cookie HttpOnly
        generateTokenAndSetCookie(res, result.user._id, result.user.email, result.user.role);

        res.status(200).json({ user: result.user }); // Ne retourne plus le token dans le JSON

    } catch (err) {
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ error: 'Login failed' });
        
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
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('LOGOUT ERROR:', err);
        res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;