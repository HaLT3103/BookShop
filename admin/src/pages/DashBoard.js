import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import BookTable from "../components/BookTable/BookTable";
import UserTable from "../components/UserTable/UserTable";
import CartTable from "../components/CartTable/CartTable";
import OrderTable from "../components/OrderTable/OrderTable";
import AddressTable from "../components/AddressTable/AddressTable";
import "../App.css";
import "../styles/Dashboard.css";

const DashBoard = () => {
  const [selected, setSelected] = useState("books");

  return (
    <div className="admin-dashboard">
      <AdminSidebar selected={selected} onSelect={setSelected} />
      <div className="admin-dashboard-content">
        {selected === "books" && (
          <div>
            <h2>Quản lý Sách</h2>
            <BookTable />
          </div>
        )}
        {selected === "carts" && (
          <div>
            <h2>Quản lý Giỏ hàng</h2>
            <CartTable />
          </div>
        )}
        {selected === "users" && (
          <div>
            <h2>Quản lý Tài khoản</h2>
            <UserTable />
          </div>
        )}
        {selected === "orders" && (
          <div>
            <h2>Quản lý Đơn hàng</h2>
            <OrderTable />
          </div>
        )}
        {selected === "addresses" && (
          <div>
            <h2>Quản lý Địa chỉ giao hàng</h2>
            <AddressTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
