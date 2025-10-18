const express = require('express');
const router = express.Router();

router.get("/home/new-product",async (req,res)=>{
    // Logic to fetch new products
    res.send({ message: "List of new products" });
});

router.get("/home/featured-product",async (req,res)=>{
    // Logic to fetch featured products
    res.send({ message: "List of featured products" });
});

module.exports = router;