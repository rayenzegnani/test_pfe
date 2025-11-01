const { getFirestore, FieldValue } = require('../config/firebase');

const db = getFirestore();

class Brand {
  static collection = db.collection('brands');

  static async create({ name }) {
    const docRef = await this.collection.add({
      name,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async findAll() {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return this.findById(id);
  }

  static async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }
}

module.exports = Brand;
