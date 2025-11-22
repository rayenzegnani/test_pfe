const crypto = require('crypto');
const User = require('../db/user');
const { mailer } = require('../config/mailer');

exports.inviteAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    

    const code = crypto.randomBytes(3).toString('hex');
    await User.setAdminInvite({ email, code }); // méthode à ajouter dans user.js pour stocker code + rôle admin=false par défaut

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Invitation administrateur',
      text: `Votre code administrateur : ${code}`,
    });

    return res.status(201).json({ success: true, message: 'invitation sent' });
  } catch (err) {
    next(err);
  }
};