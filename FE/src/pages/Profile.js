import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import ProfileInfo from "../components/ProfileInfo";
import OrderList from "../components/OrderList";
import ChangePassword from "../components/ChangePassword";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, [navigate]);

  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="profile-page-layout">
      <div className="profile-sidebar">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Thông tin cá nhân</button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Đơn hàng</button>
        <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>Đổi mật khẩu</button>
      </div>
      <div className="profile-content">
        {activeTab === "profile" && (
          <ProfileInfo user={user} setUser={setUser} />
        )}
        {activeTab === "orders" && (
          <OrderList userId={user._id} />
        )}
        {activeTab === "password" && (
          <ChangePassword userId={user._id} />
        )}
      </div>
    </div>
  );
};

export default Profile;