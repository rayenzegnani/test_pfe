const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
   userId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   productsId: Array(String)

});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;