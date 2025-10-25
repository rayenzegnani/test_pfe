const User = require('../db/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'votre_secret_jwt'; // Mets une vraie valeur secrète en prod

async function registerUser(model) {
    const hashedPassword = await bcrypt.hash(model.password, 10);

    let newUser=new User({
        username:model.username,
        email:model.email,
        password:hashedPassword,


    });
    await newUser.save();
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    // Génère un token JWT
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Renvoie le token et l'utilisateur (sans password)
    const userObj = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
    delete userObj.password;
    return { token, user: userObj };
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