const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: false  // Allow duplicate names
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Emails must be unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false  // Default users are not admins
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Don't create separate index - unique: true already creates one

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;