const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getFirestore, FieldValue } = require('../config/firebase');

const db = getFirestore();
const JWT_SECRET = process.env.JWT_SECRET || 'un_secret_par_defaut_a_changer';

const tokenBlacklist = new Set();

async function registerUser(model) {
  const existingSnap = await db
    .collection('users')
    .where('email', '==', model.email)
    .get();

  if (!existingSnap.empty) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(model.password, 10);

  const docRef = await db.collection('users').add({
    nom: model.nom,
    email: model.email,
    password: hashedPassword,
    role: Boolean(model.role),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const doc = await docRef.get();
  const userObj = { id: doc.id, _id: doc.id, ...doc.data() };
  delete userObj.password;

  return userObj;
}

async function loginUser(email, password) {
  const snap = await db.collection('users').where('email', '==', email).get();
  if (snap.empty) {
    return null;
  }

  const doc = snap.docs[0];
  const user = doc.data();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  const token = jwt.sign(
    { userId: doc.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' },
  );

  const userObj = { id: doc.id, _id: doc.id, ...user };
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
