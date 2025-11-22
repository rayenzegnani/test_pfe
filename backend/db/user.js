const { getFirestore, FieldValue } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const db = getFirestore();

class User {
  static collection() {
    return db.collection('users');
  }

  static mapDoc(doc, { includeSensitive } = {}) {
    if (!doc || !doc.exists) return null;
    const data = doc.data();

    const base = {
      id: doc.id,
      nom: data.nom,
      email: data.email,
      role: !!data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    if (includeSensitive) base.password = data.password;
    return base;
  }

  static async create(data) {
    const now = FieldValue.serverTimestamp();
    const docRef = await this.collection().add({
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: !!data.role,
      createdAt: now,
      updatedAt: now,
    });

    const snapshot = await docRef.get();
    return this.mapDoc(snapshot, { includeSensitive: true });
  }

  static async findByEmail(email, options = {}) {
    const snapshot = await this.collection().where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    return this.mapDoc(snapshot.docs[0], options);
  }

  static async findById(id, options = {}) {
    const doc = await this.collection().doc(id).get();
    return this.mapDoc(doc, options);
  }

  static async findAll() {
    const snapshot = await this.collection().orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => this.mapDoc(doc));
  }

  static async update(id, data) {
    await this.collection().doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return this.findById(id);
  }

  static async delete(id) {
    await this.collection().doc(id).delete();
    return true;
  }

  static async setAdminInvite({ email, code }) {
    if (!email) throw new Error('Email is required for admin invite');

    const hashedCode = await bcrypt.hash(code, 10);
    const snapshot = await this.collection().where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      const now = FieldValue.serverTimestamp();
      await this.collection().add({
        email,
        role: true,
        password: hashedCode,
        createdAt: now,
        updatedAt: now,
      });
      return;
    }

    await snapshot.docs[0].ref.update({
      role: true,
      password: hashedCode,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

module.exports = User;