import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const parsePriceRange = (priceStr) => {
  if (priceStr === "0-10") return { min: 0, max: 10 };
  if (priceStr === "10-20") return { min: 10, max: 20 };
  if (priceStr === ">20") return { min: 20, max: Infinity };
  return { min: 0, max: Infinity };
};

const FilterPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => setBooks([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const price = params.get("price");
    const { min, max } = parsePriceRange(price);
    setFilteredBooks(
      books.filter((book) => {
        const p = Number(book.price);
        return p >= min && p <= max;
      })
    );
  }, [location.search, books]);

  return (
    <div className="home-page">
      <h1 className="page-title">Lọc theo giá</h1>
      {filteredBooks.length > 0 ? (
        <div className="book-list">
          {filteredBooks.map((book) => (
            <div key={book._id} className="book-card">
              <img src={book.cover} alt={book.title} className="book-image" />
              <h3 className="book-title" title={book.title}>{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-price">${book.price}</p>
              <div className="book-actions">
                <button className="book-button" onClick={() => navigate(`/book/${book._id}`, { state: book })}>
                  Xem chi tiết
                </button>
                <button className="book-button">Thêm vào giỏ hàng</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">Không tìm thấy sách nào phù hợp.</p>
      )}
    </div>
  );
};

export default FilterPage;
