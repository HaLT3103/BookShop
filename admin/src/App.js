import React, { useState } from "react";
import AdminAuth from "./components/AdminAuth";
import AdminTopbar from "./components/AdminTopbar";
import DashBoard from "./pages/DashBoard";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("adminToken");
  });

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <AdminTopbar onLogout={handleLogout} />
      <DashBoard />
    </div>
  );
}

export default App;
