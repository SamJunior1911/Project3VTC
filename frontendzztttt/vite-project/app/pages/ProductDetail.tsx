// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import { motion } from "framer-motion";
// import API_PRODUCT from "app/api/Product";
// import API_CART from "app/api/Cart";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { ShoppingCart, Tag } from "lucide-react";
// import Header from "~/components/user/Header";
// import Footer from "~/components/user/Footer";
// import { AspectRatio } from "../components/ui/aspect-ratio";

// const MySwal = withReactContent(Swal);

// interface Product {
//   _id: string;
//   title: string;
//   author?: string;
//   description?: string;
//   price: number;
//   image?: string;
//   discount: number;
//   quantity: number;
// }

// export default function ProductDetail() {
//   const { id } = useParams<{ id: string }>();
//   const [product, setProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await API_PRODUCT.get(`/products/${id}`);
//         const data = res.data;

//         let imageUrl = "https://via.placeholder.com/400x500?text=No+Image";
//         try {
//           const imgRes = await API_PRODUCT.get(`/assets/${data._id}`);
//           if (imgRes.data && imgRes.data.length > 0) {
//             imageUrl = imgRes.data[0].path;
//           }
//         } catch {
//           console.warn("Không tìm thấy ảnh cho sản phẩm:", data._id);
//         }

//         setProduct({ ...data, image: imageUrl });
//       } catch {
//         MySwal.fire({
//           icon: "error",
//           title: "Không tìm thấy sản phẩm!",
//           timer: 1800,
//           showConfirmButton: false,
//           position: "top-end",
//           toast: true,
//         });
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   // ProductDetail.tsx – CHỈ SỬA HÀM handleAddToCart → HOÀN HẢO 100%
//   const handleAddToCart = async () => {
//     if (!product) return;

//     const token = localStorage.getItem("token");

//     try {
//       if (token) {
//         // ĐÃ ĐĂNG NHẬP → gọi API bình thường
//         await API_CART.post(`/cart/add/${product._id}`, { quantity: 1 });
//         window.dispatchEvent(new Event("cartUpdated"));

//         MySwal.fire({
//           icon: "success",
//           title: "Đã thêm vào giỏ hàng!",
//           toast: true,
//           position: "top-end",
//           timer: 1800,
//           timerProgressBar: true,
//           showConfirmButton: false,
//           background: "#fff",
//           color: "#065f46",
//         });
//       } else {
//         // CHƯA ĐĂNG NHẬP → CHỈ LƯU { product_id, quantity } + KIỂM TRA TỒN KHO
//         const raw = sessionStorage.getItem("pending_cart") || "[]";
//         let pendingCart: { product_id: string; quantity: number }[] = [];

//         try {
//           pendingCart = JSON.parse(raw);
//         } catch {
//           pendingCart = [];
//         }

//         const existIndex = pendingCart.findIndex(
//           (item) => item.product_id === product._id
//         );

//         let newQuantity = 1;

//         if (existIndex >= 0) {
//           // Đã có trong giỏ → tăng số lượng
//           const currentQty = pendingCart[existIndex].quantity;
//           newQuantity = currentQty + 1;

//           // KIỂM TRA TỒN KHO
//           if (newQuantity > product.quantity) {
//             newQuantity = product.quantity;
//             pendingCart[existIndex].quantity = newQuantity;

//             MySwal.fire({
//               icon: "warning",
//               title: `Chỉ còn ${product.quantity} sản phẩm!`,
//               text: "Đã điều chỉnh về số lượng tối đa",
//               toast: true,
//               position: "top-end",
//               timer: 2500,
//               showConfirmButton: false,
//             });
//           } else {
//             pendingCart[existIndex].quantity = newQuantity;
//           }
//         } else {
//           // Chưa có → thêm mới
//           if (1 > product.quantity) {
//             // Nếu kho = 0
//             MySwal.fire({
//               icon: "error",
//               title: "Hết hàng!",
//               text: "Sản phẩm hiện đã hết hàng",
//               toast: true,
//               position: "top-end",
//               timer: 2000,
//               showConfirmButton: false,
//             });
//             return;
//           }

//           if (product.quantity < 1) return; // Không thêm nếu hết hàng

//           pendingCart.push({
//             product_id: product._id,
//             quantity: 1,
//           });
//         }

//         // LƯU LẠI CHỈ { product_id, quantity }
//         sessionStorage.setItem("pending_cart", JSON.stringify(pendingCart));
//         window.dispatchEvent(new Event("cartUpdated"));

//         MySwal.fire({
//           icon: "success",
//           title: "Đã thêm vào giỏ hàng!",
//           toast: true,
//           position: "top-end",
//           timer: 1800,
//           timerProgressBar: true,
//           showConfirmButton: false,
//           background: "#fff",
//           color: "#065f46",
//         });
//       }
//     } catch (error: any) {
//       MySwal.fire({
//         icon: "error",
//         title: "Thêm vào giỏ thất bại!",
//         text: error.response?.data?.message || "Vui lòng thử lại sau",
//         toast: true,
//         position: "top-end",
//         timer: 2000,
//         showConfirmButton: false,
//         background: "#fef2f2",
//         color: "#991b1b",
//       });
//     }
//   };

//   if (!product) {
//     return (
//       <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
//         <Header />
//         <p className="text-center text-gray-500 mt-10 animate-pulse flex-1">
//           Đang tải chi tiết sản phẩm...
//         </p>
//         <Footer />
//       </div>
//     );
//   }

//   const finalPrice = product.price - (product.price * product.discount) / 100;

//   return (
//     <div className="font-[Poppins] bg-gray-50 min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <div className="max-w-7xl mx-auto py-12 px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all hover:shadow-2xl">
//             {/* Ảnh sản phẩm */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.4 }}
//               className="relative group overflow-hidden rounded-2xl shadow-inner"
//             >
//               <div className="relative group overflow-hidden rounded-2xl shadow-inner">
//                 {product.discount > 0 && (
//                   <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg z-10">
//                     -{product.discount}%
//                   </div>
//                 )}

//                 <AspectRatio
//                   ratio={4 / 5}
//                   className="overflow-hidden rounded-2xl bg-gray-100"
//                 >
//                   <img
//                     src={
//                       product.image ||
//                       "https://via.placeholder.com/400x500?text=No+Image"
//                     }
//                     alt={product.title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                   />
//                 </AspectRatio>
//               </div>
//             </motion.div>

//             {/* Thông tin sản phẩm */}
//             <div className="flex flex-col justify-between space-y-6">
//               <div className="space-y-4">
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
//                   {product.title}
//                 </h1>

//                 <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
//                   <span className="font-semibold text-gray-700">
//                     Thương hiệu:
//                   </span>
//                   <span className="font-semibold text-gray-800 text-lg hover:underline cursor-pointer">
//                     {product.author || "Chưa cập nhật"}
//                   </span>
//                 </p>
//                 {product.quantity === 0 && (
//                   <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
//                     Hết hàng
//                   </span>
//                 )}
//                 <div className="flex items-center gap-4">
//                   <p className="text-4xl font-bold text-red-600">
//                     {finalPrice.toLocaleString()} VND
//                   </p>
//                   {product.discount > 0 && (
//                     <span className="text-gray-400 line-through text-lg">
//                       {product.price.toLocaleString()} VND
//                     </span>
//                   )}
//                 </div>

//                 {product.discount > 0 && (
//                   <div className="flex items-center gap-2 text-red-600 font-semibold">
//                     <Tag size={18} />
//                     <span>Sale {product.discount}%</span>
//                   </div>
//                 )}

//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-2 text-lg">
//                     Mô tả sản phẩm:
//                   </h3>
//                   <p className="text-gray-700 leading-relaxed text-sm md:text-base">
//                     {product.description ||
//                       "Sản phẩm này hiện chưa có mô tả chi tiết."}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 disabled={product.quantity === 0}
//                 className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 w-full md:w-1/2
//     ${product.quantity === 0
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-orange-500 hover:bg-orange-600 text-white"
//                   }`}
//               >
//                 <ShoppingCart size={20} />
//                 {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API_PRODUCT from "app/api/Product";
import API_CART from "app/api/Cart";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ShoppingCart, Tag, Package, Truck, Shield, Zap } from "lucide-react";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";
import { AspectRatio } from "../components/ui/aspect-ratio";

const MySwal = withReactContent(Swal);

interface Product {
  _id: string;
  title: string;
  author?: string;
  description?: string;
  price: number;
  image?: string;
  discount: number;
  quantity: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API_PRODUCT.get(`/products/${id}`);
        const data = res.data;
        let imageUrl = "https://via.placeholder.com/400x533?text=No+Image";
        try {
          const imgRes = await API_PRODUCT.get(`/assets/${data._id}`);
          if (imgRes.data?.[0]?.path) imageUrl = imgRes.data[0].path;
        } catch { }
        setProduct({ ...data, image: imageUrl });
      } catch {
        MySwal.fire({
          icon: "error",
          title: "Oops!",
          text: "Không tìm thấy sách này...",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.quantity === 0) return;

    const token = localStorage.getItem("token");
    try {
      if (token) {
        await API_CART.post(`/cart/add/${product._id}`, { quantity: 1 });
      } else {
        const raw = sessionStorage.getItem("pending_cart") || "[]";
        let cart = JSON.parse(raw) || [];
        const exist = cart.find((i: any) => i.product_id === product._id);
        if (exist) exist.quantity += 1;
        else cart.push({ product_id: product._id, quantity: 1 });
        sessionStorage.setItem("pending_cart", JSON.stringify(cart));
      }
      window.dispatchEvent(new Event("cartUpdated"));
      MySwal.fire({
        icon: "success",
        title: "Thêm vào giỏ thành công!",
        toast: true,
        position: "top-end",
        timer: 1500,
        background: "#ecfdf5",
        color: "#065f46",
      });
    } catch { }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  if (!product) {
    return (
      <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="font-sans bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-purple-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Ảnh nhỏ gọn, xinh xắn */}
            <div className="relative">
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                  -{product.discount}%
                </div>
              )}
              {product.quantity === 0 && (
                <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center z-20">
                  <span className="text-white text-2xl font-bold bg-red-600 px-6 py-3 rounded-xl">HẾT HÀNG</span>
                </div>
              )}
              <AspectRatio ratio={3 / 4} className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </AspectRatio>
            </div>

            {/* Thông tin - Gọn gàng, điệu đà */}
            <div className="space-y-6">
              {/* Tên sách - Font ĐIỆU ĐÀ, SANG CHẢNH NHẤT 2025 */}
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 via-pink-600 to-red-600 bg-clip-text text-transparent leading-tight">
                {product.title}
              </h1>

              {/* Tác giả nhỏ nhắn, thanh lịch */}
              {product.author && (
                <p className="text-sm text-gray-600">
                  Tác giả: <span className="font-medium text-700">{product.author}</span>
                </p>
              )}

              {/* Giá đỏ, nhỏ hơn, nổi bật */}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-red-600">
                  {finalPrice.toLocaleString("vi-VN")}₫
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                )}
              </div>

              {/* Tag giảm giá dễ thương */}
              {product.discount > 0 && (
                <div className="flex items-center gap-2 text-pink-600 font-medium">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Giảm sốc {product.discount}%</span>
                </div>
              )}

              {/* Mô tả ngắn gọn */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.description || "Một cuốn sách tuyệt vời đang chờ bạn khám phá..."}
              </p>

              {/* 2 NÚT SIÊU ĐẸP */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.quantity === 0}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Zap className="w-6 h-6 animate-pulse" />
                  Mua ngay
                </button>
              </div>

              {/* Chính sách nhỏ xinh */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs pt-6 border-t border-purple-100">
                <div className="flex flex-col items-center">
                  <Package className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="font-medium">Đóng gói cẩn thận</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-6 h-6 text-pink-600 mb-1" />
                  <span className="font-medium">Giao siêu nhanh</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-6 h-6 text-red-600 mb-1" />
                  <span className="font-medium">Đổi trả 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}