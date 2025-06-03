import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/OrderPage.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy cart từ database
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      axios.get(`http://localhost:5000/api/cart/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data && res.data.items) {
          setCart(res.data.items.map(item => ({ ...item.bookId, quantity: item.quantity })));
        } else {
          setCart([]);
        }
      });
      // Lấy địa chỉ
      axios.get(`http://localhost:5000/api/address/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setAddresses(res.data);
        if (res.data.length > 0) setSelectedAddress(res.data[0]._id);
      });
    }
  }, []);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`http://localhost:5000/api/address/${user._id}`, {
        defaultAddress: newAddress,
        otherAddresses: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddress(res.data._id);
      setShowAddAddress(false);
      setNewAddress("");
    } catch {
      alert("Thêm địa chỉ thất bại!");
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, book) => total + (book.price * (book.quantity || 1)), 0).toFixed(2);
  };

  const handleOrder = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    try {
      const items = cart.map(book => ({
        bookId: book._id,
        title: book.title,
        price: book.price,
        quantity: book.quantity || 1,
        cover: book.cover
      }));
      await axios.post(`http://localhost:5000/api/order/${user._id}`, {
        items,
        addressId: selectedAddress,
        paymentMethod,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Đặt hàng thành công!");
      navigate("/profile", { state: { tab: "orders" } });
    } catch (err) {
      alert("Đặt hàng thất bại!");
    }
    setLoading(false);
  };

  return (
    <div className="order-page-layout">
      {/* Cột trái: Sản phẩm */}
      <div className="order-products">
        <h2>Thông tin sản phẩm</h2>
        {cart.length === 0 ? <p>Không có sản phẩm nào.</p> : (
          <>
            {cart.map((book, idx) => (
              <div key={book._id || idx} className="order-product-item">
                <img src={book.cover} alt={book.title} />
                <div style={{ flex: 1 }}>
                  <div className="order-product-title">{book.title}</div>
                  <div className="order-product-qty">Số lượng: {book.quantity || 1}</div>
                </div>
                <div className="order-product-price">${book.price}</div>
              </div>
            ))}
            <div className="order-total"></div>
            <div className="order-total">Tổng tiền: <span style={{ color: '#3358e6' }}>${getTotalPrice()}</span></div>
          </>
        )}
      </div>
      {/* Cột phải: Thông tin giao hàng */}
      <div className="order-info">
        <h2>Thông tin giao hàng</h2>
        <div style={{ marginBottom: 18 }}>
          <label>Địa chỉ giao hàng:</label>
          <select value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)}>
            {addresses.map(addr => (
              <option key={addr._id} value={addr._id}>{addr.defaultAddress}</option>
            ))}
          </select>
          {showAddAddress ? (
            <div style={{ marginTop: 10 }}>
              <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Nhập địa chỉ mới..." />
              <button onClick={handleAddAddress} className="modal-save-btn">Lưu</button>
              <button onClick={() => setShowAddAddress(false)} className="modal-cancel-btn">Hủy</button>
            </div>
          ) : (
            <button onClick={() => setShowAddAddress(true)} className="profile-edit-btn">Thêm địa chỉ mới</button>
          )}
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Phương thức thanh toán:</label>
          <div style={{ marginTop: 6 }}>
            <label style={{ marginRight: 18 }}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")}/>
              Thanh toán khi nhận hàng
            </label>
            <label>
              <input type="radio" name="payment" value="BANK" checked={paymentMethod === "BANK"} onChange={() => setPaymentMethod("BANK")}/>
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Ghi chú:</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Ghi chú cho đơn hàng (nếu có)..." />
        </div>
        <button className="modal-save-btn" onClick={handleOrder} disabled={loading}>Đặt hàng</button>
      </div>
    </div>
  );
};

export default OrderPage;
