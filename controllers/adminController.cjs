const User = require("../models/user.cjs");

// ENABLE / DISABLE USER
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({
      message: `User ${status} successfully`,
      userId: user._id,
      status: user.status
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};