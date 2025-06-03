import React, { useState } from "react";
import axios from "axios";
import "../styles/Profile.css"; // Import the CSS file for styling

const ChangePassword = ({ userId }) => {
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/change-password/${userId}`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        alert("Đổi mật khẩu thành công!");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      alert("Đổi mật khẩu thất bại: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <form className="change-password-form" onSubmit={e => { e.preventDefault(); handleChangePassword(); }}>
      <h2>Đổi mật khẩu</h2>
      <label>Mật khẩu cũ:
        <input type="password" value={passwords.oldPassword} onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })} required />
      </label>
      <label>Mật khẩu mới:
        <input type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
      </label>
      <label>Xác nhận mật khẩu mới:
        <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
      </label>
      <button type="submit" className="modal-save-btn" disabled={loading}>Xác nhận</button>
    </form>
  );
};

export default ChangePassword;
