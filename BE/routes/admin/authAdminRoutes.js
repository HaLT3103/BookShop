const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu!" });
    }
    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashed });
    await admin.save();
    const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.SECRET_KEY, { expiresIn: "1d" });
    res.json({ message: "Đăng ký thành công!", token, user: { _id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Tên đăng nhập không tồn tại!" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }
    const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.SECRET_KEY, { expiresIn: "1d" });
    res.json({ message: "Đăng nhập thành công!", token, user: { _id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

module.exports = router;
