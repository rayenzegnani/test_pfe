const express = require('express');
const { addProduct, updateProduct , deleteProduct, getProductById, getProducts } = require('../handlers/product-handler');

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const model = req.body;
    const result = await addProduct(model);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.get("/", async (req, res) => {
  let result = await getProducts();
  res.send(result);
});

router.get("/:id", async (req, res) => {
  let id = req.params["id"];
  let result = await getProductById(id);
  res.send(result);
});

router.put("/:id", async (req, res) => {
  try {
    const model = req.body;
    const id = req.params.id;
    const updated = await updateProduct(id, model);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  await deleteProduct(id);
  res.send({ message: "Product deleted successfully" });
});

module.exports = router;