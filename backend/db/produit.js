
const { getFirestore, FieldValue } = require('../config/firebase');

const mongoose = require('mongoose');
const produitSchema = new mongoose.Schema({
    name :String,
  
    purchagePrice:Number,
    discount: Number,
    images:Array(String),
    categoryId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    brandId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    isFeatured:Boolean,
    isNewProduct:Boolean,
});


const db = getFirestore();

class Produit {
  static collection = db.collection('produits');

  static async create(data) {
    const docRef = await this.collection.add({
      ...data,
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

  static async findByFlag(flagField) {
    const snapshot = await this.collection.where(flagField, '==', true).get();
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

module.exports = Produit;
