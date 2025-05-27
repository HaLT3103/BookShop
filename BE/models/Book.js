const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  cover: { type: String },
  price: { type: Number, required: true },
  genre: { type: String },
  year: { type: Number },
  pages: { type: Number },
  description: { type: String },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
