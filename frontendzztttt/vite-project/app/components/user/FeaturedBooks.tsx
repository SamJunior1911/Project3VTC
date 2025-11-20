// "use client";

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
//   author: string;
//   price: number;
//   discount: number;
//   is_feature: boolean;
//   img: string;
//   status?: string;
// }

// const SkeletonSquare = () => (
//   <div className="animate-pulse">
//     <div className="bg-gray-200 rounded-2xl w-full aspect-square" />
//     <div className="h-5 bg-gray-200 rounded mt-3 w-4/5 mx-auto" />
//   </div>
// );

// const FeaturedBooks: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const booksPerPage = 12;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const res = await API_PRODUCT.get("/products/listproduct");
//         const productsWithImages = await Promise.all(
//           res.data.map(async (item: any) => {
//             let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
//             try {
//               const imageRes = await API_PRODUCT.get(`/assets/${item._id}`);
//               if (imageRes.data && imageRes.data.length > 0) {
//                 imageUrl = imageRes.data[0].path;
//               }
//             } catch {
//               console.warn("Không tìm thấy ảnh cho sản phẩm:", item._id);
//             }
//             return {
//               id: item._id,
//               title: item.title,
//               author: item.author || "Chưa có tác giả",
//               price: item.price || 0,
//               discount: item.discount || 0,
//               is_feature: item.is_feature,
//               img: imageUrl,
//               status: item.status || "inactive",
//             };
//           })
//         );
//         setBooks(productsWithImages);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu sách:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, []);

//   const handleAddToCart = async (
//     e: React.MouseEvent,
//     id: string,
//     product: Book
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const token = localStorage.getItem("token");
//     try {
//       if (!token) {
//         // chưa login → lưu session
//         const pendingCart = JSON.parse(
//           sessionStorage.getItem("pending_cart") || "[]"
//         );
//         const exist = pendingCart.find((p: any) => p.product_id === id);
//         if (exist) exist.quantity += 1;
//         else
//           pendingCart.push({
//             product_id: id,
//             title: product.title,
//             price: product.price,
//             discount: product.discount || 0,
//             quantity: 1,
//           });
//         sessionStorage.setItem("pending_cart", JSON.stringify(pendingCart));
//         window.dispatchEvent(new Event("cartUpdated"));

//         MySwal.fire({
//           icon: "success",
//           title: "🛒 Đã thêm vào giỏ hàng (chưa login)",
//           showConfirmButton: false,
//           timer: 1800,
//           timerProgressBar: true,
//           position: "top-end",
//           toast: true,
//           background: "#ecfdf5",
//           color: "#065f46",
//           customClass: { popup: "rounded-xl shadow-lg" },
//         });
//         return;
//       }

//       // đã login
//       await API_CART.post(`/cart/add/${id}`, { quantity: 1 });
//       window.dispatchEvent(new Event("cartUpdated"));
//       MySwal.fire({
//         icon: "success",
//         title: "Thêm vào giỏ hàng thành công!",
//         showConfirmButton: false,
//         timer: 1800,
//         toast: true,
//         position: "top-end",
//         background: "#ecfdf5",
//         color: "#065f46",
//       });
//     } catch (error: any) {
//       console.error("❌ Lỗi khi thêm giỏ hàng:", error);
//       MySwal.fire({
//         icon: "error",
//         title: "Thêm vào giỏ thất bại!",
//         text: error.response?.data?.message || "Vui lòng thử lại sau ⚠️",
//         toast: true,
//         position: "top-end",
//         timer: 2000,
//         background: "#fef2f2",
//         color: "#991b1b",
//       });
//     }
//   };

//   // Pagination
//   const indexOfLastBook = currentPage * booksPerPage;
//   const indexOfFirstBook = indexOfLastBook - booksPerPage;
//   const featuredBooks = books.filter(
//     (book) => book.status === "active" && book.is_feature
//   );

//   const currentBooks = featuredBooks.slice(indexOfFirstBook, indexOfLastBook);

//   const totalPages = Math.ceil(books.length / booksPerPage);

//   if (loading) {
//     return (
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
//           SÁCH NỔI BẬT
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
//       <h2 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
//         SÁCH NỔI BẬT
//       </h2>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {currentBooks.map((book, i) => {
//           const discountedPrice = Math.round(
//             book.price * (1 - book.discount / 100)
//           );
//           return (
//             <motion.div
//               key={book.id}
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ delay: i * 0.05, duration: 0.5 }}
//               className="group"
//             >
//               <Link to={`/product/${book.id}`} className="block">
//                 <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white">
//                   {/* Ảnh vuông */}
//                   <div className="aspect-square relative">
//                     <img
//                       src={book.img}
//                       alt={book.title}
//                       loading="lazy"
//                       className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
//                     />
//                     {book.status === "active" && book.is_feature === true && (
//                       <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl">
//                         <Flame className="w-4 h-4 animate-pulse" />
//                         HOT
//                       </div>
//                     )}

//                     {book.discount > 0 && (
//                       <div className="absolute top-3 right-3 bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl">
//                         -{book.discount}%
//                       </div>
//                     )}

//                     <div className="absolute inset-x-0 bottom-6 flex justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
//                       <motion.button
//                         whileHover={{ scale: 1.4 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => handleAddToCart(e, book.id, book)}
//                         className="pointer-events-auto p-3"
//                       >
//                         <ShoppingCart className="w-7 h-7 text-white drop-shadow-2xl" />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.4 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           navigate(`/product/${book.id}`);
//                         }}
//                         className="pointer-events-auto p-3"
//                       >
//                         <Eye className="w-7 h-7 text-white drop-shadow-2xl" />
//                       </motion.button>
//                     </div>

//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
//                   </div>
//                 </div>
//               </Link>

//               <div className="mt-4 text-center px-2">
//                 <h3 className="font-bold text-gray-800 text-sm line-clamp-2 hover:text-orange-600 transition-colors">
//                   {book.title}
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-1">{book.author}</p>
//                 <div className="mt-1">
//                   {book.discount > 0 && (
//                     <p className="text-gray-400 text-xs line-through">
//                       {book.price.toLocaleString()}₫
//                     </p>
//                   )}
//                   <p className="text-red-600 font-semibold">
//                     {discountedPrice.toLocaleString()}₫
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-12">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className={`px-3 py-1.5 rounded-md border ${currentPage === 1
//               ? "text-gray-400 border-gray-200"
//               : "text-gray-700 border-gray-300 hover:bg-gray-100"
//               }`}
//           >
//             ← Trước
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`w-8 h-8 rounded-md border ${currentPage === i + 1
//                 ? "bg-orange-500 text-white border-orange-500"
//                 : "border-gray-300 text-gray-700 hover:bg-gray-100"
//                 }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1.5 rounded-md border ${currentPage === totalPages
//               ? "text-gray-400 border-gray-200"
//               : "text-gray-700 border-gray-300 hover:bg-gray-100"
//               }`}
//           >
//             Sau →
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default FeaturedBooks;
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
  is_feature: boolean;
  img: string;
  status?: string;
}

const FeaturedBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API_PRODUCT.get("/products/listproduct");
        const productsWithImages = await Promise.all(
          res.data.map(async (item: any) => {
            let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
            try {
              const imageRes = await API_PRODUCT.get(`/assets/${item._id}`);
              if (imageRes.data?.length > 0) imageUrl = imageRes.data[0].path;
            } catch { }
            return {
              id: item._id,
              title: item.title,
              price: item.price || 0,
              discount: item.discount || 0,
              is_feature: item.is_feature || false,
              img: imageUrl,
              status: item.status || "inactive",
            };
          })
        );
        setBooks(productsWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const featuredBooks = books.filter(b => b.status === "active" && b.is_feature);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
          SÁCH NỔI BẬT
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
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        SÁCH NỔI BẬT
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {featuredBooks.map((book) => {
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
                {/* Ảnh to hơn, gần full card */}
                <div className="relative bg-gray-50 pt-[125%] overflow-visible">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* HOT nhỏ xinh, vẫn cháy cực đẹp, nhô ra ngoài */}
                  {book.is_feature && (
                    <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-12 h-12 bg-orange-500 rounded-full blur-xl opacity-50" />
                      </div>
                      <div className="relative bg-gradient-to-br from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-orange-300 flex items-center gap-1 animate-bounce">
                        <Flame className="w-4 h-4 animate-[wiggle_0.8s_ease-in-out_infinite]" />
                        <span>HOT</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thông tin: gọn nhẹ, không đậm quá, thanh thoát */}
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

                  <h3 className="text-sm truncate text-gray-800 leading-tight line-clamp-2">
                    {book.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedBooks;