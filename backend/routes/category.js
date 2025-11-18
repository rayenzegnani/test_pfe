
const express = require('express');
const {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} = require('../handlers/category-handler');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const model = req.body;
    const result = await addCategory(model);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /categories error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});
router.get('/', async (req, res) => {
  try {
    const result = await getCategories();
    res.json(result);
  } catch (err) {
    console.error('GET /categories error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await getCategoryById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(result);
  } catch (err) {
    console.error('GET /categories/:id error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const model = req.body;
    const id = req.params.id;
    const updated = await updateCategory(id, model);
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /categories/:id error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('DELETE /categories/:id error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;