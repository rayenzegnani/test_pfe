const express = require('express');
const {
  addBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getBrands,
} = require('../handlers/brand-handler');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await addBrand(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /brands error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await getBrands();
    res.json(result);
  } catch (err) {
    console.error('GET /brands error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await getBrandById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(result);
  } catch (err) {
    console.error('GET /brands/:id error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await updateBrand(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('PUT /brands/:id error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteBrand(req.params.id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    console.error('DELETE /brands/:id error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;