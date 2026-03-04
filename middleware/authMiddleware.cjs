const jwt = require("jsonwebtoken");
const User = require("../models/user.cjs");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1️⃣ Token check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Fetch fresh user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "disabled") {
      return res.status(403).json({
        message: "Account disabled. Contact admin.",
      });
    }

    // 4️⃣ Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔐 ADMIN ONLY
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };