const mongoose = require('mongoose');
const catgorySchema = new mongoose.Schema({
    name: String

});

const Category = mongoose.model('Category', catgorySchema);
module.exports = Category;