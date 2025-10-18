const category=require('../db/caregory');

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
module.exports = { addCategory, updateCategory };