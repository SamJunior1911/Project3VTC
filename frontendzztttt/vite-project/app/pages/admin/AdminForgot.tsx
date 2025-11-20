import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin!",
        text: "Vui lòng nhập email của bạn.",
        confirmButtonColor: "#6366f1", // màu tím
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3009/api/admin/forgot-password",
        { email }
      );

      Swal.fire({
        icon: "success",
        title: "Yêu cầu đã được gửi!",
        text: res.data.message || "Kiểm tra email của bạn để đặt lại mật khẩu.",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        // Chuyển sang trang nhập mã OTP + mật khẩu mới
        window.location.href = `/admin/reset-password?email=${encodeURIComponent(email)}`;
      });
      setEmail("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Không thể gửi yêu cầu",
        text: err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            {loading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu khôi phục"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Nhớ lại mật khẩu?{" "}
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

export default ForgotPassword;
