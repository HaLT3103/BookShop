import React, { useState } from "react";
import "../../styles/BookTable.css";

const UserAddForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    age: "",
    phone: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Thêm user thất bại!");
      onSave(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="book-edit-modal">
      <div className="book-edit-modal-content">
        <h3>Thêm user mới</h3>
        <form onSubmit={handleSubmit} className="book-edit-form">
          <label>UserID:<input name="userId" value={form.userId} onChange={handleChange} /></label>
          <label>Họ tên:<input name="name" value={form.name} onChange={handleChange} required /></label>
          <label>Tuổi:<input name="age" type="number" value={form.age} onChange={handleChange} /></label>
          <label>SĐT:<input name="phone" value={form.phone} onChange={handleChange} /></label>
          <label>Email:<input name="email" value={form.email} onChange={handleChange} required /></label>
          <label>Mật khẩu:<input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
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

export default UserAddForm;
