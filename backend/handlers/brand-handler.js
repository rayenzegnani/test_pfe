const Brand = require('../db/brand');

async function addBrand(model) {
  const id = await Brand.create({ name: model.name });
  return Brand.findById(id);
}

async function updateBrand(id, model) {
  return Brand.update(id, model);
}

async function getBrandById(id) {
  return Brand.findById(id);
}

async function getBrands() {
  return Brand.findAll();
}

async function deleteBrand(id) {
  await Brand.delete(id);
  return true;
}

module.exports = {
  addBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getBrands,
};