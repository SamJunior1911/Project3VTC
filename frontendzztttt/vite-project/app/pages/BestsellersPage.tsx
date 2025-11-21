import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import API_PRODUCT from "~/api/Product";
import Header from "~/components/user/Header";
import Footer from "~/components/user/Footer";

interface Book {
    id: string;
    title: string;
    price: number;
    discount: number;
    sold: number;
    img: string;
    status?: string;
}

const BestsellersPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 15; // 5 cột x 3 hàng

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await API_PRODUCT.get("/products/listproduct");
                const bestsellers = await Promise.all(
                    res.data
                        .filter((item: any) => item.sold > 0 && item.status === "active")
                        .sort((a: any, b: any) => b.sold - a.sold)
                        .map(async (item: any) => {
                            let imageUrl = "https://via.placeholder.com/300x400?text=Sách";
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

    // Phân trang
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(books.length / booksPerPage);

    const paginate = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <div className="h-12 bg-gray-200 rounded-xl w-96 mx-auto animate-pulse mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded-xl w-64 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Tiêu đề */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-4">
                        SÁCH BÁN CHẠY NHẤT
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span>{books.length} sản phẩm</span>
                        <span>•</span>
                        <span>Trang {currentPage}/{totalPages}</span>
                    </div>
                </motion.div>

                {/* Danh sách sách */}
                {currentBooks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">Không có sách bán chạy nào</h3>
                        <p className="text-gray-500 mt-2">Quay lại sau nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {currentBooks.map((book, index) => {
                            const oldPrice = book.price;
                            const newPrice = Math.round(oldPrice * (1 - book.discount / 100));
                            const saved = oldPrice - newPrice;

                            return (
                                <Link key={book.id} to={`/product/${book.id}`} className="block">
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
                                                src={book.img}
                                                alt={book.title}
                                                className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Nhãn Bán Chạy */}
                                            <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                                                <div className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl border border-orange-300 flex items-center gap-1">
                                                    <Flame size={12} />
                                                    <span>BÁN CHẠY</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thông tin sách */}
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

                                            <p className="text-xs text-gray-500">Đã bán {book.sold.toLocaleString()}</p>
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

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrent = pageNum === currentPage;

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

                            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return <span key={i} className="px-2">…</span>;
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

            <Footer />
        </div>
    );
};

export default BestsellersPage;
