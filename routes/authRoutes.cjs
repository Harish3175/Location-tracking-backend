const express = require("express");
const router = express.Router();
const {signup,login,changePassword,adminResetPassword,getAllUsers,updateUserStatus} = require("../controllers/authController.cjs");
const { authMiddleware,adminOnly } = require("../middleware/authMiddleware.cjs");

router.post("/signup", signup);
router.post("/login", login);

// Password change (forced / normal)
router.post("/change-password", authMiddleware, changePassword);

//admin reset
router.post("/admin-reset-password",authMiddleware,adminOnly,adminResetPassword);
//all users
router.get("/users",authMiddleware,adminOnly,getAllUsers)
//users disable enable
router.post("/user-status",authMiddleware,adminOnly,updateUserStatus);

module.exports = router;