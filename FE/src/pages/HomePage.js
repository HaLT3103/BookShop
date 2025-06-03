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

  // Gom nhóm sách theo thể loại
  const booksByGenre = books.reduce((acc, book) => {
    const genre = book.genre || "Khác";
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(book);
    return acc;
  }, {});

  // State cho filter giá từng thể loại
  const [priceFilters, setPriceFilters] = useState({});
  const handlePriceFilterChange = (genre, value) => {
    setPriceFilters(prev => ({ ...prev, [genre]: value }));
  };

  // State cho trang hiện tại của từng thể loại
  const [genrePages, setGenrePages] = useState({});
  const handlePageChange = (genre, direction, maxPage) => {
    setGenrePages(prev => {
      const current = prev[genre] || 0;
      let next = current + direction;
      if (next < 0) next = 0;
      if (next > maxPage) next = maxPage;
      return { ...prev, [genre]: next };
    });
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Danh sách</h1>
      {Object.entries(booksByGenre).map(([genre, books]) => {
        const priceFilter = priceFilters[genre] || "all";
        const filteredBooks = books.filter(book => {
          if (priceFilter === "0-10") return book.price <= 10;
          if (priceFilter === "10-20") return book.price > 10 && book.price <= 20;
          if (priceFilter === ">20") return book.price > 20;
          return true;
        });
        const page = genrePages[genre] || 0;
        const booksPerPage = 5;
        const maxPage = Math.max(0, Math.ceil(filteredBooks.length / booksPerPage) - 1);
        const pagedBooks = filteredBooks.slice(page * booksPerPage, (page + 1) * booksPerPage);
        return (
          <div key={genre} className="genre-section">
            <div className="genre-header">
              <h2 className="genre-title">{genre}</h2>
              <select
                value={priceFilter}
                onChange={e => handlePriceFilterChange(genre, e.target.value)}
                className="genre-filter"
              >
                <option value="all">Tất cả giá</option>
                <option value="0-10">0 - 10</option>
                <option value="10-20">10 - 20</option>
                <option value=">20">Trên 20</option>
              </select>
              <div className="genre-arrows">
                <button
                  className="arrow-btn"
                  onClick={() => handlePageChange(genre, -1, maxPage)}
                  disabled={page === 0}
                  aria-label="Trang trước"
                >
                  &#8592;
                </button>
                <button
                  className="arrow-btn"
                  onClick={() => handlePageChange(genre, 1, maxPage)}
                  disabled={page === maxPage}
                  aria-label="Trang sau"
                >
                  &#8594;
                </button>
              </div>
            </div>
            <div className="book-list">
              {pagedBooks.map((book) => (
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
      })}
    </div>
  );
};

export default HomePage;
