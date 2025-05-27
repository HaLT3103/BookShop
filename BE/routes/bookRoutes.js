const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

// Lấy danh sách sách
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
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

module.exports = router;
