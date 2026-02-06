const { json } = require("express");
const Block = require("../models/block.cjs");
const History = require("../models/history.cjs")

exports.addBlock = async(req,res) => {
  try {
    const { blockId, productID, blockNames, defaultLocation, engineerName, description } = req.body;

    if (!blockId) return res.status(400).json({ message:"Block ID required" });

    const exists = await Block.findOne({ blockId });
    if (exists) return res.status(409).json({ message:"Block exists" });

    const block = await Block.create({
      blockId,
      productID,
      blockNames,
      defaultLocation,
      createdBy: engineerName,
      description
    });

    await History.create({
      blockId,
      productId:productID,
      productName: blockNames[0],
      engineerName,
      description,
      registeredDate: new Date(),
      action: "REGISTER"
    });

    res.json({ message:"Block added", block });

  } catch(err){
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlock = async (req,res) => {
  try {
    const { blockId } = req.params;
    const { productName, engineerName, productId, description } = req.body;

    const block = await Block.findOne({ blockId });
    if (!block) return res.status(404).json({ message:"Block not found" });

    if (productName) block.blockNames = [productName];
    if (productId) block.productID = productId;
    if (description) block.description = description;

    block.updatedBy = engineerName;
    await block.save();

    await History.create({
      blockId,
      productId,
      productName,
      engineerName,
      description,
      updatedDate: new Date(),
      action: "UPDATE"
    });

    res.json({ message:"Updated", block });

  } catch(err){
    res.status(500).json({ message: err.message });
  }
};


/* ================= DELETE BLOCK ================= */
exports.deleteBlock = async (req,res) => {
  try {
    const { blockId } = req.params;

    console.log("DELETE BLOCK ID",blockId)

    const block = await Block.findOne({ blockId });
    if (!block) {
      return res.status(404).json({ message: "Block not found" });
    }

    // Delete block
    await Block.deleteOne({ blockId });

    // Delete ALL history for this block
    const historyResult = await History.deleteMany({ blockId });
    console.log("HISTORY DELETE COUNT:",historyResult.deletedCount)
    

    res.json({ message: "Block and all history deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
