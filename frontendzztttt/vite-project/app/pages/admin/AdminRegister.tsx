// src/pages/AdminRegister.jsx
import React, { useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3009/api/admin/register",
        { name, email, password }
      );

      Swal.fire({
        title: " Đăng ký thành công!",
        text: "Tài khoản admin của bạn đã được tạo. Hệ thống sẽ chuyển đến trang đăng nhập.",
        icon: "success",
        showConfirmButton: true,
        timer: 2500,
        timerProgressBar: true,
        background: "#f9fafb",
        confirmButtonText: "Đóng",
        color: "#1e293b",
      });

      localStorage.setItem("adminToken", response.data.token);

      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2500);
    } catch (err) {
      Swal.fire({
        title: " Đăng ký thất bại",
        text: err.response?.data?.message || "Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "Đóng",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordToggle = (show, setShow) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {show ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Admin Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin Name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pr-12 h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {renderPasswordToggle(showPassword, setShowPassword)}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pr-12 h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {renderPasswordToggle(showConfirm, setShowConfirm)}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* Link to login */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Đã có tài khoản?{" "}
          </span>
          <a href="/admin/login" className="text-indigo-600 hover:underline">
            Đăng nhập
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Admin
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
