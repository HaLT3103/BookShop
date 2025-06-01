import React from "react";
import "../App.css";
import "../styles/Topbar.css";

const AdminTopbar = ({ onLogout }) => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser"));
  return (
    <div className="admin-topbar">
      <div className="admin-topbar-left">
        <span className="admin-logo">BookShop Admin</span>
      </div>
      <div className="admin-topbar-right">
        <span className="admin-username">{adminUser?.username}</span>
        <button className="admin-logout-btn" onClick={onLogout}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default AdminTopbar;
