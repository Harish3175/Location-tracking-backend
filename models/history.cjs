const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  blockId: String,

  productId: String,
  productName: String,

  engineerName: String,

  description: String,

  action: String

}, { timestamps:true });

module.exports = mongoose.model("History", historySchema);