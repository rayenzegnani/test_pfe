const express = require('express');
const router = express.Router();
const {
    getNewProducts,
    getFeaturedProducts
} = require('../handlers/product-handler');

router.get("/new-product",async (req,res)=>{
   const produits = await getNewProducts();
   res.send(produits);
});

router.get("/featured-product",async (req,res)=>{
   const produits = await getFeaturedProducts();
   res.send(produits);
});

module.exports = router;