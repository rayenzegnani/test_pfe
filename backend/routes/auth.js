const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../handlers/auth-handler');
const authMiddleware = require('../middleware/auth-middleware');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

router.post('/register', async (req, res) => {
  try {
    const { nom, email, password, role, isAdmin } = req.body;
    console.log('Registration request:', { nom, email, hasPassword: !!password, role, isAdmin });

    if (!nom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (nom, email, password)',
      });
    }

    // Handle both 'role' and 'isAdmin' fields - convert to boolean
    let userRole = false;
    if (role !== undefined) {
      userRole = role === true || String(role).toLowerCase() === 'true';
    } else if (isAdmin !== undefined) {
      userRole = isAdmin === true || String(isAdmin).toLowerCase() === 'true';
    }
    
    console.log('Creating user with role:', userRole);
    
    const user = await registerUser({ nom, email, password, role: userRole });

    const token = generateTokenAndSetCookie(res, user.id, user.email, user.role);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000 || error.message === 'Email already in use') {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateTokenAndSetCookie(res, user.id, user.email, user.role);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies?.token;
  if (token) logout(token);
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logout successful' });
});

module.exports = router;