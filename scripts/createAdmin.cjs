const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user.cjs");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = "admin@nokia.com";
    const adminPassword = "Admin@123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully");
    console.log("👉 Username:", adminEmail);
    console.log("👉 Password:", adminPassword);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();