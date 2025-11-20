"use client";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function AuthErrorPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message") || "Đăng nhập thất bại ";

    Swal.fire({
      icon: "error",
      title: "Đăng nhập thất bại ",
      text: message,
      confirmButtonText: "Quay lại đăng nhập",
    }).then(() => {
      window.location.href = "/login"; // quay về trang login
    });
  }, []);

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <p className="text-lg text-red-600">Đang xử lý...</p>
    </div>
  );
}
