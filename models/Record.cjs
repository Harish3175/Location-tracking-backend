const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  blockId: { type:String, required: true },
  lineId: { type: String, required: true },

  productID:String,
  productName:String,

  operatorIn: { type: String },
  operatorOut: { type:String },

  startTime: { type: Date },
  endTime: { type: Date },

  lastLocation: { type: String },

  status: {
    type: String,
    enum: ["RUNNING", "COMPLETED"],
    default: "RUNNING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);