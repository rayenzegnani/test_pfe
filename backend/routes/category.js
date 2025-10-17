const Category = require('../db/caregory');
const express = require('express');
const router = express.Router();

router.post("",async (req,res)=>{
    console.log("here");
    let model =req.body;
    let category = new Category({
        name:model.name,
    });
    category.save();
    res.send(category.toObject());

});
router.put("/:id",async (req,res)=>{
    let model = req.body;
    let id =req.params["id"];
    await Category.findOneAndUpdate({_id:id},model);
    res.send({message:"category updated"});
});

module.exports = router;