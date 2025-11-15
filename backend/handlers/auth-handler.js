const bcrypt = require('bcrypt');
const User = require('../db/user');

const tokenBlacklist = new Set();

async function registerUser(model) {
  const existing = await User.findByEmail(model.email, { includeSensitive: true });
  if (existing) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(model.password, 10);

  const created = await User.create({
    nom: model.nom,
    email: model.email.trim().toLowerCase(),
    password: hashedPassword,
    role: !!model.role,
  });

  const { password: _pw, ...user } = created;
  return user;
}

async function loginUser(email, password) {
  const user = await User.findByEmail(email.trim().toLowerCase(), { includeSensitive: true });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const { password: _pw, ...clean } = user;
  return clean;
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