const express = require("express");
const router = express.Router();
const History = require("../models/history.cjs");

const {authMiddleware,adminOnly}=require("../middleware/authMiddleware.cjs")

router.get("/",authMiddleware, async (req,res) => {
  try{
  const history = await History.find().sort({ createdAt: -1 });
  res.json(history);
} catch(err){
  res.status(500).json({message:err.message})
}
});

// DELETE ONLY ONE HISTORY ROW (by history _id)
router.delete("/:id",authMiddleware,adminOnly, async (req, res) => {
  try {
    // console.log("DELETE HISTORY ID:",req.params.id);

    await History.findByIdAndDelete(req.params.id);

    res.json({ message: "History row deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;