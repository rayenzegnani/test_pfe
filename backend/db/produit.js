const mongoose = require('mongoose');
const produitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);