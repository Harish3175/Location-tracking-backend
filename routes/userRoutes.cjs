const express = require("express");
const router = express.Router();

const { authMiddleware, adminOnly } = require("../middleware/authMiddleware.cjs");

// 🔍 TEST ROUTE (ADMIN ONLY)
router.get("/admin-test", authMiddleware, adminOnly, (req, res) => {
  res.json({
    message: "Admin access verified",
    adminId: req.user.id,
    role: req.user.role
  });
});

module.exports = router;