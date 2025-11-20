"use client";
import { useEffect } from "react";
import { Spinner } from "../components/ui/spinner";
import { toast } from "sonner";
import API_CART from "~/api/Cart";
export default function AuthSuccess() {
  useEffect(() => {
    const syncAndRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const redirect = params.get("redirect") || "/cart";

      if (!token) return (window.location.href = "/login");

      localStorage.setItem("token", token);

      const savedCart = sessionStorage.getItem("pending_cart");
      if (savedCart) {
        try {
          // Gọi API sync bằng axios instance
          await API_CART.post("/cart/sync", {
            cart: JSON.parse(savedCart),
          });

          // Xóa cart tạm sau khi đồng bộ thành công
          sessionStorage.removeItem("pending_cart");
        } catch (err) {
          console.error("Sync giỏ hàng thất bại:", err);
          toast.error("Đồng bộ giỏ hàng thất bại!");
        }
      }

      // redirect sau khi sync xong
      window.location.href = redirect;
    };

    syncAndRedirect();
  }, []);

  return (
    <div className="flex w-full h-screen flex-col gap-4 justify-center items-center">
      <Spinner className="size-6 text-green-500" /> Đang xử lý đăng nhập...
    </div>
  );
}
