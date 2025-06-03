import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OrderList.css";

const statusMap = {
  all: "Tất cả",
  pending: "Đã đặt hàng",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy"
};

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/order/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    if (userId) fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/order/${userId}/${orderId}`, { status: "cancelled" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "cancelled" } : o));
    } catch {
      alert("Hủy đơn hàng thất bại!");
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (!orders.length) return <p>Bạn chưa có đơn hàng nào.</p>;

  return (
    <div>
      <h2>Đơn hàng của bạn</h2>
      <div style={{ margin: "16px 0" }}>
        <label>Lọc theo trạng thái: </label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {Object.entries(statusMap).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="order-list-container">
        {filteredOrders.length === 0 ? <p>Không có đơn hàng phù hợp.</p> : filteredOrders.map(order => (
          <div key={order._id} className="order-list-item">
            <div className="order-list-header">
              Mã đơn hàng: {order._id}
              <span className="order-list-status">{statusMap[order.status] || statusMap['pending']}</span>
            </div>
            <div className="order-list-date">
              <b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="order-list-address">
              <b>Địa chỉ giao hàng:</b> {order.addressId?.defaultAddress || 'N/A'}
            </div>
            <div className="order-list-payment">
              <b>Phương thức thanh toán:</b> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
            </div>
            {order.note && <div className="order-list-note"><b>Ghi chú:</b> {order.note}</div>}
            <div>
              <b>Sản phẩm:</b>
              <ul className="order-list-products">
                {order.items.map((item, idx) => (
                  <li key={item.bookId?._id || idx} className="order-list-product-item">
                    <span className="order-list-product-title">{item.title}</span> x {item.quantity}
                    <span className="order-list-product-price">${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-list-total">
              Tổng tiền: ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            {order.status === "pending" && (
              <button className="order-cancel-btn" onClick={() => handleCancelOrder(order._id)}>
                Hủy đơn hàng
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
