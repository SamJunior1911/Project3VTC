import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Trash2, CreditCard } from "lucide-react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Header = () => {
  return /* @__PURE__ */ jsx("header", { className: "bg-white shadow-md sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-500", children: "BookStore" }),
    /* @__PURE__ */ jsxs("nav", { className: "space-x-6 hidden md:flex", children: [
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-orange-500", children: "Home" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-orange-500", children: "Categories" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-orange-500", children: "Bestsellers" }),
      /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-orange-500", children: "New Arrivals" }),
      /* @__PURE__ */ jsx("a", { href: "/cart", className: "hover:text-orange-500", children: "Offers" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search books...",
          className: "border rounded-md px-3 py-1 hidden md:block"
        }
      ),
      /* @__PURE__ */ jsx("a", { href: "/cart", className: "hover:text-orange-500", children: "Offers" }),
      /* @__PURE__ */ jsx("button", { className: "text-gray-600 hover:text-orange-500", children: "👤" })
    ] })
  ] }) });
};
const Hero = () => {
  return /* @__PURE__ */ jsx("section", { className: "bg-orange-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center p-8 md:p-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:w-1/2", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "Khám phá thế giới sách hay" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-6", children: "Tìm những cuốn sách yêu thích, từ bestsellers đến sách mới ra mắt." }),
      /* @__PURE__ */ jsx("button", { className: "bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600", children: "Mua Ngay" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "md:w-1/2 mt-8 md:mt-0", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        alt: "Books",
        className: "rounded-lg shadow-lg"
      }
    ) })
  ] }) });
};
const categories = [
  {
    id: 1,
    name: "Fiction",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba"
  },
  {
    id: 2,
    name: "Science",
    img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
  },
  {
    id: 3,
    name: "History",
    img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439"
  },
  {
    id: 4,
    name: "Art",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
  }
];
const Categories = () => {
  return /* @__PURE__ */ jsxs("section", { className: "max-w-7xl mx-auto p-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6", children: "Danh mục sách" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: categories.map((cat) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: cat.img,
              alt: cat.name,
              className: "h-40 w-full object-cover"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "p-4 text-center font-semibold", children: cat.name })
        ]
      },
      cat.id
    )) })
  ] });
};
const API_PRODUCT = axios.create({
  baseURL: "http://localhost:3001/api",
  // Product Service
  headers: {
    "Content-Type": "application/json"
  }
});
const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API_PRODUCT.get("/products");
        const productsWithImages = await Promise.all(
          res.data.map(async (item) => {
            let imageUrl = "https://via.placeholder.com/300x400?text=No+Image";
            try {
              const imageRes = await API_PRODUCT.get(`/assets/${item._id}`);
              if (imageRes.data && imageRes.data.length > 0) {
                imageUrl = imageRes.data[0].path;
              }
            } catch {
              console.warn("Không tìm thấy ảnh cho sản phẩm:", item._id);
            }
            return {
              id: item._id,
              title: item.title,
              author: item.author || "Chưa có tác giả",
              price: item.price || 0,
              img: imageUrl
            };
          })
        );
        setBooks(productsWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center min-h-[300px]", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" }) });
  }
  return /* @__PURE__ */ jsxs("section", { className: "max-w-7xl mx-auto px-6 py-12 bg-white", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-extrabold text-gray-800 mb-10 text-center", children: /* @__PURE__ */ jsx("span", { className: "border-b-4 border-orange-500 pb-2", children: "Sản Phẩm Nổi Bật" }) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
        children: books.map((book, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            onClick: () => navigate(`/product/${book.id}`),
            className: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-orange-400 transition-all duration-200 cursor-pointer overflow-hidden group",
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.05 },
            children: [
              /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: book.img,
                  alt: book.title,
                  className: "h-60 w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition", children: book.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-xs mt-1", children: book.author }),
                /* @__PURE__ */ jsxs("p", { className: "text-orange-600 font-bold mt-2", children: [
                  book.price.toLocaleString(),
                  "đ"
                ] })
              ] })
            ]
          },
          book.id
        ))
      }
    )
  ] });
};
const bestsellers = [
  {
    id: 1,
    title: "Bestseller 1",
    author: "Author A",
    price: "180.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  },
  {
    id: 2,
    title: "Bestseller 2",
    author: "Author B",
    price: "210.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  },
  {
    id: 3,
    title: "Bestseller 3",
    author: "Author C",
    price: "130.000đ",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
  }
];
const Bestsellers = () => {
  return /* @__PURE__ */ jsxs("section", { className: "bg-gray-100 p-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-6 text-center", children: "Sách bán chạy" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6", children: bestsellers.map((book) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: book.img,
              alt: book.title,
              className: "h-48 w-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: book.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm", children: book.author }),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 font-bold mt-2", children: book.price }),
            /* @__PURE__ */ jsx("button", { className: "mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600", children: "Thêm vào giỏ" })
          ] })
        ]
      },
      book.id
    )) })
  ] });
};
const Newsletter = () => {
  return /* @__PURE__ */ jsx("section", { className: "bg-orange-100 p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Đăng ký nhận tin" }),
    /* @__PURE__ */ jsx("p", { className: "mb-6 text-gray-700", children: "Nhận thông tin sách mới và ưu đãi hấp dẫn hàng tuần" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          placeholder: "Nhập email của bạn",
          className: "px-4 py-2 rounded-md border"
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600", children: "Đăng ký" })
    ] })
  ] }) });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-800 text-white p-8 mt-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-xl mb-2", children: "BookStore" }),
      /* @__PURE__ */ jsx("p", { children: "Khám phá và mua sách dễ dàng, nhanh chóng." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 md:mt-0", children: /* @__PURE__ */ jsx("p", { children: "© 2025 BookStore. All rights reserved." }) })
  ] }) });
};
const App2 = () => {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white font-sans",
    children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("section", {
      className: "relative z-10",
      children: /* @__PURE__ */ jsx(Hero, {})
    }), /* @__PURE__ */ jsx("section", {
      className: "py-12",
      children: /* @__PURE__ */ jsx(Categories, {})
    }), /* @__PURE__ */ jsx(Toaster, {
      position: "bottom-center",
      theme: "light",
      expand: true,
      toastOptions: {
        style: {
          fontSize: "16px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
        }
      }
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16 bg-white shadow-inner",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-6",
        children: /* @__PURE__ */ jsx(FeaturedBooks, {})
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16 bg-gradient-to-r from-orange-100 to-orange-50",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-7xl mx-auto px-6",
        children: /* @__PURE__ */ jsx(Bestsellers, {})
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "py-16 bg-white",
      children: /* @__PURE__ */ jsx(Newsletter, {})
    }), /* @__PURE__ */ jsx(Footer, {})]
  });
};
const home = UNSAFE_withComponentProps(App2);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
function CreateProduct() {
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    author: "",
    description: "",
    price: "",
    discount: "",
    quantity: "",
    status: "active",
    is_feature: false
  });
  const [isShow, setIsShow] = useState(false);
  const [images, setImages] = useState(null);
  const [allAttributes, setAllAttributes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [categories2, setCategories] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/api/categories").then((res) => setCategories(res.data.data)).catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios.get("http://localhost:3001/api/attributes").then((res) => setAllAttributes(res.data.data || res.data)).catch((err) => console.error("Lỗi khi tải attributes:", err));
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    if (e.target.files) setImages(e.target.files);
  };
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { attribute_id: "", type: "radio", values: [], selectedValues: [] }
    ]);
  };
  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };
  const handleValuesChange = (index, valuesStr) => {
    const updated = [...attributes];
    updated[index].values = valuesStr.split(",").map((v) => v.trim()).filter((v) => v !== "");
    updated[index].selectedValues = [];
    setAttributes(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("files", images[i]);
        }
      }
      const attributesToSend = attributes.map((a) => ({
        attribute_id: a.attribute_id,
        type: a.type,
        values: Array.isArray(a.selectedValues) && a.selectedValues.length > 0 ? a.selectedValues : a.values
      }));
      console.log("📦 Gửi attributes:", attributesToSend);
      formData.append("attributes", JSON.stringify(attributesToSend));
      const res = await axios.post(
        "http://localhost:3001/api/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert("✅ Tạo sản phẩm thành công!");
      console.log("Product created:", res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi khi tạo sản phẩm");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-4 max-w-2xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-3", children: "Tạo sản phẩm mới" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        name: "category_id",
        value: form.category_id,
        onChange: handleChange,
        className: "border p-2 w-full",
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "-- Chọn danh mục --" }),
          Array.isArray(categories2) && categories2.map((c) => /* @__PURE__ */ jsx("option", { value: c._id, children: c.name }, c._id))
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        name: "title",
        placeholder: "Tên sản phẩm",
        onChange: handleChange,
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        name: "author",
        placeholder: "Tác giả / thương hiệu",
        onChange: handleChange,
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        name: "price",
        placeholder: "Giá",
        onChange: handleChange,
        type: "number",
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        min: "0",
        name: "discount",
        placeholder: "Giảm giá (%)",
        onChange: handleChange,
        type: "number",
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        name: "quantity",
        placeholder: "Số lượng",
        onChange: handleChange,
        type: "number",
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        name: "description",
        placeholder: "Mô tả sản phẩm",
        onChange: handleChange,
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        multiple: true,
        onChange: handleImageChange,
        className: "border p-2 w-full"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsShow(!isShow), children: isShow ? "🔽 Ẩn thuộc tính" : "🔼 Hiện thuộc tính" }) }),
    isShow && /* @__PURE__ */ jsxs("div", { className: " space-y-3", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Thuộc tính sản phẩm" }),
      attributes.map((attr, i) => /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-b pb-2", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: attr.attribute_id,
            onChange: (e) => handleAttributeChange(i, "attribute_id", e.target.value),
            className: "border p-2 w-full",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "-- Chọn thuộc tính --" }),
              allAttributes.map((a) => /* @__PURE__ */ jsx("option", { value: a._id, children: a.name }, a._id))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: attr.type,
            onChange: (e) => handleAttributeChange(i, "type", e.target.value),
            className: "border p-2 w-full",
            children: [
              /* @__PURE__ */ jsx("option", { value: "radio", children: "Radio" }),
              /* @__PURE__ */ jsx("option", { value: "checkbox", children: "Checkbox" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            placeholder: "Nhập giá trị (phân tách bằng dấu phẩy)",
            onChange: (e) => handleValuesChange(i, e.target.value),
            className: "border p-2 w-full"
          }
        ),
        attr.type === "radio" && attr.values.map((v, idx) => /* @__PURE__ */ jsxs("label", { className: "mr-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: `radio-${i}`,
              checked: attr.selectedValues?.[0] === v,
              onChange: () => {
                const updated = [...attributes];
                updated[i].selectedValues = [v];
                setAttributes(updated);
              }
            }
          ),
          " ",
          v
        ] }, idx)),
        attr.type === "checkbox" && attr.values.map((v, idx) => /* @__PURE__ */ jsxs("label", { className: "mr-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: attr.selectedValues?.includes(v) || false,
              onChange: (e) => {
                const updated = [...attributes];
                let selected = updated[i].selectedValues || [];
                if (e.target.checked) {
                  selected.push(v);
                } else {
                  selected = selected.filter(
                    (item) => item !== v
                  );
                }
                updated[i].selectedValues = selected;
                setAttributes(updated);
              }
            }
          ),
          " ",
          v
        ] }, idx))
      ] }, i)),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: addAttribute,
          className: "bg-blue-500 text-white px-3 py-1 rounded",
          children: "+ Thêm thuộc tính"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "bg-orange-500 text-white px-4 py-2 rounded",
        children: "Tạo sản phẩm"
      }
    )
  ] });
}
function meta$1({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const product = UNSAFE_withComponentProps(function ProductPage() {
  return /* @__PURE__ */ jsx(CreateProduct, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: product,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function CouponPage() {
  const [code, setCode] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3005/api/coupons/validate",
        {
          code,
          total: Number(total)
        }
      );
      setResult(res.data);
    } catch (error) {
      setResult(error.response?.data || { message: "Lỗi không xác định" });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-lg mt-10 p-5 border rounded shadow", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-orange-600 mb-4", children: "🧾 Kiểm tra mã giảm giá" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleApply, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-semibold", children: "Mã Coupon:" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: code,
            onChange: (e) => setCode(e.target.value),
            required: true,
            className: "border rounded px-3 py-2 w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block font-semibold", children: "Tổng đơn hàng (VNĐ):" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "number",
            value: total,
            onChange: (e) => setTotal(e.target.value),
            required: true,
            className: "border rounded px-3 py-2 w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "bg-orange-500 text-white font-semibold px-4 py-2 rounded hover:bg-orange-600",
          children: loading ? "Đang kiểm tra..." : "Áp dụng mã"
        }
      )
    ] }),
    result && /* @__PURE__ */ jsxs("div", { className: "mt-5 p-4 border rounded bg-gray-50", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Kết quả:" }),
      /* @__PURE__ */ jsx("pre", { className: "text-sm mt-2 bg-white p-2 rounded", children: JSON.stringify(result, null, 2) }),
      result.success && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-green-600 font-semibold", children: [
        "Giảm: ",
        result.discount.toLocaleString(),
        "đ",
        /* @__PURE__ */ jsx("br", {}),
        "Tổng sau giảm: ",
        result.total_after_discount.toLocaleString(),
        "đ"
      ] })
    ] })
  ] });
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const coupon = UNSAFE_withComponentProps(function PageC() {
  return /* @__PURE__ */ jsx(CouponPage, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: coupon,
  meta
}, Symbol.toStringTag, { value: "Module" }));
axios.defaults.withCredentials = true;
const CartPage = () => {
  const [cart2, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalPrice = cart2.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:3002/api/cart");
        const items = res.data.cart || [];
        const withImages = await Promise.all(items.map(async (item) => {
          try {
            const imgRes = await axios.get(`http://localhost:3001/api/assets/${item.product_id}`);
            return {
              ...item,
              image: imgRes.data?.[0]?.path || "https://res.cloudinary.com/demo/image/upload/v1699999999/default_product.png"
            };
          } catch {
            return {
              ...item,
              image: "https://res.cloudinary.com/demo/image/upload/v1699999999/default_product.png"
            };
          }
        }));
        setCart(withImages);
      } catch (err) {
        toast.error("Không thể tải giỏ hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.product_id !== id));
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
  };
  if (loading) return /* @__PURE__ */ jsx("div", {
    className: "flex justify-center items-center h-screen",
    children: /* @__PURE__ */ jsx("div", {
      className: "animate-spin rounded-full h-10 w-10 border-4 border-orange-400 border-t-transparent"
    })
  });
  return /* @__PURE__ */ jsxs("section", {
    className: "max-w-7xl mx-auto px-6 py-10 bg-gradient-to-b from-orange-50 to-white min-h-screen",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-between mb-10",
      children: [/* @__PURE__ */ jsxs("h2", {
        className: "text-3xl font-bold text-orange-600 flex items-center gap-2",
        children: [/* @__PURE__ */ jsx(ShoppingCart, {
          className: "w-8 h-8 text-orange-500"
        }), "Giỏ hàng của bạn"]
      }), /* @__PURE__ */ jsxs("button", {
        onClick: () => window.location.href = "/",
        className: "flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-all",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          size: 20
        }), " Tiếp tục mua sắm"]
      })]
    }), cart2.length === 0 ? /* @__PURE__ */ jsxs("div", {
      className: "text-center py-20 bg-white rounded-3xl shadow-xl border border-orange-100",
      children: [/* @__PURE__ */ jsx("img", {
        src: "https://cdn-icons-png.flaticon.com/512/11329/11329060.png",
        alt: "Empty Cart",
        className: "mx-auto w-44 mb-4 opacity-90"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-gray-600 text-lg mb-5",
        children: "Giỏ hàng của bạn đang trống"
      }), /* @__PURE__ */ jsx("button", {
        className: "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 text-white px-10 py-3 rounded-xl font-semibold shadow-lg transition-all",
        onClick: () => window.location.href = "/home",
        children: "🛍️ Mua sắm ngay"
      })]
    }) : /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-10",
      children: [/* @__PURE__ */ jsx("div", {
        className: "lg:col-span-2 space-y-6",
        children: /* @__PURE__ */ jsx(AnimatePresence, {
          children: cart2.map((item, index) => /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 30
            },
            animate: {
              opacity: 1,
              y: 0
            },
            exit: {
              opacity: 0,
              scale: 0.95
            },
            transition: {
              delay: index * 0.04,
              duration: 0.3
            },
            className: "flex items-center justify-between gap-6 bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all duration-300",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-5",
              children: [/* @__PURE__ */ jsx(motion.img, {
                whileHover: {
                  scale: 1.05
                },
                src: item.image,
                alt: item.title,
                className: "w-28 h-28 object-cover rounded-xl shadow-sm border border-gray-100"
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "font-semibold text-gray-800 text-lg line-clamp-1",
                  children: item.title
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-gray-500 text-sm mt-1",
                  children: ["Số lượng:", " ", /* @__PURE__ */ jsx("span", {
                    className: "font-medium text-gray-700",
                    children: item.quantity
                  })]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-orange-500 font-semibold mt-2",
                  children: [item.price.toLocaleString(), "đ"]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col items-end gap-2",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-lg font-bold text-orange-600",
                children: [(item.price * item.quantity).toLocaleString(), "đ"]
              }), /* @__PURE__ */ jsx(motion.button, {
                whileTap: {
                  scale: 0.9
                },
                className: "text-gray-400 hover:text-red-500 transition-all",
                onClick: () => handleRemove(item.product_id),
                children: /* @__PURE__ */ jsx(Trash2, {
                  size: 20
                })
              })]
            })]
          }, item.product_id))
        })
      }), /* @__PURE__ */ jsxs(motion.div, {
        initial: {
          opacity: 0,
          x: 40
        },
        animate: {
          opacity: 1,
          x: 0
        },
        transition: {
          duration: 0.4
        },
        className: "bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 p-8 h-fit sticky top-10",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2",
          children: "🧾 Tổng kết đơn hàng"
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-3 text-gray-700",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex justify-between",
            children: [/* @__PURE__ */ jsx("span", {
              children: "Tổng sản phẩm:"
            }), /* @__PURE__ */ jsx("span", {
              children: cart2.length
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "border-t pt-3 flex justify-between text-lg font-bold text-orange-600",
            children: [/* @__PURE__ */ jsx("span", {
              children: "Tổng cộng:"
            }), /* @__PURE__ */ jsxs("span", {
              children: [totalPrice.toLocaleString(), "đ"]
            })]
          })]
        }), /* @__PURE__ */ jsxs(motion.button, {
          whileHover: {
            scale: 1.03
          },
          whileTap: {
            scale: 0.95
          },
          className: "mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2",
          onClick: () => window.location.href = "/checkout",
          children: [/* @__PURE__ */ jsx(CreditCard, {
            size: 20
          }), " Thanh toán ngay"]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-500 mt-4 text-center",
          children: "*Tổng tiền đã bao gồm thuế (nếu có)"
        })]
      })]
    })]
  });
};
const cart = UNSAFE_withComponentProps(CartPage);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cart
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BsK-XbqR.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/index-29VLREAS.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-2h_iE9d4.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/index-29VLREAS.js"], "css": ["/assets/root-DK8XQQge.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/home": { "id": "pages/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-6ssnat8L.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/proxy-DEVxXJM5.js", "/assets/index-ngrFHoWO.js", "/assets/index-29VLREAS.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/product": { "id": "routes/product", "parentId": "root", "path": "/product", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/product-C_pKP8Rn.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/index-ngrFHoWO.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/coupon": { "id": "routes/coupon", "parentId": "root", "path": "/coupon", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/coupon-e9oMx9ga.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/index-ngrFHoWO.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/cart": { "id": "pages/cart", "parentId": "root", "path": "/cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/cart-LCEzgNLj.js", "imports": ["/assets/chunk-NISHYRIK-G1YWtZ6E.js", "/assets/index-ngrFHoWO.js", "/assets/proxy-DEVxXJM5.js", "/assets/index-29VLREAS.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-67b36d3b.js", "version": "67b36d3b", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "pages/home": {
    id: "pages/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/product": {
    id: "routes/product",
    parentId: "root",
    path: "/product",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/coupon": {
    id: "routes/coupon",
    parentId: "root",
    path: "/coupon",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/cart": {
    id: "pages/cart",
    parentId: "root",
    path: "/cart",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
