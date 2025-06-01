import React, { useState } from "react";
import "../../styles/CartTable.css";

const CartEditForm = ({ cart, onSave, onCancel }) => {
  const [userIdStr, setUserIdStr] = useState(cart.userIdStr || "");
  const [items, setItems] = useState(cart.items || []);
  const [newBookIdStr, setNewBookIdStr] = useState("");
  const [newBookQty, setNewBookQty] = useState(1);

  const handleQuantityChange = (idx, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, quantity: Math.max(1, Number(value) || 1) } : item
      )
    );
  };

  const handleRemoveBook = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddBook = () => {
    if (!newBookIdStr.trim()) return;
    if (items.some(item => item.bookIdStr === newBookIdStr.trim())) return;
    setItems(prev => [...prev, { bookIdStr: newBookIdStr.trim(), quantity: Math.max(1, Number(newBookQty) || 1) }]);
    setNewBookIdStr("");
    setNewBookQty(1);
  };

  const handleSave = () => {
    onSave({ ...cart, userIdStr, items });
  };

  return (
    <div className="cart-edit-form-modal">
      <h3>{cart._id ? "Chỉnh sửa Cart" : "Thêm mới Cart"}</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500 }}>User ID (string): </label>
        <input
          type="text"
          value={userIdStr}
          onChange={e => setUserIdStr(e.target.value)}
          placeholder="Nhập userId"
          style={{ marginLeft: 8, width: 200 }}
        />
      </div>
      <div className="add-book-row">
        <input
          type="text"
          placeholder="Book ID"
          value={newBookIdStr}
          onChange={e => setNewBookIdStr(e.target.value)}
        />
        <input
          type="number"
          min={1}
          value={newBookQty}
          onChange={e => setNewBookQty(e.target.value)}
        />
        <button type="button" onClick={handleAddBook}>Thêm sách</button>
      </div>
      <table className="cart-edit-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Số lượng</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.bookIdStr || item.bookId || idx}>
              <td>{item.bookIdStr || (typeof item.bookId === 'string' ? item.bookId : (item.bookId && item.bookId._id) || "")}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  style={{ width: 60 }}
                />
              </td>
              <td>
                <button type="button" onClick={() => handleRemoveBook(idx)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <button onClick={handleSave}>Lưu</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default CartEditForm;
