const express = require("express");
const router = express.Router();

const Block = require("../models/block.cjs");
const {addBlock,updateBlock,deleteBlock,} = require("../controllers/blockController.cjs");
const { authMiddleware } = require("../middleware/authMiddleware.cjs");
const forcePasswordMiddleware = require("../middleware/forcePasswordMiddleware.cjs");
const roleMiddleware = require("../middleware/roleMiddleware.cjs");

//CREATE BLOCK
router.post(
  "/",authMiddleware,forcePasswordMiddleware,roleMiddleware("admin", "engineer"),addBlock);

//UPDATE BLOCK
router.put("/:blockId",authMiddleware,forcePasswordMiddleware,roleMiddleware("admin", "engineer"),updateBlock);

//DELETE BLOCK (ADMIN ONLY)
router.delete("/:blockId",authMiddleware,forcePasswordMiddleware,roleMiddleware("admin"),deleteBlock);

//GET BLOCKS BY LINE (PUBLIC OR PROTECTED — YOUR CHOICE)
router.get("/line/:line", async (req, res) => {
  try {
    const { line } = req.params;
    const normalizedLine = line.toLowerCase();

    const blocks = await Block.find({
      defaultLocation: { $regex: new RegExp(normalizedLine, "i") },
    });

    res.json(blocks);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// GET ALL BLOCKS
router.get("/", async (req, res) => {
  try {
    const blocks = await Block.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;