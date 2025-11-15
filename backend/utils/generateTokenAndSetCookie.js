const jwt = require('jsonwebtoken');

function generateTokenAndSetCookie(res, userId, email, role) {
  const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 1000,
  });

  return token;
}

module.exports = generateTokenAndSetCookie;