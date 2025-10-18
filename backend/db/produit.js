const mongoose = require('mongoose');
const produitSchema = new mongoose.Schema({
    name :String,
    shotDescription :String,
    description:String,
    purchagePrice:Number,
    images:Array(String),
    categoryId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    
});

module.exports = mongoose.model('Produit', produitSchema);