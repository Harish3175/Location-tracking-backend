const express = require("express");
const cors = require("cors");
require("dotenv").config();
process.env.TZ = "Asia/Kolkata"

const connectDB = require("./config/mongodb.cjs");
const blockRoutes = require("./routes/blockRoutes.cjs");
const historyRoutes = require("./routes/historyRoutes.cjs");
const recordRoutes = require("./routes/recordRoutes.cjs");
const authRoutes = require("./routes/authRoutes.cjs");
const userRoutes = require("./routes/userRoutes.cjs");
const adminRoutes = require("./routes/adminRoutes.cjs")

const app = express();

//DB connect
connectDB();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/blocks",blockRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/records",recordRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes)

//test route
app.get("/",(req,res) => {
    res.send("Blockend is running");
});
 
// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Server running on port",PORT);
});
