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

module.exports = mongoose.model('Produit', produitSchema);