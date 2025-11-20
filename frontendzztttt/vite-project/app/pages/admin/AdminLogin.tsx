// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import API_ADMIN from "~/api/admin/Account";
import DASHBOARD_URL from "~/api/admin/Dashboard";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API_ADMIN.post("/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      window.location.href = `/dashboard`;
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative w-full">
            <label className="block mb-2 text-gray-700 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pr-12 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
            ></button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Links */}
        <div className=" mt-4 text-sm text-right">
          <a
            href="/admin/forgot-password"
            className="text-indigo-600 hover:underline "
          >
            Quên mật khẩu?
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Admin
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
