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

recordSchema.index({bloackId:1});
recordSchema.index({lastLocation:1});
recordSchema.index({createAt: -1});

module.exports = mongoose.model("Record", recordSchema);