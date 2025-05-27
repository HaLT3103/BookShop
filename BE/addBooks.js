const mongoose = require("mongoose");
require("dotenv").config();
const Book = require("./models/Book");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const fetchBooks = async () => {
  const fetch = (await import("node-fetch")).default;
  
  try {
    console.log("Đang xóa toàn bộ sách cũ...");
    await Book.deleteMany({});
    console.log("Đã xóa tất cả sách cũ!");

    const response = await fetch("https://openlibrary.org/subjects/fiction.json?limit=50");
    const data = await response.json();

    const bookList = data.works.map((book) => ({
      title: book.title,
      author: book.authors ? book.authors[0].name : "Không rõ",
      cover: book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
        : "https://via.placeholder.com/150",
      price: parseFloat((Math.random() * (30 - 5) + 5).toFixed(2)), // Random giá từ 5 đến 30
      genre: "Fiction",
      year: book.first_publish_year || "Không rõ",
      pages: Math.floor(Math.random() * (700 - 100) + 100), // Random số trang từ 100-700
      description: `Cuốn sách "${book.title}" là một tác phẩm thuộc thể loại Fiction. Được viết bởi ${
        book.authors ? book.authors[0].name : "một tác giả chưa biết"
      }.`, // Tạo mô tả ngẫu nhiên
    }));

    await Book.insertMany(bookList);
    console.log("Đã thêm sách mới vào MongoDB!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    mongoose.connection.close();
  }
};

fetchBooks();
