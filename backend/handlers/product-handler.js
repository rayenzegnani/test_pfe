const Product = require('../db/produit');

async function addProduct(model) {
    let product=new Product({
        ...model
    });
    await product.save();
    return product.toObject();
}

async function updateProduct(id, model) {
    let updated = await Product.findByIdAndUpdate(id, model, { new: true });
    return updated ? updated.toObject() : null;
}

async function getProductById(id) {
    let product = await Product.findById(id);
    return product.toObject();
}

async function getProducts(){
    let products = await Product.find();
    return products.map(pr => pr.toObject());
}

async function deleteProduct(id) {
  
    await Product.findByIdAndDelete(id);
    return;
}
async function getNewProducts(){
    let newProduit=await Product.find({
        isNewProduct:true,
    });
    return newProduit.map(np=>np.toObject());
    }
async function getFeaturedProducts(){
    let featuredProducts=await Product.find({
        isFeatured:true,
    });
    return featuredProducts.map(fp=>fp.toObject());
    }
module.exports = { addProduct, updateProduct , deleteProduct, getProductById, getProducts, getNewProducts, getFeaturedProducts };