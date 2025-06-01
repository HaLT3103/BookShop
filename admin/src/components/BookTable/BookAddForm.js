import React, { useState } from "react";
import "../../styles/BookTable.css";

const BookAddForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    cover: "",
    price: "",
    genre: "",
    year: "",
    pages: "",
    quantity: "",
    description: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.author || !form.price) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Thêm sách thất bại!");
      onSave(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="book-edit-modal">
      <div className="book-edit-modal-content">
        <h3>Thêm sách mới</h3>
        <form onSubmit={handleSubmit} className="book-edit-form">
          <label>ID:<input name="id" value={form.id || ""} onChange={handleChange} /></label>
          <label>Tiêu đề:<input name="title" value={form.title} onChange={handleChange} required /></label>
          <label>Tác giả:<input name="author" value={form.author} onChange={handleChange} required /></label>
          <label>Ảnh bìa:<input name="cover" value={form.cover} onChange={handleChange} /></label>
          <label>Giá:<input name="price" type="number" value={form.price} onChange={handleChange} required /></label>
          <label>Thể loại:<input name="genre" value={form.genre} onChange={handleChange} /></label>
          <label>Năm xuất bản:<input name="year" type="number" value={form.year} onChange={handleChange} /></label>
          <label>Số trang:<input name="pages" type="number" value={form.pages} onChange={handleChange} /></label>
          <label>Số lượng:<input name="quantity" type="number" value={form.quantity} onChange={handleChange} /></label>
          <label>Mô tả:<textarea name="description" value={form.description} onChange={handleChange} /></label>
          {error && <div className="book-edit-error">{error}</div>}
          <div className="book-edit-actions">
            <button type="submit" className="book-edit-btn">Thêm</button>
            <button type="button" className="book-delete-btn" onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAddForm;
