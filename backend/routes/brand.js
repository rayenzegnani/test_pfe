const express = require('express');
const { addBrand, updateBrand , deleteBrand, getBrandById, getBrands } = require('../handlers/brand-handler');
const router = express.Router();
router.post("", async (req, res) => {
  try {
    const model = req.body;
    const result = await addBrand(model);
    res.status(201).json(result);
  } catch (err) {
    console.error('POST /brands error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});
router.get("/", async (req, res) => {
 let id= req.params["id"];
 let result=await getBrands();
 res.send(result);
});
router.get("/:id",async(req,res)=>{
  let id= req.params["id"];
  let result=await getBrandById(id);
  res.send(result);
});
router.put("/:id", async (req, res) => {
  try {
    const model = req.body;
    const id = req.params.id;
    const updated = await updateBrand(id, model);
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /brands/:id error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  await deleteBrand(id);
  res.send({ message: "Brand deleted successfully" });
})


module.exports = router;