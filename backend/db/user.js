const { getFirestore, FieldValue } = require('../config/firebase');

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
}

module.exports = User;