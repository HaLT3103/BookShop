import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import cartIcon from '../assets/cart.svg';
import userIcon from '../assets/user.svg';

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Gọi hàm cập nhật user khi component mount
    updateUser();

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload(); // ✅ Reload để cập nhật Navbar
  };

  if (location.pathname === "/login") {
    return null; // Không hiển thị Navbar khi ở trang đăng nhập
  }

  if (location.pathname === "/register") {
    return null; // Không hiển thị Navbar khi ở trang đăng kí
  }

  const hideSearchBar = location.pathname === "/cart" || location.pathname === "/profile";

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">LTH BookShop</Link>
      {!hideSearchBar && (
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">🔍</button>
        </div>
      )}
      <div className="navbar-links">
        {user ? (
          <div className="user-info">
            <Link to="/cart" className="navbar-link" title="Giỏ hàng">
              <img src={cartIcon} alt="Cart" style={{ width: 22, height: 22, verticalAlign: 'middle' }} />
            </Link>
            <Link to="/profile" className="navbar-link" title={user.name}>
              <img src={userIcon} alt="User" style={{ width: 22, height: 22, verticalAlign: 'middle', marginRight: 4 }} />
            </Link>
            <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Đăng nhập</Link>
            <Link to="/register" className="navbar-link">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
