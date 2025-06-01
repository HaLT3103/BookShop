import React, { useEffect, useState } from "react";
import "../../styles/BookTable.css";
import "../../styles/CartTable.css";
import sortIcon from "../../assets/sort.svg";
import CartEditForm from "./CartEditForm";

const CartTable = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const cartsPerPage = 10;
  const [editingCart, setEditingCart] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/admin/carts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi tải cart!");
        setCarts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedCarts = React.useMemo(() => {
    if (!sortField) return carts;
    const sorted = [...carts].sort((a, b) => {
      if (["userIdStr"].includes(sortField)) {
        const aVal = (a[sortField] || "").toLowerCase();
        const bVal = (b[sortField] || "").toLowerCase();
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "total") {
        // sort theo tổng số lượng sách trong cart
        const aVal = a.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
        const bVal = b.items.reduce((sum, i) => sum + (i.quantity || 0), 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [carts, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedCarts.length / cartsPerPage);
  const paginatedCarts = sortedCarts.slice((currentPage - 1) * cartsPerPage, currentPage * cartsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEdit = (cart) => {
    setEditingCart(cart);
    setShowEditForm(true);
  };

  const handleAddCart = () => {
    setEditingCart({ userIdStr: "", items: [] });
    setShowAddForm(true);
  };

  const handleEditSave = async (updatedCart) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/carts/${updatedCart._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedCart.items })
      });
      if (!res.ok) throw new Error("Cập nhật cart thất bại!");
      setCarts((prev) => prev.map((c) => (c._id === updatedCart._id ? { ...c, items: updatedCart.items } : c)));
      setShowEditForm(false);
      setEditingCart(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSave = async (newCart) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCart)
      });
      if (!res.ok) throw new Error("Tạo giỏ hàng thất bại!");
      const data = await res.json();
      setCarts((prev) => [data, ...prev]);
      setShowAddForm(false);
      setEditingCart(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (cartId) => {
    if (!window.confirm("Bạn có chắc muốn xóa cart này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/carts/${cartId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa cart thất bại!");
      setCarts((prev) => prev.filter((c) => c._id !== cartId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="book-table-container">
      <div className="book-table-header-row">
        <h3>Danh sách Cart</h3>
        <button onClick={handleAddCart} style={{ float: "right", marginTop: 4 }}>+ Thêm giỏ hàng</button>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <table className="book-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("userIdStr")}
                    className={sortField === "userIdStr" ? `sortable ${sortOrder}` : "sortable"}>
                  UserID
                  <img src={sortIcon} alt="sort" className={sortField === "userIdStr" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th>Tên user</th>
                <th onClick={() => handleSort("total")}
                    className={sortField === "total" ? `sortable ${sortOrder}` : "sortable"}>
                  Tổng số lượng sách
                  <img src={sortIcon} alt="sort" className={sortField === "total" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th>Số loại sách</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCarts.map((cart) => (
                <tr key={cart._id}>
                  <td>
                    {cart.userIdStr ||
                      (cart.userId && (cart.userId.userIdStr || cart.userId.userId)) ||
                      (cart.userId && cart.userId._id) ||
                      ""}
                  </td>
                  <td>{cart.userId && cart.userId.name}</td>
                  <td>{cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0)}</td>
                  <td>{cart.items.length}</td>
                  <td>
                    <button onClick={() => handleEdit(cart)}>Sửa</button>
                    <button onClick={() => handleDelete(cart._id)} style={{ marginLeft: 8 }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="book-pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
          </div>
        </>
      )}
      {(showEditForm || showAddForm) && editingCart && (
        <div className="modal-bg">
          <CartEditForm
            cart={editingCart}
            onSave={showAddForm ? handleAddSave : handleEditSave}
            onCancel={() => { setShowEditForm(false); setShowAddForm(false); setEditingCart(null); }}
          />
        </div>
      )}
    </div>
  );
};

export default CartTable;
