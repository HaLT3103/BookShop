import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileInfo = ({ user, setUser }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(user);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    // Fetch addresses
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/address/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
      } catch (err) {
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [user._id]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setShowEditModal(false);
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/address/${user._id}`, {
        defaultAddress: newAddress,
        otherAddresses: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prev => [...prev, res.data]);
      setShowAddAddress(false);
      setNewAddress("");
    } catch (err) {
      alert("Thêm địa chỉ thất bại!");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      // Lấy địa chỉ được chọn
      const selected = addresses.find(a => a._id === addressId);
      // Đặt lại defaultAddress, otherAddresses
      const res = await axios.put(`http://localhost:5000/api/address/${user._id}/${addressId}`, {
        defaultAddress: selected.defaultAddress,
        otherAddresses: addresses.filter(a => a._id !== addressId).map(a => a.defaultAddress)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Cập nhật lại danh sách địa chỉ
      setAddresses(addresses.map(a => a._id === addressId ? res.data : { ...a, otherAddresses: [...(a.otherAddresses||[]), a.defaultAddress] }));
      // Đưa địa chỉ mặc định lên đầu
      setAddresses(prev => {
        const updated = prev.map(a => a._id === addressId ? res.data : a);
        return [res.data, ...updated.filter(a => a._id !== addressId)];
      });
    } catch (err) {
      alert("Cập nhật địa chỉ mặc định thất bại!");
    }
  };

  return (
    <div>
      <h2>Thông tin cá nhân</h2>
      <p><strong>Họ tên:</strong> {user.name}</p>
      <p><strong>Tuổi:</strong> {user.age}</p>
      <p><strong>Số điện thoại:</strong> {user.phone}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={() => setShowEditModal(true)} className="profile-edit-btn">Thay đổi thông tin</button>
      {/* Địa chỉ giao hàng */}
      <div style={{ marginTop: 32 }}>
        <h3>Địa chỉ giao hàng</h3>
        {addresses.length === 0 && <p>Chưa có địa chỉ giao hàng.</p>}
        {addresses.map((addr, idx) => (
          <div key={addr._id} className={`address-list-item${idx === 0 ? ' default' : ''}`}>
            <div>
              <span>{addr.defaultAddress}</span>
              {idx === 0 && <span className="address-default-label">(Mặc định)</span>}
            </div>
            {idx !== 0 && (
              <button className="address-set-default-btn" onClick={() => handleSetDefault(addr._id)}>Đặt làm mặc định</button>
            )}
          </div>
        ))}
        {showAddAddress ? (
          <div style={{ marginTop: 10 }}>
            <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Nhập địa chỉ mới..." style={{ padding: 6, width: 220, marginRight: 8 }} />
            <button onClick={handleAddAddress} className="modal-save-btn">Lưu</button>
            <button onClick={() => setShowAddAddress(false)} className="modal-cancel-btn">Hủy</button>
          </div>
        ) : (
          <button onClick={() => setShowAddAddress(true)} className="profile-edit-btn" style={{ marginTop: 8 }}>Thêm địa chỉ mới</button>
        )}
      </div>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chỉnh sửa thông tin</h3>
            <label>Họ tên: <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></label>
            <label>Tuổi: <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} /></label>
            <label>Số điện thoại: <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></label>
            <label>Email: <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></label>
            <button onClick={handleSave} className="modal-save-btn">Lưu</button>
            <button onClick={() => setShowEditModal(false)} className="modal-cancel-btn">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
