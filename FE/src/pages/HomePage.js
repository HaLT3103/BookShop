import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/books") // Gọi API từ backend
      .then((response) => response.json())
      .then((data) => {
        setBooks(data); // Dữ liệu từ MongoDB
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const addToCart = async (book) => {
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
      setCart(data.items.map(item => ({
        ...item.bookId,
        quantity: item.quantity
      })));
      alert("Sách đã được thêm vào giỏ hàng!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Danh sách</h1>
      <div className="book-list">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.cover} alt={book.title} className="book-image" />
            <h3 className="book-title" title={book.title}>{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <p className="book-price">${book.price}</p>
            <div className="book-actions">
              <button className="book-button" onClick={() => navigate(`/book/${book._id}`, { state: book })}>
                Xem chi tiết
              </button>
              <button className="book-button" onClick={() => addToCart(book)}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
