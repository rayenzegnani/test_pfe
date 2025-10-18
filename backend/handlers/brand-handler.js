const Brand=require('../db/brand');

async function addBrand(model) {
  let brand = new Brand({
    name: model.name,
  });
  await brand.save();
  return brand.toObject();
}

async function updateBrand(id, model) {
  let updated = await Brand.findByIdAndUpdate(id, model, { new: true });
  return updated ? updated.toObject() : null;
}

async function getBrandById(id) {
  let brand = await Brand.findById(id);
  return brand.toObject();
}

async function getBrands(){
  let brands = await Brand.find();
  return brands.map(br => br.toObject());
}

async function deleteBrand(id) {
  
    await Brand.findByIdAndDelete(id);
    return;
}

module.exports = { addBrand, updateBrand , deleteBrand, getBrandById, getBrands };