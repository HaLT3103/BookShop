import React, { useState } from "react";
import "../App.css";

const AdminAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password || (!isLogin && !form.confirmPassword)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/admin/login"
        : "http://localhost:5000/api/auth/admin/register";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập/Đăng ký thất bại!");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      onAuthSuccess && onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-auth-container">
      <h2>{isLogin ? "Đăng nhập Admin" : "Đăng ký Admin"}</h2>
      <form className="admin-auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        )}
        {error && <div className="admin-auth-error">{error}</div>}
        <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      </form>
      <div className="admin-auth-toggle">
        {isLogin ? (
          <span>
            Chưa có tài khoản?{' '}
            <button type="button" onClick={() => setIsLogin(false)}>
              Đăng ký
            </button>
          </span>
        ) : (
          <span>
            Đã có tài khoản?{' '}
            <button type="button" onClick={() => setIsLogin(true)}>
              Đăng nhập
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
