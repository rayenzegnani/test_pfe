const Category = require('../db/caregory'); // <-- importer le modèle (remarque : le fichier DB s'appelle caregory.js)

async function addCategory(model) {
  try {
    const category = new Category({ name: model.name });
    await category.save();
    return category.toObject();
  } catch (err) {
    console.error('addCategory error:', err);
    throw err;
  }
}

async function updateCategory(id, model) {
  try {
    const updated = await Category.findByIdAndUpdate(id, model, { new: true });
    return updated ? updated.toObject() : null;
  } catch (err) {
    console.error('updateCategory error:', err);
    throw err;
  }
}
async function getCategoryById(id) {
  let category = await Category.findById(id);
  return category.toObject();
}
async function getCategories(){
  let categories = await Category.find();
  return categories.map(cat => cat.toObject());
}
async function deleteCategory(id) {
  
    await Category.findByIdAndDelete(id);
    return;
}

module.exports = { addCategory, updateCategory , deleteCategory, getCategoryById, getCategories };