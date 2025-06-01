import React, { useEffect, useState } from "react";
import "../../styles/BookTable.css";
import BookEditForm from "./BookEditForm";
import BookAddForm from "./BookAddForm";
import sortIcon from "../../assets/sort.svg";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/books");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi tải sách!");
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleEdit = (book) => setEditingBook(book);
  const handleEditSave = (updatedBook) => {
    setBooks((prev) => prev.map((b) => (b._id === updatedBook._id ? updatedBook : b)));
    setEditingBook(null);
  };
  const handleEditCancel = () => setEditingBook(null);

  const handleAddSave = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
    setShowAdd(false);
  };
  const handleAddCancel = () => setShowAdd(false);

  const handleDelete = (book) => setDeletingBook(book);
  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      const res = await fetch(`http://localhost:5000/api/books/${deletingBook._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa sách thất bại!");
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeletingBook(null);
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteCancel = () => setDeletingBook(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedBooks = React.useMemo(() => {
    if (!sortField) return books;
    const sorted = [...books].sort((a, b) => {
      if (sortField === "title" || sortField === "author") {
        const aVal = (a[sortField] || "").toLowerCase();
        const bVal = (b[sortField] || "").toLowerCase();
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "id") {
        const aVal = (a.id || "").toLowerCase();
        const bVal = (b.id || "").toLowerCase();
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else {
        // price, quantity
        const aVal = Number(a[sortField] || 0);
        const bVal = Number(b[sortField] || 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
    });
    return sorted;
  }, [books, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const paginatedBooks = sortedBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="book-table-container">
      <div className="book-table-header-row">
        <h3>Danh sách Sách</h3>
        <button className="book-add-btn" onClick={() => setShowAdd(true)}>+ Thêm sách mới</button>
      </div>
      {showAdd && (
        <BookAddForm onSave={handleAddSave} onCancel={handleAddCancel} />
      )}
      {editingBook && (
        <BookEditForm book={editingBook} onSave={handleEditSave} onCancel={handleEditCancel} />
      )}
      {deletingBook && (
        <div className="book-edit-modal">
          <div className="book-edit-modal-content">
            <h3>Xác nhận xóa sách</h3>
            <p>Bạn có chắc chắn muốn xóa sách "{deletingBook.title}"?</p>
            <div className="book-edit-actions">
              <button className="book-delete-btn" onClick={handleDeleteConfirm}>Xóa</button>
              <button className="book-edit-btn" onClick={handleDeleteCancel}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <table className="book-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}
                    className={sortField === "id" ? `sortable ${sortOrder}` : "sortable"}>
                  ID
                  <img src={sortIcon} alt="sort" className={sortField === "id" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th>Ảnh bìa</th>
                <th onClick={() => handleSort("title")}
                    className={sortField === "title" ? `sortable ${sortOrder}` : "sortable"}>
                  Tên sách
                  <img src={sortIcon} alt="sort" className={sortField === "title" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("author")}
                    className={sortField === "author" ? `sortable ${sortOrder}` : "sortable"}>
                  Tác giả
                  <img src={sortIcon} alt="sort" className={sortField === "author" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("price")}
                    className={sortField === "price" ? `sortable ${sortOrder}` : "sortable"}>
                  Giá
                  <img src={sortIcon} alt="sort" className={sortField === "price" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("quantity")}
                    className={sortField === "quantity" ? `sortable ${sortOrder}` : "sortable"}>
                  Số lượng
                  <img src={sortIcon} alt="sort" className={sortField === "quantity" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.id || ""}</td>
                  <td><img src={book.cover} alt={book.title} style={{ width: 50, height: 70, objectFit: "cover" }} /></td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <button className="book-edit-btn" onClick={() => handleEdit(book)}>Sửa</button>
                    <button className="book-delete-btn" onClick={() => handleDelete(book)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="book-pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookTable;
