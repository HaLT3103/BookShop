import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/BookDetailPage.css";

const BookDetailPage = () => {
  const location = useLocation();
  const book = location.state;
  const [, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = async () => {
    if (!book) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user._id}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Thêm vào giỏ hàng thất bại!");
      alert("Sách đã được thêm vào giỏ hàng!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!book) {
    return <h2 className="error-message">Không tìm thấy thông tin sách</h2>;
  }

  return (
    <div className="detail-container">
      <h1 className="detail-title">{book.title}</h1>
      <img src={book.cover} alt={book.title} className="detail-image" />
      <p className="detail-author">Tác giả: {book.author}</p>
      <p className="detail-price">Giá: ${book.price}</p>
      <p className="detail-genre">Thể loại: {book.genre}</p>
      <p className="detail-year">Năm xuất bản: {book.year}</p>
      <p className="detail-pages">Số trang: {book.pages}</p>
      <p className="detail-description">Mô tả: {book.description}</p>
      <button className="detail-button" onClick={addToCart}>Thêm vào giỏ hàng</button>
    </div>
  );
};

export default BookDetailPage;
