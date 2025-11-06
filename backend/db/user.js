
const { getFirestore, FieldValue } = require('../config/firebase');
const db = getFirestore();

class User {
  static collection = db.collection('users');

  static async create({ nom, email, password, role = false }) {
    const docRef = await this.collection.add({
      nom,
      email,
      password,
      role,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    return docRef.id;
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async findByEmail(email) {
    const snap = await this.collection.where('email', '==', email).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    data.updatedAt = FieldValue.serverTimestamp();
    await this.collection.doc(id).update(data);
    return this.findById(id);
  }

  static async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }
}

module.exports = User;
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

