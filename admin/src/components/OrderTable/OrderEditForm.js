import React, { useState } from "react";

const statusOptions = [
  { value: "pending", label: "Đã đặt hàng" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" }
];

const OrderEditForm = ({ order, onSave, onCancel }) => {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.note || "");

  return (
    <div className="order-edit-form">
      <div className="order-edit-row">
        <label>Trạng thái:</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="order-edit-input">
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="order-edit-row">
        <label>Ghi chú:</label>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          className="order-edit-input"
          placeholder="Ghi chú đơn hàng (nếu có)"
        />
      </div>
      <div className="order-edit-actions">
        <button className="order-edit-save" onClick={() => onSave(status, note)}>Lưu</button>
        <button className="order-edit-cancel" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  );
};

export default OrderEditForm;
