import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      Swal.fire(
        "Thiếu thông tin!",
        "Vui lòng điền đầy đủ các trường.",
        "warning"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Lỗi!", "Mật khẩu và xác nhận mật khẩu không khớp.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3009/api/admin/reset-password",
        {
          email,
          resetCode,
          newPassword,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: res.data.message || "Mật khẩu đã được cập nhật.",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        // 🔁 Chuyển về trang đăng nhập sau khi đổi mật khẩu thành công
        window.location.href = "/admin/login";
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: err.response?.data?.message || "Không thể đặt lại mật khẩu.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Đặt lại mật khẩu
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-8">
          Nhập mã xác nhận được gửi đến email của bạn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Mã xác nhận (6 số)
            </label>
            <input
              type="text"
              placeholder="Nhập mã xác nhận"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-200 font-medium">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          Quay lại{" "}
          <a
            href="/admin/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
