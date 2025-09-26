// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const AppInner: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogin = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 text-white p-8">
        <h2 className="text-4xl font-bold mb-6">Welcome Back 👋</h2>

        <div className="w-full max-w-md bg-white text-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Login</h3>
          <Login onLogin={handleLogin} />
        </div>

        <div className="w-full max-w-md bg-white text-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Register</h3>
          <Register onRegister={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between items-center shadow">
        <div className="font-bold">Chatbot Platform</div>
        <div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;
