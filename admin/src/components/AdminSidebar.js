import React from "react";
import "../App.css";
import "../styles/Sidebar.css";

const sidebarItems = [
  { key: "books", label: "Quản lý Sách" },
  { key: "users", label: "Quản lý Tài khoản" },
  { key: "carts", label: "Quản lý Giỏ hàng" },
  { key: "orders", label: "Quản lý Đơn hàng" },
  { key: "addresses", label: "Quản lý Địa chỉ giao hàng" },
  // Có thể thêm các mục khác như Thống kê, Người dùng...
];

const AdminSidebar = ({ selected, onSelect }) => (
  <div className="admin-sidebar">
    <div className="admin-sidebar-title">Dashboard</div>
    <ul className="admin-sidebar-list">
      {sidebarItems.map((item) => (
        <li
          key={item.key}
          className={selected === item.key ? "active" : ""}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  </div>
);

export default AdminSidebar;
