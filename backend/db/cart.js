const { getFirestore, FieldValue } = require('../config/firebase');
const db = getFirestore();

class Cart {
  static collection = db.collection('carts');

  static async create({ userId, productsId }) {
    const docRef = await this.collection.add({
      userId,
      productsId: productsId || [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    return docRef.id;
  }

  static async findByUserId(userId) {
    const snap = await this.collection.where('userId', '==', userId).get();
    if (snap.empty) return null;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    data.updatedAt = FieldValue.serverTimestamp();
    await this.collection.doc(id).update(data);
    return true;
  }

  static async delete(id) {
    await this.collection.doc(id).delete();
  }
}

module.exports = Cart;
