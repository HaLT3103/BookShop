import React, { useState, useEffect } from "react";
import "../../styles/BookTable.css";

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...user });
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật user thất bại!");
      onSave(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="book-edit-modal">
      <div className="book-edit-modal-content">
        <h3>Chỉnh sửa user</h3>
        <form onSubmit={handleSubmit} className="book-edit-form">
          <label>UserID:<input name="userId" value={form.userId || ""} onChange={handleChange} /></label>
          <label>Họ tên:<input name="name" value={form.name || ""} onChange={handleChange} required /></label>
          <label>Tuổi:<input name="age" type="number" value={form.age || ""} onChange={handleChange} /></label>
          <label>SĐT:<input name="phone" value={form.phone || ""} onChange={handleChange} /></label>
          <label>Email:<input name="email" value={form.email || ""} onChange={handleChange} required /></label>
          {/* Không cho sửa mật khẩu ở đây */}
          {error && <div className="book-edit-error">{error}</div>}
          <div className="book-edit-actions">
            <button type="submit" className="book-edit-btn">Lưu</button>
            <button type="button" className="book-delete-btn" onClick={onCancel}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditForm;
