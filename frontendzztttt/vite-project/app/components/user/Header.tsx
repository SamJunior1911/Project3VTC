// src/components/Header.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import API_CART from "~/api/Cart";
import API_CUSTOMER from "~/api/Customer";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  _id: string;
  title: string;
  price?: number;
  author?: string;
  image?: string;
  category_id?: { name?: string };
}

const FlyingNumber = ({
  count,
  x,
  y,
}: {
  count: number;
  x: number;
  y: number;
}) => (
  <motion.div
    initial={{ x, y, scale: 0, opacity: 1 }}
    animate={{ x: 60, y: -320, scale: 1.6, opacity: 0 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    className="fixed pointer-events-none z-[9999] font-black text-3xl text-emerald-600 drop-shadow-2xl"
    style={{ left: x, top: y }}
  >
    +{count}
  </motion.div>
);

const Header: React.FC = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [flyingNumbers, setFlyingNumbers] = useState<
    { id: number; count: number; x: number; y: number }[]
  >([]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const updateCartDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // --- updateCartCount: hỗ trợ sessionStorage (chưa login) & API (đã login)
  const updateCartCount = async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) {
        // CHỈ ĐỌC pending_cart – định dạng chuẩn: [{ product_id, quantity }]
        let pendingCart: { product_id: string; quantity: number }[] = [];
        try {
          const raw = sessionStorage.getItem("pending_cart");
          if (raw) pendingCart = JSON.parse(raw);
        } catch {
          pendingCart = [];
        }

        const total = pendingCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
        return;
      }

      // Đã login → gọi API như cũ
      const res = await API_CART.get("/cart");
      const items = res.data?.cart || [];
      const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(total);
    } catch (err) {
      console.error("Lỗi cập nhật số lượng giỏ hàng:", err);
      setCartCount(0);
    }
  };

  // --- mount: lấy profile (nếu có token) và cập nhật cart lần đầu
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API_CUSTOMER.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setCustomer(res.data))
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        });
    }

    updateCartCount();

    // handle cartUpdated và storage event (debounce)
    const handleCartUpdate = () => {
      if (updateCartDebounceRef.current) {
        clearTimeout(updateCartDebounceRef.current);
      }
      updateCartDebounceRef.current = setTimeout(() => {
        updateCartCount();
      }, 400);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
      if (updateCartDebounceRef.current)
        clearTimeout(updateCartDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- lắng nghe custom addToCart event (nếu nơi khác dispatch), để hiển thị flying number và update cart
  useEffect(() => {
    const handleAddToCart = (e: Event) => {
      // event có thể là CustomEvent với detail
      const detail = (e as CustomEvent)?.detail || {};
      const { count = 1, x = 0, y = 0 } = detail;
      const id = Date.now();
      setFlyingNumbers((prev) => [...prev, { id, count, x, y }]);
      // remove sau 1s
      setTimeout(() => {
        setFlyingNumbers((prev) => prev.filter((it) => it.id !== id));
      }, 1000);

      // update cart count sau khi add
      updateCartCount();
    };

    window.addEventListener("addToCart" as any, handleAddToCart);
    return () => {
      window.removeEventListener("addToCart" as any, handleAddToCart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- debounce search + fetch images for each result
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/search?q=${encodeURIComponent(searchTerm)}`
        );
        const items: any[] = res.data?.results || [];

        const dataWithImages: SearchResult[] = await Promise.all(
          items.slice(0, 8).map(async (item: any) => {
            let image =
              "https://via.placeholder.com/300x400/10b981/ffffff?text=No+Image";
            try {
              const imgRes = await axios.get(
                `http://localhost:3001/api/assets/${item._id}`
              );
              if (imgRes.data?.[0]?.path) image = imgRes.data[0].path;
            } catch (err) {
              // ignore
            }
            return {
              _id: item._id,
              title: item.title,
              price: item.price,
              author: item.author,
              image,
              category_id: item.category_id,
            } as SearchResult;
          })
        );

        setResults(dataWithImages);
        setShowDropdown(true);
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  // --- click outside để đóng dropdown search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/product/${id}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCustomer(null);
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-emerald-100 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* LOGO */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <Box
                  component="img"
                  src="/image/logo.png"
                  alt="BookStore"
                  sx={{
                    width: 80,
                    height: 80,
                    // borderRadius: "50%",
                    // objectFit: "cover",
                  }}
                // className="border-4 border-emerald-100 shadow-xl group-hover:scale-110 transition-transform duration-300"
                />
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="hidden sm:block font-black text-3xl bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent"
                >
                  BookStore
                </motion.span>
              </Link>
            </div>

            {/* NAV */}
            <nav className="hidden lg:flex flex-1 justify-center items-center gap-12 ml-12">
              {["Trang chủ", "Danh mục", "Bán chạy", "Sách mới"].map(
                (name, i) => {
                  const paths = [
                    "/",
                    "/categories",
                    "/bestsellers",
                    "/new-arrivals",
                  ];
                  return (
                    <Link
                      key={name}
                      to={paths[i]}
                      className="text-gray-700 font-semibold text-lg hover:text-emerald-600 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 after:transition-all after:duration-300 hover:after:w-full"
                    >
                      {name}
                    </Link>
                  );
                }
              )}
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Search */}
              <div className="relative hidden md:block" ref={searchRef}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm sách, tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => results.length > 0 && setShowDropdown(true)}
                  className="w-80 pl-12 pr-5 py-3.5 bg-emerald-50/80 border-2 border-emerald-200 rounded-full focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 font-medium text-gray-800 placeholder:text-emerald-600"
                />
                <AnimatePresence>
                  {showDropdown && results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-3 left-0 right-0 bg-white rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden z-50"
                    >
                      <div className="max-h-96 overflow-y-auto">
                        {results.map((item) => (
                          <div
                            key={item._id}
                            onMouseDown={() => handleSelect(item._id)}
                            className="flex items-center gap-4 p-4 hover:bg-emerald-50 cursor-pointer transition-all border-b border-emerald-50 last:border-b-0"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-20 object-cover rounded-lg shadow-md border border-emerald-200"
                              onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/300x400/10b981/ffffff?text=No+Image")
                              }
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-sm font-bold text-emerald-600">
                                {item.price?.toLocaleString("vi-VN")}₫
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-3 hover:bg-emerald-100 rounded-full transition-all"
              >
                <ShoppingCart className="w-7 h-7 text-gray-700" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden p-3 hover:bg-emerald-100 rounded-full"
              >
                {mobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>

              {/* Login / Avatar */}
              {!customer ? (
                <Link
                  to="/login"
                  className="hidden md:block bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-5 py-2.5 text-sm rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Đăng nhập
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-10 h-10 cursor-pointer ring-4 ring-emerald-100 hover:ring-emerald-300 transition-all hover:scale-110 shadow-lg">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                        {customer.fullName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 p-5 bg-white rounded-3xl shadow-2xl border-2 border-emerald-100"
                  >
                    <DropdownMenuLabel className="text-xl font-bold text-emerald-700">
                      {customer.fullName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-emerald-200" />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile/purchase"
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-emerald-50"
                      >
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                        <span className="font-medium">Đơn hàng</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-emerald-50"
                      >
                        <User className="w-6 h-6 text-emerald-600" />
                        <span className="font-medium">Tài khoản</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-emerald-200" />
                    <DropdownMenuItem
                      onSelect={logout}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-600 font-bold"
                    >
                      <LogOut className="w-6 h-6" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t-4 border-emerald-200 bg-white"
              >
                <div className="py-6 px-4 space-y-3">
                  {["Trang chủ", "Danh mục", "Bán chạy", "Sách mới"].map(
                    (name, i) => {
                      const paths = [
                        "/",
                        "/categories",
                        "/bestsellers",
                        "/new-arrivals",
                      ];
                      return (
                        <Link
                          key={name}
                          to={paths[i]}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-4 text-lg font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl"
                        >
                          {name}
                        </Link>
                      );
                    }
                  )}
                  {!customer && (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 rounded-full text-lg mt-4"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Flying numbers */}
      <AnimatePresence>
        {flyingNumbers.map((item) => (
          <FlyingNumber
            key={item.id}
            count={item.count}
            x={item.x}
            y={item.y}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default Header;
