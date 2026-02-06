const User = require("../models/user.cjs");

const forcePasswordMiddleware = async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  if (user.forcePasswordChange) {
    return res.status(403).json({
      message: "Password change required",
      action:"Change Password"
    });
  }

  next();
};

module.exports = forcePasswordMiddleware;