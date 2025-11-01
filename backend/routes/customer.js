const express = require('express');
const router = express.Router();
const {
   getNewProducts,
   getFeaturedProducts,
} = require('../handlers/product-handler');

router.get('/new-product', async (req, res) => {
   try {
      const produits = await getNewProducts();
      res.json(produits);
   } catch (err) {
      console.error('GET /customers/new-product error:', err);
      res.status(500).json({ error: 'Fetch failed' });
   }
});

router.get('/featured-product', async (req, res) => {
   try {
      const produits = await getFeaturedProducts();
      res.json(produits);
   } catch (err) {
      console.error('GET /customers/featured-product error:', err);
      res.status(500).json({ error: 'Fetch failed' });
   }
});

module.exports = router;