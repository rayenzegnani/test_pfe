const express = require('express');
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProducts,
} = require('../handlers/product-handler');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await addProduct(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await getProducts();
    res.json(result);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await getProductById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result);
  } catch (err) {
    console.error('GET /products/:id error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('DELETE /products/:id error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;