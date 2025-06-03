import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AddressTable.css";
import AddressEditForm from "./AddressEditForm";

const AddressTable = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editDefault, setEditDefault] = useState("");
  const [editOthers, setEditOthers] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/address", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
      } catch {
        setAddresses([]);
      }
      setLoading(false);
    };
    fetchAddresses();
  }, []);

  // Sửa địa chỉ (admin)
  const handleEdit = async (addressId, newDefault, newOthers) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(`http://localhost:5000/api/admin/address/${addressId}`, {
        defaultAddress: newDefault,
        otherAddresses: newOthers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prev => prev.map(a => a._id === addressId ? res.data : a));
    } catch {
      alert("Cập nhật địa chỉ thất bại!");
    }
  };

  // Xóa địa chỉ (admin) - sửa lại endpoint cho đúng
  const handleDelete = async (addressId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/address/admin/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prev => prev.filter(a => a._id !== addressId));
    } catch {
      alert("Xóa địa chỉ thất bại!");
    }
  };

  const startEdit = (addr) => {
    setEditingId(addr._id);
    setEditDefault(addr.defaultAddress);
    setEditOthers((addr.otherAddresses || []).join(", "));
    setShowDialog(true);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditDefault("");
    setEditOthers("");
    setShowDialog(false);
  };
  const saveEdit = async (id, newDefault, newOthers) => {
    await handleEdit(id, newDefault, newOthers);
    cancelEdit();
  };

  return (
    <div className="address-table-container">
        <h2>Danh sách địa chỉ</h2>
      <div>
        {loading ? <p>Đang tải...</p> : addresses.length === 0 ? <p>Không có địa chỉ nào.</p> : (
          <table className="address-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Địa chỉ mặc định</th>
                <th>Địa chỉ khác</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(addr => (
                <tr key={addr._id}>
                  <td>{addr.userId?.name || addr.userId?.email || addr.userId}</td>
                  <td>{addr.defaultAddress}</td>
                  <td>{(addr.otherAddresses || []).join(", ")}</td>
                  <td className="address-table-actions">
                    <button onClick={() => startEdit(addr)}>Sửa</button>
                    <button className="delete" onClick={() => handleDelete(addr._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showDialog && (
        <div className="address-edit-dialog-backdrop">
          <div className="address-edit-dialog">
            <h3>Sửa địa chỉ</h3>
            <AddressEditForm
              defaultAddress={editDefault}
              otherAddresses={editOthers.split(",").map(s => s.trim()).filter(Boolean)}
              onSave={(newDefault, newOthers) => saveEdit(editingId, newDefault, newOthers)}
              onCancel={cancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTable;
