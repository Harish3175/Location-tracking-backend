const express = require("express");
const router = express.Router();

const { updateUserStatus } = require("../controllers/adminController.cjs");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware.cjs");

router.patch("/user/:id/status", authMiddleware, adminOnly, updateUserStatus);

module.exports = router;