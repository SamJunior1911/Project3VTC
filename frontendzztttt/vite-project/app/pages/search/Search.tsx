import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { Loader2, ShoppingCart } from "lucide-react";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";
import API_PRODUCT from "~/api/Product";
import BASE_API from "~/api/base_api";
const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12; // ✅ hiển thị 12 sản phẩm / trang = 3 hàng * 4 cột

  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await BASE_API.get(
          `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        );

        const resultsWithImages = await Promise.all(
          (res.data.results || []).map(async (item: any) => {
            let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
            try {
              const imageRes = await API_PRODUCT.get(`/assets/${item._id}`);
              if (imageRes.data && imageRes.data.length > 0) {
                imageUrl = imageRes.data[0].path;
              }
            } catch {
              console.warn("Không tìm thấy ảnh cho:", item._id);
            }
            return { ...item, image: imageUrl };
          })
        );

        setResults(resultsWithImages);
        setTotalResults(res.data.total || resultsWithImages.length);
      } catch (err) {
        console.error(" Lỗi khi tìm kiếm:", err);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const totalPages = Math.ceil(totalResults / limit);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: String(newPage) });
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-800">
          Kết quả tìm kiếm cho{" "}
          <span className="text-orange-500">“{query}”</span>
        </h2>
        <p className="text-gray-500 mb-6">
          Tìm thấy{" "}
          <span className="font-semibold text-gray-700">{totalResults}</span>{" "}
          sản phẩm phù hợp
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : results.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            😔 Không tìm thấy sản phẩm nào phù hợp.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white shadow-md hover:shadow-lg rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.image || "https://via.placeholder.com/300x400"}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    {item.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col justify-between h-[160px]">
                    <div>
                      <h3 className="font-semibold text-base text-gray-800 line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.category_id?.name || "Không rõ danh mục"}
                      </p>
                      <p className="text-orange-600 font-bold">
                        {item.price
                          ? `${item.price.toLocaleString("vi-VN")} ₫`
                          : "Liên hệ"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔸 Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                <button
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
                >
                  ← Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      page === i + 1
                        ? "bg-orange-500 text-white border-orange-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
