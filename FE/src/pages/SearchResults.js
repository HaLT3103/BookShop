import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Dùng chung CSS với HomePage

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/books") // Gọi API từ backend
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query")?.toLowerCase() || "";

    if (query) {
      const results = books.filter((book) =>
        book.title.toLowerCase().includes(query)
      );
      setFilteredBooks(results);
    }
  }, [location.search, books]);

  return (
    <div className="home-page">
      <h1 className="page-title">Kết quả tìm kiếm</h1>
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

export default SearchResults;
