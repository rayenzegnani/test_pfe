const Category = require('../db/caregory');

async function addCategory(model) {
  try {
    const id = await Category.create({ name: model.name });
    return Category.findById(id);
  } catch (err) {
    console.error('addCategory error:', err);
    throw err;
  }
}

async function updateCategory(id, model) {
  try {
    return Category.update(id, model);
  } catch (err) {
    console.error('updateCategory error:', err);
    throw err;
  }
}

async function getCategoryById(id) {
  return Category.findById(id);
}

async function getCategories() {
  return Category.findAll();
}

async function deleteCategory(id) {
  await Category.delete(id);
  return true;
}

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
};