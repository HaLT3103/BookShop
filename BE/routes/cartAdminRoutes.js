const express = require("express");
const Cart = require("../models/Cart");
const Book = require("../models/Book");
const router = express.Router();

// Lấy tất cả cart
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("userId").populate("items.bookId");
    // Đảm bảo mỗi item đều có bookIdStr (ưu tiên lấy từ bookId.id nếu populate)
    const cartsWithBookIdStr = carts.map(cart => {
      const items = cart.items.map(item => {
        let bookIdStr = item.bookIdStr;
        if (!bookIdStr && item.bookId && typeof item.bookId === 'object' && item.bookId.id) {
          bookIdStr = item.bookId.id;
        }
        return {
          ...item.toObject(),
          bookIdStr,
        };
      });
      return {
        ...cart.toObject(),
        items,
      };
    });
    res.json(cartsWithBookIdStr);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Lấy cart theo id
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("userId").populate("items.bookId");
    if (!cart) return res.status(404).json({ message: "Không tìm thấy cart!" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Thêm cart mới
router.post("/", async (req, res) => {
  try {
    // Validate: userIdStr phải có
    if (!req.body.userIdStr || req.body.userIdStr.trim() === "") {
      return res.status(400).json({ message: "userIdStr là bắt buộc" });
    }
    // Tìm user theo userIdStr (có thể là string hoặc number)
    const User = require("../models/User");
    let user = await User.findOne({ $or: [
      { userId: req.body.userIdStr },
      { userId: Number(req.body.userIdStr) },
      { _id: req.body.userIdStr }
    ] });
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy user với userIdStr này" });
    }
    req.body.userId = user._id;
    // Xử lý items: nếu có bookIdStr mà thiếu bookId thì tìm bookId
    if (Array.isArray(req.body.items)) {
      for (let item of req.body.items) {
        if (item.bookIdStr && !item.bookId) {
          const foundBook = await Book.findOne({ id: item.bookIdStr });
          if (foundBook) {
            item.bookId = foundBook._id;
          } else {
            return res.status(400).json({ message: `Không tìm thấy sách với bookIdStr: ${item.bookIdStr}` });
          }
        }
        if (item.bookId && !item.bookIdStr) {
          const foundBook = await Book.findById(item.bookId);
          if (foundBook) {
            item.bookIdStr = foundBook.id;
          }
        }
      }
    }
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: "Thêm cart thất bại", error: error.message });
  }
});

// Sửa cart
router.put("/:id", async (req, res) => {
  try {
    // Nếu items có bookIdStr mà thiếu bookId, tự động tìm và gán bookId (ObjectId) tương ứng
    if (Array.isArray(req.body.items)) {
      for (let item of req.body.items) {
        if (item.bookIdStr && !item.bookId) {
          const foundBook = await Book.findOne({ id: item.bookIdStr });
          if (foundBook) {
            item.bookId = foundBook._id;
          }
        }
        // Ngược lại, nếu có bookId mà thiếu bookIdStr, cũng tự động gán
        if (item.bookId && !item.bookIdStr) {
          const foundBook = await Book.findById(item.bookId);
          if (foundBook) {
            item.bookIdStr = foundBook.id;
          }
        }
      }
    }
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCart) return res.status(404).json({ message: "Không tìm thấy cart!" });
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: "Sửa cart thất bại" });
  }
});

// Xóa cart
router.delete("/:id", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) return res.status(404).json({ message: "Không tìm thấy cart!" });
    res.json({ message: "Đã xóa cart thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Xóa cart thất bại" });
  }
});

module.exports = router;
