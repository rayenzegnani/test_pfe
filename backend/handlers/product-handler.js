const Product = require('../db/produit');

async function addProduct(model) {
    const id = await Product.create(model);
    return Product.findById(id);
}

async function updateProduct(id, model) {
    return Product.update(id, model);
}

async function getProductById(id) {
    return Product.findById(id);
}

async function getProducts() {
    return Product.findAll();
}

async function deleteProduct(id) {
    await Product.delete(id);
    return true;
}

async function getNewProducts() {
    return Product.findByFlag('isNewProduct');
}

async function getFeaturedProducts() {
    return Product.findByFlag('isFeatured');
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getNewProducts,
    getFeaturedProducts,
};