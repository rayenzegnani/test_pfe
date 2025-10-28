const User = require('../db/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'votre_secret_jwt'; // Mets une vraie valeur secrète en prod

async function registerUser(model) {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(model.password, 10);
        
        // Create new user with isAdmin field
        const newUser = new User({
            nom: model.nom,
            email: model.email,
            password: hashedPassword,
            isAdmin: model.isAdmin || false
        });
        
        await newUser.save();
        
        // Return user without password
        return {
            _id: newUser._id,
            nom: newUser.nom,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            createdAt: newUser.createdAt
        };
    } catch (error) {
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return null;
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return null;
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Return user data without password, including isAdmin status
        return {
            token,
            user: {
                _id: user._id,
                nom: user.nom,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        };
    } catch (error) {
        throw error;
    }
}

const tokenBlacklist = new Set();

function logout(token) {
    if (!token) return false;
    tokenBlacklist.add(token);
    return true;
}

function isTokenBlacklisted(token) {
    return token && tokenBlacklist.has(token);
}

module.exports = { registerUser, loginUser, logout, isTokenBlacklisted };