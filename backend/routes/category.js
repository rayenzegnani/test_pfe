const Category = require('../db/caregory');
const express = require('express');
const { addCategory, updateCategory } = require('../handlers/category-handler');
const router = express.Router();

router.post("", async (req, res) => {
  try {
    const model = req.body;
    const result = await addCategory(model);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Save failed' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const model = req.body;
    const id = req.params["id"];
    const updated = await updateCategory(id, model);
    if (!updated) return res.status(404).json({ message: "category not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;