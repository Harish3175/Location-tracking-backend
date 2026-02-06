const mongoose = require("mongoose");

const connectDB = async () =>{

    try{
    mongoose.connection.on('connected',()=>{
        console.log("DB Connected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
}catch(error){
    console.log("MongoDB connection error:",
        error.message);
        process.exit(1);
}

}

module.exports = connectDB;