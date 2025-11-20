import React, { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Tag, Trash2, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import API_CART from "~/api/Cart";
import API_PRODUCT from "~/api/Product";
import { useNavigate } from "react-router-dom";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";

interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  image?: string;
  stock?: number; // Tạm dùng để kiểm tra tồn kho
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + Math.round(item.price * (1 - item.discount / 100) * item.quantity),
    0
  );

  // Khởi tạo giỏ hàng + sync pending_cart khi đăng nhập
  useEffect(() => {
    const initCart = async () => {
      const pendingCart = sessionStorage.getItem("pending_cart");
      const token = localStorage.getItem("token");

      if (pendingCart && token) {
        try {
          await API_CART.post("/cart/sync", { cart: JSON.parse(pendingCart) });
          sessionStorage.removeItem("pending_cart");
          toast.success("Đồng bộ giỏ hàng thành công!");
        } catch {
          toast.error("Đồng bộ giỏ hàng thất bại!");
        }
      }
      await fetchCart();
    };
    initCart();
  }, []);

  // Lấy giỏ hàng từ server hoặc session – SỬA: dùng product.quantity làm stock
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let items: CartItem[] = [];

      if (token) {
        const { data } = await API_CART.get("/cart");
        const serverCart = data.cart || [];

        items = await Promise.all(
          serverCart.map(async (item: any) => {
            try {
              const { data: product } = await API_PRODUCT.get(
                `/products/${item.product_id}`
              );
              const { data: assets } = await API_PRODUCT.get(
                `/assets/${item.product_id}`
              );
              return {
                product_id: item.product_id,
                quantity: item.quantity,
                title: product.title,
                price: product.price,
                discount: product.discount || 0,
                image: assets?.[0]?.path || "https://via.placeholder.com/80",
                stock: product.quantity || 0, // SỬA: quantity từ DB là tồn kho
              };
            } catch {
              return {
                product_id: item.product_id,
                quantity: item.quantity,
                title: "Sản phẩm không tồn tại",
                price: 0,
                discount: 0,
                image: "https://via.placeholder.com/80?text=×",
                stock: 0,
              };
            }
          })
        );
      } else {
        // Khách vãng lai
        const raw = sessionStorage.getItem("pending_cart") || "[]";
        const pending = JSON.parse(raw);

        if (pending.length > 0) {
          items = await Promise.all(
            pending.map(async (item: any) => {
              try {
                const { data: product } = await API_PRODUCT.get(
                  `/products/${item.product_id}`
                );
                const { data: assets } = await API_PRODUCT.get(
                  `/assets/${item.product_id}`
                );
                // SỬA: Giới hạn quantity không vượt tồn kho
                const maxQty = Math.min(item.quantity, product.quantity || 0);
                return {
                  product_id: item.product_id,
                  quantity: maxQty,
                  title: product.title,
                  price: product.price,
                  discount: product.discount || 0,
                  image: assets?.[0]?.path || "https://via.placeholder.com/80",
                  stock: product.quantity || 0, // SỬA: quantity từ DB
                };
              } catch {
                return {
                  product_id: item.product_id,
                  quantity: item.quantity,
                  title: "Sản phẩm không tồn tại",
                  price: 0,
                  discount: 0,
                  image: "https://via.placeholder.com/80?text=×",
                  stock: 0,
                };
              }
            })
          );
        }
      }

      setCart(items);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được giỏ hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng – SỬA: Kiểm tra stock trước khi tăng
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cart.find((i) => i.product_id === productId);
    if (!item) return;

    // SỬA: Kiểm tra tồn kho trước khi cập nhật
    if (newQuantity > (item.stock || 0)) {
      const max = item.stock || 0;
      toast.error(
        `Chỉ còn ${max} sản phẩm trong kho! Đã điều chỉnh về tối đa.`,
        {
          duration: 4000,
          style: { background: "#fef2f2", color: "#dc2626" },
        }
      );
      newQuantity = max; // Tự động điều chỉnh về số lượng tối đa
    }

    // Optimistic UI update
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await API_CART.put(`/cart/${productId}`, { quantity: newQuantity });
      } else {
        const raw = sessionStorage.getItem("pending_cart") || "[]";
        const list = JSON.parse(raw);
        const updated = list.map((item: any) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        sessionStorage.setItem("pending_cart", JSON.stringify(updated));
      }
    } catch {
      toast.error("Cập nhật số lượng thất bại!");
      await fetchCart(); // rollback
    }
  };

  const increase = (id: string) => {
    const item = cart.find((i) => i.product_id === id);
    if (item) {
      // SỬA: Kiểm tra trước khi tăng
      if (item.quantity + 1 > (item.stock || 0)) {
        toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
        return;
      }
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decrease = (id: string) => {
    const item = cart.find((i) => i.product_id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  // Xóa sản phẩm
  const handleRemove = async (id: string) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await API_CART.delete(`/cart/${id}`);
      } else {
        const raw = sessionStorage.getItem("pending_cart") || "[]";
        const list = JSON.parse(raw);
        const filtered = list.filter((item: any) => item.product_id !== id);
        sessionStorage.setItem("pending_cart", JSON.stringify(filtered));
      }
      await fetchCart();
      toast.success("Đã xóa sản phẩm!");
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  // Thanh toán
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem(
        "pending_cart",
        JSON.stringify(
          cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
        )
      );
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Giỏ hàng của bạn
            </h1>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition"
            >
              <ArrowLeft size={20} /> Tiếp tục mua sắm
            </button>
          </div>

          {/* Empty Cart */}
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">Giỏ hàng trống</div>
              <p className="text-gray-600 mb-8">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700 border-b">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-1 text-center">Giảm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-1 text-center">Thành tiền</div>
                <div className="col-span-1 text-center">Thao tác</div>
              </div>

              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 py-6 border-b last:border-b-0 items-center hover:bg-gray-50 transition"
                >
                  {/* Product Info */}
                  <div className="col-span-1 lg:col-span-5 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 lg:hidden">
                        Đơn giá:{" "}
                        <span className="font-bold text-red-600">
                          {item.price.toLocaleString()}₫
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden lg:block col-span-2 text-center font-semibold text-red-600">
                    {item.price.toLocaleString()}₫
                  </div>

                  {/* Discount */}
                  <div className="hidden lg:flex col-span-1 justify-center">
                    {item.discount > 0 ? (
                      <span className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        <Tag size={12} /> -{item.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 lg:col-span-2 flex items-center justify-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decrease(item.product_id)}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-100 transition"
                    >
                      <Minus size={16} />
                    </motion.button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => increase(item.product_id)}
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-100 transition"
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>

                  {/* Total */}
                  <div className="hidden lg:block col-span-1 text-center font-bold text-red-600 text-lg">
                    {Math.round(
                      item.price * (1 - item.discount / 100) * item.quantity
                    ).toLocaleString()}
                    ₫
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 lg:col-span-1 flex justify-center lg:justify-end">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(item.product_id)}
                      className="text-gray-400 hover:text-red-600 transition p-2"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>

                  {/* Mobile Total */}
                  <div className="lg:hidden text-right pr-2">
                    <p className="text-sm text-gray-600">Thành tiền</p>
                    <p className="text-lg font-bold text-red-600">
                      {Math.round(
                        item.price * (1 - item.discount / 100) * item.quantity
                      ).toLocaleString()}
                      ₫
                    </p>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="px-6 py-6 bg-gray-50 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xl sm:text-2xl font-bold">
                    Tổng thanh toán:{" "}
                    <span className="text-red-600">
                      {totalPrice.toLocaleString()}₫
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckout}
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition text-lg"
                  >
                    <CreditCard size={22} />
                    Tiến hành thanh toán
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
