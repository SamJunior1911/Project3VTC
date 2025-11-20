// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Link } from "react-router";
// import Header from "~/components/user/Header";
// import Footer from "~/components/user/Footer";

// const CategoryPage: React.FC = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [sortOption, setSortOption] = useState<string>("featured");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [prodRes, cateRes] = await Promise.all([
//           axios.get("http://localhost:3001/api/products"),
//           axios.get("http://localhost:3001/categories/tree"), // ✅ API trả về object có categoryTree
//         ]);

//         const categoriesData = cateRes.data?.categoryTree || []; // ✅ Lấy đúng mảng
//         const productsData = prodRes.data || [];

//         const productsWithImages = await Promise.all(
//           productsData.map(async (item: any) => {
//             let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
//             try {
//               const imgRes = await axios.get(
//                 `http://localhost:3001/api/assets/${item._id}`
//               );
//               const imgList = imgRes.data?.images || imgRes.data || [];
//               if (imgList.length > 0) imageUrl = imgList[0].path;
//             } catch {
//               console.warn(`⚠️ Không lấy được ảnh cho ${item._id}`);
//             }
//             return { ...item, image: imageUrl };
//           })
//         );

//         setCategories(categoriesData);
//         setProducts(productsWithImages);
//       } catch (err) {
//         console.error("❌ Lỗi khi lấy dữ liệu:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);

//   // ✅ Lấy danh sách tất cả category con (đệ quy)
//   const getAllChildIds = (cat: any): string[] => {
//     if (!cat.children || cat.children.length === 0) return [cat._id];
//     return [
//       cat._id,
//       ...cat.children.flatMap((child: any) => getAllChildIds(child)),
//     ];
//   };

//   // ✅ Tìm danh mục theo id trong cây
//   function findCategoryById(cats: any[], id: string): any | null {
//     for (const cat of cats) {
//       if (cat._id === id) return cat;
//       if (cat.children && cat.children.length > 0) {
//         const found = findCategoryById(cat.children, id);
//         if (found) return found;
//       }
//     }
//     return null;
//   }

//   // ✅ Lọc sản phẩm theo danh mục (bao gồm con)
//   let filteredProducts = [...products];
//   if (selectedCategory !== "All") {
//     const selectedCat = findCategoryById(categories, selectedCategory);
//     const allIds = selectedCat
//       ? getAllChildIds(selectedCat)
//       : [selectedCategory];
//     filteredProducts = products.filter((p) => allIds.includes(p.category_id));
//   }

//   // ✅ Sắp xếp
//   if (sortOption === "price-asc") {
//     filteredProducts.sort((a, b) => a.price - b.price);
//   } else if (sortOption === "price-desc") {
//     filteredProducts.sort((a, b) => b.price - a.price);
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 text-lg animate-pulse">
//         Đang tải dữ liệu...
//       </div>
//     );
//   }

//   // ✅ Render danh mục cha – con
//   const renderCategoryTree = (cats: any[], level = 0) => {
//     if (!Array.isArray(cats)) return null; // ✅ Tránh lỗi map
//     return cats.map((cat) => (
//       <li key={cat._id} className={`ml-${level * 2}`}>
//         <button
//           onClick={() => setSelectedCategory(cat._id)}
//           className={`w-full text-left px-3 py-2 rounded-lg transition ${
//             selectedCategory === cat._id
//               ? "bg-orange-500 text-white"
//               : "text-gray-700 hover:bg-gray-100"
//           }`}
//         >
//           {level > 0 && <span className="mr-1">↳</span>}
//           {cat.name}
//         </button>
//         {cat.children && cat.children.length > 0 && (
//           <ul className="ml-4 mt-1 space-y-1">
//             {renderCategoryTree(cat.children, level + 1)}
//           </ul>
//         )}
//       </li>
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
//         {/* Sidebar */}
//         <aside className="md:col-span-1 bg-white p-6 rounded-2xl shadow">
//           <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
//           <ul className="space-y-2">
//             <li>
//               <button
//                 onClick={() => setSelectedCategory("All")}
//                 className={`w-full text-left px-3 py-2 rounded-lg transition ${
//                   selectedCategory === "All"
//                     ? "bg-orange-500 text-white"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 Tất cả
//               </button>
//             </li>
//             {renderCategoryTree(categories)}
//           </ul>
//         </aside>

//         {/* Product Grid */}
//         <main className="md:col-span-3">
//           <div className="flex justify-between items-center mb-6">
//             <p className="text-gray-600">
//               {filteredProducts.length} sản phẩm được tìm thấy
//             </p>

//             <select
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="featured">Sắp xếp: Nổi bật</option>
//               <option value="price-asc">Giá tăng dần</option>
//               <option value="price-desc">Giá giảm dần</option>
//             </select>
//           </div>

//           {filteredProducts.length === 0 ? (
//             <p className="text-gray-500">
//               Không có sản phẩm trong danh mục này.
//             </p>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8">
//               {filteredProducts.map((p, index) => (
//                 <motion.div
//                   key={p._id}
//                   className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition relative border border-transparent hover:border-orange-200"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03, duration: 0.25 }}
//                 >
//                   {p.discount > 0 && (
//                     <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//                       -{p.discount}%
//                     </span>
//                   )}
//                   <Link to={`/product/${p._id}`}>
//                     <img
//                       src={p.image}
//                       alt={p.title}
//                       className="w-full h-72 object-cover"
//                     />
//                   </Link>

//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
//                       {p.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 mb-1">
//                       {findCategoryById(categories, p.category_id)?.name ||
//                         "Không rõ danh mục"}
//                     </p>
//                     <div className="flex flex-col items-start">
//                       {p.discount > 0 && (
//                         <p className="text-sm text-gray-400 line-through">
//                           {p.price.toLocaleString()} VND
//                         </p>
//                       )}
//                       <p className="font-bold text-orange-600 text-lg">
//                         {Math.round(
//                           p.price * (1 - (p.discount || 0) / 100)
//                         ).toLocaleString()}{" "}
//                         VND
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CategoryPage;


"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";

interface Product {
  _id: string;
  title: string;
  price: number;
  discount: number;
  category_id: string;
  image: string;
}

interface Category {
  _id: string;
  name: string;
  children?: Category[];
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, cateRes] = await Promise.all([
          axios.get("http://localhost:3001/api/products"),
          axios.get("http://localhost:3001/categories/tree"),
        ]);

        const categoriesData = cateRes.data?.categoryTree || [];
        const productsData = prodRes.data || [];

        const productsWithImages = await Promise.all(
          productsData.map(async (item: any) => {
            let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
            try {
              const imgRes = await axios.get(
                `http://localhost:3001/api/assets/${item._id}`
              );
              const imgList = imgRes.data?.images || imgRes.data || [];
              if (imgList.length > 0) imageUrl = imgList[0].path;
            } catch {
              console.warn(`⚠️ Không lấy được ảnh cho ${item._id}`);
            }
            return { ...item, image: imageUrl };
          })
        );

        setCategories(categoriesData);
        setProducts(productsWithImages);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Lấy danh sách tất cả category con (đệ quy)
  const getAllChildIds = (cat: any): string[] => {
    if (!cat.children || cat.children.length === 0) return [cat._id];
    return [
      cat._id,
      ...cat.children.flatMap((child: any) => getAllChildIds(child)),
    ];
  };

  // Tìm danh mục theo id trong cây
  function findCategoryById(cats: any[], id: string): any | null {
    for (const cat of cats) {
      if (cat._id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Lọc sản phẩm theo danh mục (bao gồm con)
  let filteredProducts = [...products];
  if (selectedCategory !== "All") {
    const selectedCat = findCategoryById(categories, selectedCategory);
    const allIds = selectedCat
      ? getAllChildIds(selectedCat)
      : [selectedCategory];
    filteredProducts = products.filter((p) => allIds.includes(p.category_id));
  }

  // Sắp xếp
  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-xl w-96 mx-auto animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-xl w-64 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render danh mục cha – con
  const renderCategoryTree = (cats: any[], level = 0) => {
    if (!Array.isArray(cats)) return null;
    return cats.map((cat) => (
      <li key={cat._id} className={`ml-${level * 2}`}>
        <button
          onClick={() => setSelectedCategory(cat._id)}
          className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat._id
              ? "bg-emerald-500 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          {level > 0 && <span className="mr-1">↳</span>}
          {cat.name}
        </button>
        {cat.children && cat.children.length > 0 && (
          <ul className="ml-4 mt-1 space-y-1">
            {renderCategoryTree(cat.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tiêu đề danh mục */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-4">
            {findCategoryById(categories, selectedCategory)?.name || "Tất cả danh mục"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>{filteredProducts.length} sản phẩm</span>
            <span>•</span>
            <span>Trang {currentPage}/{totalPages}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar danh mục */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === "All"
                      ? "bg-emerald-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  Tất cả
                </button>
              </li>
              {renderCategoryTree(categories)}
            </ul>
          </aside>

          {/* Nội dung chính */}
          <main className="lg:col-span-3">
            {/* Bộ lọc và sắp xếp */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600">
                {filteredProducts.length} sản phẩm
              </p>
              <div className="flex flex-wrap gap-3">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Sắp xếp: Nổi bật</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700">Không có sản phẩm nào</h3>
                <p className="text-gray-500 mt-2">Thử chọn danh mục khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentProducts.map((product, index) => {
                  const oldPrice = product.price;
                  const newPrice = Math.round(oldPrice * (1 - product.discount / 100));
                  const saved = oldPrice - newPrice;

                  return (
                    <Link key={product._id} to={`/product/${product._id}`} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-visible group"
                      >
                        {/* Ảnh sách */}
                        <div className="relative bg-gray-50 pt-[125%] overflow-visible">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Nhãn nổi bật nếu có */}
                          {product.discount > 0 && (
                            <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                              <div className="relative bg-gradient-to-br from-red-600 to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-orange-300">
                                <span>-{product.discount}%</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Thông tin sách */}
                        <div className="px-3 pt-2 pb-3 text-left space-y-1">
                          <div className="text-lg font-bold text-red-600 leading-none">
                            {newPrice.toLocaleString()}đ
                          </div>

                          {product.discount > 0 && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-gray-400 line-through">
                                {oldPrice.toLocaleString()}đ
                              </span>
                              <span className="bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded text-xs">
                                -{product.discount}%
                              </span>
                            </div>
                          )}

                          {product.discount > 0 && (
                            <div className="text-xs font-medium text-green-600">
                              Giảm {saved.toLocaleString()}đ
                            </div>
                          )}

                          <h3 className="text-sm truncate text-gray-800 leading-tight line-clamp-2">
                            {product.title}
                          </h3>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Hiển thị các nút trang */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = pageNum === currentPage;

                  // Chỉ hiển thị các nút trang gần trang hiện tại
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => paginate(pageNum)}
                        className={`w-10 h-10 rounded-full ${isCurrent
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  // Hiển thị dấu ... nếu cần
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={i} className="px-2">...</span>
                    );
                  }

                  return null;
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;