const express = require("express");
const User = require("../../models/User");
const router = express.Router();

// Lấy tất cả user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Thêm user mới
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Thêm user thất bại" });
  }
});

// Sửa user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy user!" });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Sửa user thất bại" });
  }
});

// Xóa user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy user!" });
    res.json({ message: "Đã xóa user thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Xóa user thất bại" });
  }
});

module.exports = router;
