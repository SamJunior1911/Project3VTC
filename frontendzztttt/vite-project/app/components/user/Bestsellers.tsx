// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { ShoppingCart, Eye, Flame } from "lucide-react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import API_PRODUCT from "~/api/Product";
// import API_CART from "~/api/Cart";

// const MySwal = withReactContent(Swal);

// interface Book {
//   id: string;
//   title: string;
//   discount: number;
//   img: string;
//   sold: number;
//   status: string;
// }

// const SkeletonSquare = () => (
//   <div className="animate-pulse">
//     <div className="bg-gray-200 rounded-2xl w-full aspect-square" />
//     <div className="h-5 bg-gray-200 rounded mt-3 w-4/5 mx-auto" />
//   </div>
// );

// const BestsellerBooks: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const res = await API_PRODUCT.get("/products/listproduct");

//         const bestsellers = await Promise.all(
//           res.data
//             .filter((item: any) => item.sold > 0) // chỉ lấy sản phẩm đã bán
//             .sort((a: any, b: any) => b.sold - a.sold) // sắp xếp giảm dần theo sold
//             .slice(0, 30)
//             .map(async (item: any) => {
//               let img =
//                 "https://via.placeholder.com/300x300/f97316/ffffff?text=Bestseller";
//               try {
//                 const imgRes = await API_PRODUCT.get(`/assets/${item._id}`);
//                 if (imgRes.data?.[0]?.path) img = imgRes.data[0].path;
//               } catch { }
//               return {
//                 id: item._id,
//                 title: item.title || "Sách bán chạy",
//                 discount: Number(item.discount) || 0,
//                 img,
//                 sold: item.sold || 0,
//                 status: item.status || "inactive",
//               };
//             })
//         );

//         setBooks(bestsellers);
//       } catch (err) {
//         console.error("Lỗi tải sách:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleAddToCart = async (e: React.MouseEvent, id: string) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const token = localStorage.getItem("token");
//     if (!token) {
//       MySwal.fire({
//         icon: "warning",
//         title: "Chưa đăng nhập!",
//         text: "Đăng nhập để thêm vào giỏ hàng nhé!",
//         showCancelButton: true,
//         confirmButtonText: "Đăng nhập ngay",
//         cancelButtonText: "Để sau",
//         confirmButtonColor: "#f97316",
//       }).then((r) => r.isConfirmed && navigate("/login"));
//       return;
//     }

//     try {
//       await API_CART.post(`/cart/add/${id}`, { quantity: 1 });
//       window.dispatchEvent(new Event("cartUpdated"));
//       MySwal.fire({
//         icon: "success",
//         title: "Đã thêm vào giỏ!",
//         toast: true,
//         position: "top-end",
//         timer: 1500,
//         background: "#fef3c7",
//         color: "#92400e",
//       });
//     } catch {
//       MySwal.fire({
//         icon: "error",
//         title: "Lỗi!",
//         text: "Không thể thêm vào giỏ",
//         toast: true,
//         position: "top-end",
//         timer: 2000,
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
//           SÁCH BÁN CHẠY
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//           {[...Array(12)].map((_, i) => (
//             <SkeletonSquare key={i} />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-16">
//       <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 bg-clip-text text-transparent">
//         SÁCH BÁN CHẠY
//       </h2>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {books.map((book, i) => (
//           <motion.div
//             key={book.id}
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ delay: i * 0.05, duration: 0.5 }}
//             className="group"
//           >
//             <Link to={`/product/${book.id}`} className="block">
//               <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white">
//                 <div className="aspect-square relative">
//                   <img
//                     src={book.img}
//                     alt={book.title}
//                     loading="lazy"
//                     className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
//                   />

//                   <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl">
//                     <Flame className="w-4 h-4 animate-pulse" />
//                     BÁN CHẠY
//                   </div>

//                   {book.discount > 0 && (
//                     <div className="absolute top-3 right-3 z-10 bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl">
//                       -{book.discount}%
//                     </div>
//                   )}

//                   <div className="absolute inset-x-0 bottom-6 flex justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//                     <motion.button
//                       whileHover={{ scale: 1.4 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={(e) => handleAddToCart(e, book.id)}
//                       className="pointer-events-auto p-3"
//                     >
//                       <ShoppingCart className="w-7 h-7 text-white drop-shadow-2xl" />
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.4 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         navigate(`/product/${book.id}`);
//                       }}
//                       className="pointer-events-auto p-3"
//                     >
//                       <Eye className="w-7 h-7 text-white drop-shadow-2xl" />
//                     </motion.button>
//                   </div>

//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
//                 </div>
//               </div>
//             </Link>

//             <div className="mt-4 text-center px-2">
//               <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight hover:text-orange-600 transition-colors">
//                 {book.title}
//               </h3>
//               <p className="text-xs text-gray-500 mt-1">Đã bán: {book.sold}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default BestsellerBooks;

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import API_PRODUCT from "~/api/Product";

interface Book {
  id: string;
  title: string;
  price: number;
  discount: number;
  sold: number;
  img: string;
  status?: string;
}

const BestsellerBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API_PRODUCT.get("/products/listproduct");
        const bestsellers = await Promise.all(
          res.data
            .filter((item: any) => item.sold > 0 && item.status === "active")
            .sort((a: any, b: any) => b.sold - a.sold)
            .slice(0, 30)
            .map(async (item: any) => {
              let imageUrl = "https://via.placeholder.com/300x400?text=Bestseller";
              try {
                const imgRes = await API_PRODUCT.get(`/assets/${item._id}`);
                if (imgRes.data?.length > 0) imageUrl = imgRes.data[0].path;
              } catch { }
              return {
                id: item._id,
                title: item.title || "Sách bán chạy",
                price: item.price || 0,
                discount: item.discount || 0,
                sold: item.sold || 0,
                img: imageUrl,
                status: item.status || "inactive",
              };
            })
        );
        setBooks(bestsellers);
      } catch (error) {
        console.error("Lỗi tải sách bán chạy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          SÁCH BÁN CHẠY
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        SÁCH BÁN CHẠY
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => {
          const oldPrice = book.price;
          const newPrice = Math.round(oldPrice * (1 - book.discount / 100));
          const saved = oldPrice - newPrice;

          return (
            <Link key={book.id} to={`/product/${book.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-visible group"
              >
                {/* Ảnh to, đẹp, hover scale nhẹ */}
                <div className="relative bg-gray-50 pt-[125%] overflow-visible">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Tag BÁN CHẠY – nhỏ xinh, cháy đẹp, nhô ra ngoài */}
                  <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-12 h-12 bg-orange-500 rounded-full blur-xl opacity-50" />
                    </div>
                    <div className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-orange-300 flex items-center gap-1 animate-bounce">
                      <Flame className="w-4 h-4 animate-[wiggle_0.8s_ease-in-out_infinite]" />
                      <span>BÁN CHẠY</span>
                    </div>
                  </div>
                </div>

                {/* Thông tin gọn nhẹ, căn trái, thanh thoát */}
                <div className="px-3 pt-2 pb-3 text-left space-y-1">
                  <div className="text-lg font-bold text-red-600 leading-none">
                    {newPrice.toLocaleString()}đ
                  </div>

                  {book.discount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 line-through">
                        {oldPrice.toLocaleString()}đ
                      </span>
                      <span className="bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded text-xs">
                        -{book.discount}%
                      </span>
                    </div>
                  )}

                  {book.discount > 0 && (
                    <div className="text-xs font-medium text-green-600">
                      Giảm {saved.toLocaleString()}đ
                    </div>
                  )}

                  <h3 className="text-sm text-gray-800 leading-tight line-clamp-2 truncate">
                    {book.title}
                  </h3>

                  {/* Số lượng đã bán – nhẹ nhàng */}
                  <p className="text-xs text-gray-500">
                    Đã bán {book.sold.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BestsellerBooks;