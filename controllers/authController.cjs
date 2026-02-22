const User = require("../models/user.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ===================== SIGNUP =====================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Prevent admin signup from UI
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin signup not allowed",
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",                 // active | disabled
      forcePasswordChange: true,        // industry rule
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      message: "User created successfully. Ask user to login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===================== LOGIN =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 DEBUG LOGS (REMOVE LATER)
   // console.log("LOGIN ATTEMPT");
    //console.log("Email:", email);
    //console.log("Password:", password);

    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Disabled user
    if (user.status === "disabled") {
      return res.status(403).json({
        message: "Account disabled. Contact admin.",
      });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Success response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD (FORCED / NORMAL)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    user.forcePasswordChange = false;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN GET ALL USERS =================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN ENABLE / DISABLE USER =================

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        message: "userId and status required",
      });
    }

    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({
        message: "Status must be active or disabled",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.status = status;
    await user.save();

    res.json({
      message: `User ${status} successfully`,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== ADMIN RESET USER PASSWORD =====================

exports.adminResetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "userId and newPassword required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.forcePasswordChange = true; // IMPORTANT
    await user.save();

    res.json({
      message: "Password reset successfully. User must change password on next login."
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};