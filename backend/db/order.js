const { getFirestore, FieldValue } = require('../config/firebase');
const db = getFirestore();

class Order {
  static collection = db.collection('orders');

  static async create({ date, items, status }) {
    const docRef = await this.collection.add({
      date: date || new Date(),
      items: items || [],
      status: status || 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    return docRef.id;
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
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

module.exports = Order;
