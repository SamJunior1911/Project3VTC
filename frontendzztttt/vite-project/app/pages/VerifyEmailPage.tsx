import React, { useEffect, useState } from "react";
import axios from "axios";
import API_CUSTOMER from "~/api/Customer";
const VerifyEmailPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Lấy token từ URL trực tiếp
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không tồn tại.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await API_CUSTOMER.get(`/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message || "Xác thực email thành công!");

        // Redirect sau 3s về login
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Xác thực email thất bại.");

        // Redirect sau 3s về register
        setTimeout(() => {
          window.location.href = "/register";
        }, 3000);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4">
      {status === "loading" && (
        <p className="text-orange-600">Đang xác thực email...</p>
      )}

      {status === "success" && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Thành công!
          </h2>
          <p className="mb-6">{message}</p>
          <p className="text-sm text-gray-500">
            Đang chuyển về trang đăng nhập...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Thất bại!</h2>
          <p className="mb-6">{message}</p>
          <p className="text-sm text-gray-500">
            Đang chuyển về trang đăng ký...
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
