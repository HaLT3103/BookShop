const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Middleware xác thực
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau!",
});

// Helper function to validate password strength
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { name, age, phone, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, age, phone, email, password: hashedPassword });

    // Lưu vào database
    await newUser.save();

    // Tạo token sau khi đăng ký để tự động đăng nhập
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Đăng ký thành công!",
      token,
      user: { _id: newUser._id, name, age, phone, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// Đăng nhập
router.post("/login", loginLimiter, async (req, res) => {
  console.log("Nhận request đăng nhập:", req.body);
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Tạo token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: { _id: user._id, name: user.name, age: user.age, phone: user.phone, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API cập nhật thông tin người dùng
router.put("/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { name, age, phone, email } = req.body;

  try {
    // Kiểm tra quyền sở hữu
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật thông tin người dùng này!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, age, phone, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

// API đổi mật khẩu
router.put("/change-password/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Kiểm tra quyền sở hữu
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền đổi mật khẩu người dùng này!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });
    }

    // Kiểm tra độ mạnh của mật khẩu mới
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
});

module.exports = { router, authMiddleware };
