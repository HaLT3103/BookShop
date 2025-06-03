import React, { useState } from "react";

const AddressEditForm = ({
  defaultAddress = "",
  otherAddresses = [],
  onSave,
  onCancel
}) => {
  const [editDefault, setEditDefault] = useState(defaultAddress);
  const [editOthers, setEditOthers] = useState(otherAddresses.join(", "));

  return (
    <div className="address-edit-form">
      <div className="address-edit-row">
        <label>Địa chỉ mặc định:</label>
        <input
          value={editDefault}
          onChange={e => setEditDefault(e.target.value)}
          className="address-edit-input"
        />
      </div>
      <div className="address-edit-row">
        <label>Địa chỉ khác:</label>
        <input
          value={editOthers}
          onChange={e => setEditOthers(e.target.value)}
          className="address-edit-input"
          placeholder="Cách nhau bởi dấu phẩy"
        />
      </div>
      <div className="address-edit-actions">
        <button className="address-edit-save" onClick={() => onSave(editDefault, editOthers.split(",").map(s => s.trim()).filter(Boolean))}>Lưu</button>
        <button className="address-edit-cancel" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  );
};

export default AddressEditForm;
