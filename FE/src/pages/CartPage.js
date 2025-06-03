import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      setCart([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.items) {
        setCart(data.items.map(item => ({
          ...item.bookId,
          quantity: item.quantity
        })));
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user._id}/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (res.ok && data.items) {
        setCart(data.items.map(item => ({
          ...item.bookId,
          quantity: item.quantity
        })));
      } else {
        // Nếu không còn item nào, gọi lại fetchCart để đồng bộ
        fetchCart();
      }
    } catch {
      fetchCart();
    }
  };

  const getTotalPrice = () => {
    if (!cart || cart.length === 0) return '0.00';
    return cart.reduce((total, book) => total + (book.price * (book.quantity || 1)), 0).toFixed(2);
  };

  if (loading) return <div className="cart-page"><h1 className="cart-title">Giỏ hàng</h1><p>Đang tải...</p></div>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">Giỏ hàng</h1>
      {cart.length === 0 ? (
        <p className="cart-empty">Giỏ hàng trống</p>
      ) : (
        <div className="cart-list">
          {cart.map((book, index) => (
            <div key={index} className="cart-item">
              <img src={book.cover} alt={book.title} className="cart-image" />
              <div className="cart-details">
                <h3 className="cart-book-title">{book.title}</h3>
                <p className="cart-book-price">Giá: ${book.price}</p>
                <p className="cart-book-quantity">Số lượng: {book.quantity || 1}</p>
                <button className="cart-remove-button" onClick={() => removeFromCart(book._id)}>
                  Xóa
                </button>
                <button className="cart-detail-button" onClick={() => navigate(`/book/${book._id}`, { state: book })}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
          <h2 className="cart-total">Tổng giá: ${getTotalPrice()}</h2>
          <button className="cart-checkout-button" onClick={() => navigate("/order", { state: { cart } })}>Thanh toán</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;