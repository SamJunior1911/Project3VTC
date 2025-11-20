
// import React, { useEffect, useState } from "react";
// import { ArrowLeft, CreditCard, Tag, Trash2, Plus, Minus } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "react-hot-toast";
// import Swal from "sweetalert2";
// import API_CART from "~/api/Cart";
// import API_PRODUCT from "~/api/Product";
// import { useNavigate } from "react-router-dom";
// import Header from "~/components/user/Header";
// import Footer from "~/components/user/Footer";

// interface CartItem {
//   product_id: string;
//   title: string;
//   price: number;
//   quantity: number;
//   discount: number;
//   image?: string;
//   stock?: number; // Tạm dùng để kiểm tra tồn kho
// }

// const CartPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const totalPrice = cart.reduce(
//     (sum, item) =>
//       sum + Math.round(item.price * (1 - item.discount / 100) * item.quantity),
//     0
//   );

//   // Khởi tạo giỏ hàng + sync pending_cart khi đăng nhập
//   useEffect(() => {
//     const initCart = async () => {
//       const pendingCart = sessionStorage.getItem("pending_cart");
//       const token = localStorage.getItem("token");

//       if (pendingCart && token) {
//         try {
//           await API_CART.post("/cart/sync", { cart: JSON.parse(pendingCart) });
//           sessionStorage.removeItem("pending_cart");
//           toast.success("Đồng bộ giỏ hàng thành công!");
//         } catch {
//           toast.error("Đồng bộ giỏ hàng thất bại!");
//         }
//       }
//       await fetchCart();
//     };
//     initCart();
//   }, []);

//   // Lấy giỏ hàng từ server hoặc session – SỬA: dùng product.quantity làm stock
//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       let items: CartItem[] = [];

//       if (token) {
//         const { data } = await API_CART.get("/cart");
//         const serverCart = data.cart || [];

//         items = await Promise.all(
//           serverCart.map(async (item: any) => {
//             try {
//               const { data: product } = await API_PRODUCT.get(`/products/${item.product_id}`);
//               const { data: assets } = await API_PRODUCT.get(`/assets/${item.product_id}`);
//               return {
//                 product_id: item.product_id,
//                 quantity: item.quantity,
//                 title: product.title,
//                 price: product.price,
//                 discount: product.discount || 0,
//                 image: assets?.[0]?.path || "https://via.placeholder.com/80",
//                 stock: product.quantity || 0,  // SỬA: quantity từ DB là tồn kho
//               };
//             } catch {
//               return {
//                 product_id: item.product_id,
//                 quantity: item.quantity,
//                 title: "Sản phẩm không tồn tại",
//                 price: 0,
//                 discount: 0,
//                 image: "https://via.placeholder.com/80?text=×",
//                 stock: 0,
//               };
//             }
//           })
//         );
//       } else {
//         // Khách vãng lai
//         const raw = sessionStorage.getItem("pending_cart") || "[]";
//         const pending = JSON.parse(raw);

//         if (pending.length > 0) {
//           items = await Promise.all(
//             pending.map(async (item: any) => {
//               try {
//                 const { data: product } = await API_PRODUCT.get(`/products/${item.product_id}`);
//                 const { data: assets } = await API_PRODUCT.get(`/assets/${item.product_id}`);
//                 // SỬA: Giới hạn quantity không vượt tồn kho
//                 const maxQty = Math.min(item.quantity, product.quantity || 0);
//                 return {
//                   product_id: item.product_id,
//                   quantity: maxQty,
//                   title: product.title,
//                   price: product.price,
//                   discount: product.discount || 0,
//                   image: assets?.[0]?.path || "https://via.placeholder.com/80",
//                   stock: product.quantity || 0,  // SỬA: quantity từ DB
//                 };
//               } catch {
//                 return {
//                   product_id: item.product_id,
//                   quantity: item.quantity,
//                   title: "Sản phẩm không tồn tại",
//                   price: 0,
//                   discount: 0,
//                   image: "https://via.placeholder.com/80?text=×",
//                   stock: 0,
//                 };
//               }
//             })
//           );
//         }
//       }

//       setCart(items);
//     } catch (err) {
//       console.error(err);
//       toast.error("Không tải được giỏ hàng!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cập nhật số lượng – SỬA: Kiểm tra stock trước khi tăng
//   const updateQuantity = async (productId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     const item = cart.find((i) => i.product_id === productId);
//     if (!item) return;

//     // SỬA: Kiểm tra tồn kho trước khi cập nhật
//     if (newQuantity > (item.stock || 0)) {
//       const max = item.stock || 0;
//       toast.error(`Chỉ còn ${max} sản phẩm trong kho! Đã điều chỉnh về tối đa.`, {
//         duration: 4000,
//         style: { background: "#fef2f2", color: "#dc2626" },
//       });
//       newQuantity = max;  // Tự động điều chỉnh về số lượng tối đa
//     }

//     // Optimistic UI update
//     setCart((prev) =>
//       prev.map((item) =>
//         item.product_id === productId ? { ...item, quantity: newQuantity } : item
//       )
//     );

//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         await API_CART.put(`/cart/${productId}`, { quantity: newQuantity });
//       } else {
//         const raw = sessionStorage.getItem("pending_cart") || "[]";
//         const list = JSON.parse(raw);
//         const updated = list.map((item: any) =>
//           item.product_id === productId ? { ...item, quantity: newQuantity } : item
//         );
//         sessionStorage.setItem("pending_cart", JSON.stringify(updated));
//       }
//     } catch {
//       toast.error("Cập nhật số lượng thất bại!");
//       await fetchCart(); // rollback
//     }
//   };

//   const increase = (id: string) => {
//     const item = cart.find((i) => i.product_id === id);
//     if (item) {
//       // SỬA: Kiểm tra trước khi tăng
//       if (item.quantity + 1 > (item.stock || 0)) {
//         toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
//         return;
//       }
//       updateQuantity(id, item.quantity + 1);
//     }
//   };

//   const decrease = (id: string) => {
//     const item = cart.find((i) => i.product_id === id);
//     if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
//   };

//   // Xóa sản phẩm
//   const handleRemove = async (id: string) => {
//     const result = await Swal.fire({
//       title: "Xóa sản phẩm?",
//       text: "Hành động này không thể hoàn tác!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#e74c3c",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Xóa",
//       cancelButtonText: "Hủy",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (token) {
//         await API_CART.delete(`/cart/${id}`);
//       } else {
//         const raw = sessionStorage.getItem("pending_cart") || "[]";
//         const list = JSON.parse(raw);
//         const filtered = list.filter((item: any) => item.product_id !== id);
//         sessionStorage.setItem("pending_cart", JSON.stringify(filtered));
//       }
//       await fetchCart();
//       toast.success("Đã xóa sản phẩm!");
//     } catch {
//       toast.error("Xóa thất bại!");
//     }
//   };

//   // Thanh toán
//   const handleCheckout = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       sessionStorage.setItem("pending_cart", JSON.stringify(cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }))));
//       navigate("/login?redirect=/checkout");
//     } else {
//       navigate("/checkout");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="font-sans min-h-screen flex flex-col bg-gray-50">
//       <Header />

//       <main className="flex-grow py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
//             <button
//               onClick={() => navigate("/")}
//               className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition"
//             >
//               <ArrowLeft size={20} /> Tiếp tục mua sắm
//             </button>
//           </div>

//           {/* Empty Cart */}
//           {cart.length === 0 ? (
//             <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
//               <div className="text-6xl mb-4">Giỏ hàng trống</div>
//               <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
//               <button
//                 onClick={() => navigate("/")}
//                 className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition transform hover:scale-105"
//               >
//                 Mua sắm ngay
//               </button>
//             </div>
//           ) : (
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               {/* Desktop Header */}
//               <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700 border-b">
//                 <div className="col-span-5">Sản phẩm</div>
//                 <div className="col-span-2 text-center">Đơn giá</div>
//                 <div className="col-span-1 text-center">Giảm</div>
//                 <div className="col-span-2 text-center">Số lượng</div>
//                 <div className="col-span-1 text-center">Thành tiền</div>
//                 <div className="col-span-1 text-center">Thao tác</div>
//               </div>

//               {/* Cart Items */}
//               {cart.map((item) => (
//                 <div
//                   key={item.product_id}
//                   className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 py-6 border-b last:border-b-0 items-center hover:bg-gray-50 transition"
//                 >
//                   {/* Product Info */}
//                   <div className="col-span-1 lg:col-span-5 flex items-center gap-4">
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shadow-sm flex-shrink-0"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 truncate">{item.title}</p>
//                       <p className="text-sm text-gray-500 mt-1 lg:hidden">
//                         Đơn giá: <span className="font-bold text-red-600">{item.price.toLocaleString()}₫</span>
//                       </p>
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="hidden lg:block col-span-2 text-center font-semibold text-red-600">
//                     {item.price.toLocaleString()}₫
//                   </div>

//                   {/* Discount */}
//                   <div className="hidden lg:flex col-span-1 justify-center">
//                     {item.discount > 0 ? (
//                       <span className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
//                         <Tag size={12} /> -{item.discount}%
//                       </span>
//                     ) : (
//                       <span className="text-gray-400 text-xs">—</span>
//                     )}
//                   </div>

//                   {/* Quantity */}
//                   <div className="col-span-1 lg:col-span-2 flex items-center justify-center gap-3">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => decrease(item.product_id)}
//                       className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-100 transition"
//                     >
//                       <Minus size={16} />
//                     </motion.button>
//                     <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => increase(item.product_id)}
//                       className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-100 transition"
//                     >
//                       <Plus size={16} />
//                     </motion.button>
//                   </div>

//                   {/* Total */}
//                   <div className="hidden lg:block col-span-1 text-center font-bold text-red-600 text-lg">
//                     {Math.round(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}₫
//                   </div>

//                   {/* Delete */}
//                   <div className="col-span-1 lg:col-span-1 flex justify-center lg:justify-end">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => handleRemove(item.product_id)}
//                       className="text-gray-400 hover:text-red-600 transition p-2"
//                     >
//                       <Trash2 size={20} />
//                     </motion.button>
//                   </div>

//                   {/* Mobile Total */}
//                   <div className="lg:hidden text-right pr-2">
//                     <p className="text-sm text-gray-600">Thành tiền</p>
//                     <p className="text-lg font-bold text-red-600">
//                       {Math.round(item.price * (1 - item.discount / 100) * item.quantity).toLocaleString()}₫
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {/* Footer */}
//               <div className="px-6 py-6 bg-gray-50 border-t">
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <div className="text-xl sm:text-2xl font-bold">
//                     Tổng thanh toán:{" "}
//                     <span className="text-red-600">{totalPrice.toLocaleString()}₫</span>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleCheckout}
//                     className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition text-lg"
//                   >
//                     <CreditCard size={22} />
//                     Tiến hành thanh toán
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default CartPage;

// src/pages/CartPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, CreditCard, ArrowLeft, Package, Sparkles, ShoppingCart, CheckCircle2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import API_CART from "~/api/Cart";
import API_PRODUCT from "~/api/Product";
import { Link, useNavigate } from "react-router-dom";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";

interface Item {
  id: string;
  title: string;
  price: number;
  qty: number;
  discount: number;
  img: string;
  checked: boolean;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [allChecked, setAllChecked] = useState(false);

  // Tính toán tổng
  const selectedItems = cart.filter(i => i.checked);
  const total = selectedItems.reduce((sum, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return sum + (discountedPrice * item.qty);
  }, 0);
  const saved = selectedItems.reduce((sum, item) => {
    const discountAmount = item.price * (item.discount / 100);
    return sum + (discountAmount * item.qty);
  }, 0);
  const totalCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    initCart();
  }, []);

  // Cập nhật trạng thái "chọn tất cả" khi cart thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      const allSelected = cart.every(item => item.checked);
      setAllChecked(allSelected);
    } else {
      setAllChecked(false);
    }
  }, [cart]);

  const initCart = async () => {
    const pending = sessionStorage.getItem("pending_cart");
    const token = localStorage.getItem("token");
    if (pending && token) {
      try {
        await API_CART.post("/cart/sync", { cart: JSON.parse(pending) });
        sessionStorage.removeItem("pending_cart");
      } catch (error) {
        console.error("Lỗi đồng bộ giỏ hàng:", error);
      }
    }
    await load();
  };

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let items: Item[] = [];

      if (token) {
        const { data } = await API_CART.get("/cart");
        items = await Promise.all((data.cart || []).map(async (i: any) => {
          try {
            const p = await API_PRODUCT.get(`/products/${i.product_id}`);
            const imgRes = await API_PRODUCT.get(`/assets/${i.product_id}`);
            return {
              id: i.product_id,
              title: p.data.title || "Sách chưa đặt tên",
              price: p.data.price || 0,
              qty: i.quantity,
              discount: p.data.discount || 0,
              img: imgRes.data?.[0]?.path || "https://placehold.co/80x80/10b981/white?text=Book",
              checked: true,
            };
          } catch (error) {
            console.error("Lỗi tải sản phẩm:", i.product_id, error);
            return {
              id: i.product_id,
              title: "Sản phẩm không tồn tại",
              price: 0,
              qty: i.quantity,
              discount: 0,
              img: "https://placehold.co/80x80/ef4444/white?text=!Error",
              checked: true
            };
          }
        }));
      } else {
        // Nếu không có token, lấy từ sessionStorage
        const pendingCart = JSON.parse(sessionStorage.getItem("pending_cart") || "[]");
        items = pendingCart.map((i: any) => ({
          ...i,
          checked: true
        }));
      }
      setCart(items);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      toast.error("Lỗi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const toggleAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setCart(prev => prev.map(item => ({ ...item, checked: newCheckedState })));
  };

  const toggleItem = (id: string) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: newQty } : item
    ));
    updateAPI(id, newQty);
  };

  const updateAPI = async (id: string, quantity: number) => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await API_CART.put(`/cart/${id}`, { quantity });
      } else {
        // Cập nhật trong sessionStorage nếu không có token
        const pendingCart = JSON.parse(sessionStorage.getItem("pending_cart") || "[]");
        const updatedCart = pendingCart.map((item: any) =>
          item.product_id === id ? { ...item, quantity } : item
        );
        sessionStorage.setItem("pending_cart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      toast.error("Lỗi cập nhật số lượng");
    }
  };

  const removeItems = async () => {
    const itemsToRemove = cart.filter(i => i.checked);
    if (!itemsToRemove.length) {
      toast.error("Vui lòng chọn sản phẩm để xóa");
      return;
    }

    const result = await Swal.fire({
      title: `Xóa ${itemsToRemove.length} sản phẩm?`,
      text: "Bạn sẽ không thể khôi phục lại sau khi xóa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Xóa nhiều sản phẩm cùng lúc
        await Promise.all(
          itemsToRemove.map(item => API_CART.delete(`/cart/${item.id}`))
        );
      } else {
        // Xóa từ sessionStorage
        const pendingCart = JSON.parse(sessionStorage.getItem("pending_cart") || "[]");
        const updatedCart = pendingCart.filter((item: any) =>
          !itemsToRemove.some(removed => removed.id === item.product_id)
        );
        sessionStorage.setItem("pending_cart", JSON.stringify(updatedCart));
      }

      await load();
      toast.success("Đã xóa sản phẩm!");
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const handleCheckout = () => {
    if (!selectedItems.length) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("pending_checkout", JSON.stringify(selectedItems));
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout", { state: { items: selectedItems } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-teal-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Giỏ hàng của bạn
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {cart.length} sản phẩm • {totalCount} cuốn
              </p>
            </div>
          </motion.div>

          <Link
            to="/"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-lg hover:bg-emerald-50 transition-all"
          >
            <ArrowLeft size={18} />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-100"
          >
            <div className="mx-auto w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles size={22} />
              <span>Mua sắm ngay</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-100 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <label className="flex items-center gap-4 cursor-pointer font-bold text-lg">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-6 h-6 rounded accent-white"
                    />
                    <span>Tất cả ({cart.length} sản phẩm)</span>
                  </label>
                  <button
                    onClick={removeItems}
                    className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    <Trash2 size={20} />
                    <span>Xóa</span>
                  </button>
                </div>

                {/* Danh sách sản phẩm */}
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-6 p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="w-6 h-6 rounded accent-emerald-600"
                      />

                      <div className="relative">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-xl shadow-md border border-emerald-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/96x96/10b981/white?text=Book";
                          }}
                        />
                        {item.discount > 0 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            -{item.discount}%
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-2">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-lg font-bold text-emerald-600">
                            {(item.price * (1 - item.discount / 100)).toLocaleString()}đ
                          </span>
                          {item.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              {item.price.toLocaleString()}đ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {item.qty} cuốn
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-12 h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center border border-emerald-200 shadow-sm"
                        >
                          <Minus size={20} />
                        </motion.button>
                        <span className="w-12 text-center font-bold text-xl">
                          {item.qty}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-12 h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center border border-emerald-200 shadow-sm"
                        >
                          <Plus size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* THANH TOÁN */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-emerald-200 p-6 sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-800">
                    Tổng kết đơn hàng
                  </h2>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Sản phẩm ({selectedItems.length})</span>
                    <span className="font-medium">{totalCount} cuốn</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-bold text-lg">{total.toLocaleString()}đ</span>
                  </div>

                  {saved > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 text-green-600">
                      <span className="text-gray-600">Bạn được giảm</span>
                      <span className="font-bold text-lg">-{saved.toLocaleString()}đ</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-4 text-xl font-black text-gray-800">
                    <span>Thành tiền</span>
                    <span className="text-emerald-600">{total.toLocaleString()}đ</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className={`w-full mt-8 py-5 font-black text-lg rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all ${selectedItems.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-2xl'
                    }`}
                >
                  <CreditCard size={24} />
                  <span>Thanh toán ({totalCount})</span>
                </motion.button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  Đã chọn {selectedItems.length}/{cart.length} sản phẩm
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;