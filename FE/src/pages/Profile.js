import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(userData);
    }
  }, [navigate]);

  if (!user) return <p>Đang tải...</p>;

  // Hàm cập nhật thông tin cá nhân
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setShowEditModal(false);
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Hàm đổi mật khẩu
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/change-password/${user._id}`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        alert("Đổi mật khẩu thành công!");
        setShowPasswordModal(false);
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Đổi mật khẩu thất bại: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>
      <p><strong>Họ tên:</strong> {user.name}</p>
      <p><strong>Tuổi:</strong> {user.age}</p>
      <p><strong>Số điện thoại:</strong> {user.phone}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button onClick={() => setShowEditModal(true)} className="profile-edit-btn">Thay đổi thông tin</button>
      <button onClick={() => setShowPasswordModal(true)} className="profile-change-password-btn">Đổi mật khẩu</button>

      {/* Hộp thoại chỉnh sửa thông tin */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Chỉnh sửa thông tin</h3>
            <label>Họ tên: <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></label>
            <label>Tuổi: <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} /></label>
            <label>Số điện thoại: <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></label>
            <label>Email: <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></label>
            <button onClick={handleSave} className="modal-save-btn">Lưu</button>
            <button onClick={() => setShowEditModal(false)} className="modal-cancel-btn">Hủy</button>
          </div>
        </div>
      )}

      {/* Hộp thoại đổi mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Đổi mật khẩu</h3>
            <label>Mật khẩu cũ: <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} /></label>
            <label>Mật khẩu mới: <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label>
            <label>Xác nhận mật khẩu mới: <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} /></label>
            <button onClick={handleChangePassword} className="modal-save-btn">Xác nhận</button>
            <button onClick={() => setShowPasswordModal(false)} className="modal-cancel-btn">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;