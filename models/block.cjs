const mongoose = require("mongoose")

const blockSchema = new mongoose.Schema({
    blockId:{type:String, required:true, unique:true },
    productID:{type:String},
    blockNames:[{type:String}],
    defaultLocation:{type:String},
    createdBy:{type:String},
    updatedBy:{type:String},
    description:{type:String},
    isRunning:{type:Boolean,default:false},
    startTime:Date
},{timestamps:true});

module.exports = mongoose.model("Block",blockSchema);