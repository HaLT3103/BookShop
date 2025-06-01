import React, { useEffect, useState } from "react";
import "../../styles/BookTable.css";
import sortIcon from "../../assets/sort.svg";
import UserAddForm from "./UserAddForm";
import UserEditForm from "./UserEditForm";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi tải user!");
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortField) return users;
    const sorted = [...users].sort((a, b) => {
      if (["name", "email", "phone"].includes(sortField)) {
        const aVal = (a[sortField] || "").toLowerCase();
        const bVal = (b[sortField] || "").toLowerCase();
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "age" || sortField === "userId") {
        const aVal = Number(a[sortField] || 0);
        const bVal = Number(b[sortField] || 0);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [users, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // CRUD logic
  const handleAddSave = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setShowAdd(false);
  };
  const handleAddCancel = () => setShowAdd(false);

  const handleEdit = (user) => setEditingUser(user);
  const handleEditSave = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    setEditingUser(null);
  };
  const handleEditCancel = () => setEditingUser(null);

  const handleDelete = (user) => setDeletingUser(user);
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${deletingUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa user thất bại!");
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
      setDeletingUser(null);
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeleteCancel = () => setDeletingUser(null);

  return (
    <div className="book-table-container">
      <div className="book-table-header-row">
        <h3>Danh sách User</h3>
        <button className="book-add-btn" onClick={() => setShowAdd(true)}>+ Thêm user mới</button>
      </div>
      {showAdd && (
        <UserAddForm onSave={handleAddSave} onCancel={handleAddCancel} />
      )}
      {editingUser && (
        <UserEditForm user={editingUser} onSave={handleEditSave} onCancel={handleEditCancel} />
      )}
      {deletingUser && (
        <div className="book-edit-modal">
          <div className="book-edit-modal-content">
            <h3>Xác nhận xóa user</h3>
            <p>Bạn có chắc chắn muốn xóa user "{deletingUser.name}"?</p>
            <div className="book-edit-actions">
              <button className="book-delete-btn" onClick={handleDeleteConfirm}>Xóa</button>
              <button className="book-edit-btn" onClick={handleDeleteCancel}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <table className="book-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("userId")}
                    className={sortField === "userId" ? `sortable ${sortOrder}` : "sortable"}>
                  UserID
                  <img src={sortIcon} alt="sort" className={sortField === "userId" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("name")}
                    className={sortField === "name" ? `sortable ${sortOrder}` : "sortable"}>
                  Họ tên
                  <img src={sortIcon} alt="sort" className={sortField === "name" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("age")}
                    className={sortField === "age" ? `sortable ${sortOrder}` : "sortable"}>
                  Tuổi
                  <img src={sortIcon} alt="sort" className={sortField === "age" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("phone")}
                    className={sortField === "phone" ? `sortable ${sortOrder}` : "sortable"}>
                  SĐT
                  <img src={sortIcon} alt="sort" className={sortField === "phone" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th onClick={() => handleSort("email")}
                    className={sortField === "email" ? `sortable ${sortOrder}` : "sortable"}>
                  Email
                  <img src={sortIcon} alt="sort" className={sortField === "email" ? `sort-icon active ${sortOrder}` : "sort-icon"} />
                </th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="book-edit-btn" onClick={() => handleEdit(user)}>Sửa</button>
                    <button className="book-delete-btn" onClick={() => handleDelete(user)}>Xóa</button>
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
    </div>
  );
};

export default UserTable;
