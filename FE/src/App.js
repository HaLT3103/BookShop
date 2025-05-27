// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import BookDetailPage from "./pages/BookDetailPage";
import SearchResults from "./pages/SearchResults";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import "./styles/App.css";

const App = () => {
  return (
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/book/:id" element={<BookDetailPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
};

export default App;
