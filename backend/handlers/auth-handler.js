const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getFirestore, FieldValue } = require('../config/firebase');

const db = getFirestore();
const JWT_SECRET = process.env.JWT_SECRET || 'un_secret_par_defaut_a_changer';

const tokenBlacklist = new Set();

async function registerUser(model) {
    const hashedPassword = await bcrypt.hash(model.password, 10);

    let newUser=new User({
        nom:model.nom,
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

function logout(token) {
  if (!token) return false;
  tokenBlacklist.add(token);
  return true;
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = { registerUser, loginUser, logout, isTokenBlacklisted };
