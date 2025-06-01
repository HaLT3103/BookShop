const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

// Lấy tất cả sách (trả về đầy đủ thông tin)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Không select trường nào, trả về toàn bộ
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// Thêm sách mới
router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Thêm sách thất bại" });
  }
});

// Sửa sách theo id
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách!" });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: "Sửa sách thất bại" });
  }
});

// Xóa sách theo id
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Không tìm thấy sách!" });
    res.json({ message: "Đã xóa sách thành công!" });
  } catch (error) {
    res.status(400).json({ message: "Xóa sách thất bại" });
  }
});

module.exports = router;
