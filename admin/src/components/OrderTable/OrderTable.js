import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/OrderTable.css";
import OrderEditForm from "./OrderEditForm";

const statusMap = {
  pending: "Đã đặt hàng",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy"
};

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/order", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(`http://localhost:5000/api/admin/order/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/order/admin/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch {
      alert("Xóa đơn hàng thất bại!");
    }
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditOrder(order);
    setShowDialog(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditOrder(null);
    setShowDialog(false);
  };

  const saveEdit = async (id, status, note) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(`http://localhost:5000/api/admin/order/admin/${id}`, { status, note }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: res.data.status, note: res.data.note } : o));
      cancelEdit();
    } catch {
      alert("Cập nhật đơn hàng thất bại!");
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="order-table-container">
      <div style={{ margin: "16px 0" }}>
        <label>Lọc theo trạng thái: </label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          {Object.entries(statusMap).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        {loading ? <p>Đang tải...</p> : filteredOrders.length === 0 ? <p>Không có đơn hàng.</p> : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Địa chỉ</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.name || order.userId?.email || order.userId}</td>
                  <td>{order.addressId?.defaultAddress || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td><span className={`order-table-status ${order.status}`}>{statusMap[order.status] || order.status}</span></td>
                  <td>
                    <ul className="order-table-products">
                      {order.items.map((item, idx) => (
                        <li key={item.bookId?._id || idx} className="order-table-product-item">
                          <span className="order-list-product-title">{item.title}</span> x {item.quantity}
                          <span className="order-list-product-price">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="order-table-total">
                    ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </td>
                  <td className="order-table-actions">
                    <button className="edit-button" onClick={() => startEdit(order)}>Sửa</button>
                    <button className="delete-button" onClick={() => handleDelete(order._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showDialog && editOrder && (
        <div className="order-edit-dialog-backdrop">
          <div className="order-edit-dialog">
            <h3>Sửa đơn hàng</h3>
            <OrderEditForm
              order={editOrder}
              onSave={(status, note) => saveEdit(editingId, status, note)}
              onCancel={cancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
