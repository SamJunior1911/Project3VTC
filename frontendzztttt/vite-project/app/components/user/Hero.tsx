import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const banners = [
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2560&auto=format&fit=crop",
    title: "MÙA SÁCH MỚI",
    highlight: "GIẢM 70%",
    subtitle: "Hàng ngàn tựa sách hay – Chỉ 3 ngày",
    cta: "SĂN DEAL",
    color: "emerald",
  },
  {
    src: "https://images.unsplash.com/photo-1491841573335-6f5f4a9841b7?q=80&w=2560&auto=format&fit=crop",
    title: "BESTSELLER 2025",
    highlight: "ĐÃ CÓ MẶT",
    subtitle: "Top 50 sách bán chạy nhất thế giới",
    cta: "XEM NGAY",
    color: "purple",
  },
  {
    src: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=2560&auto=format&fit=crop",
    title: "FLASH SALE 24H",
    highlight: "CHỈ 29K",
    subtitle: "Giảm sốc cuối tuần – Freeship toàn quốc",
    cta: "CHỐT ĐƠN",
    color: "amber",
  },
  {
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2560&auto=format&fit=crop",
    title: "SÁCH THIẾU NHI",
    highlight: "MUA 1 TẶNG 2",
    subtitle: "Truyện tranh – Đồ chơi giáo dục",
    cta: "CHO BÉ",
    color: "pink",
  },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [hover]);

  const next = () => setIdx((i) => (i + 1) % banners.length);
  const prev = () => setIdx((i) => (i - 1 + banners.length) % banners.length);

  const b = banners[idx];
  const glow = `shadow-${b.color}-500/50`;

  return (
    <section
      className="relative h-[500px] md:h-[680px] lg:h-[500px] overflow-hidden bg-black"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* BG + Grain */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          exit={{ scale: 1.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${b.src})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute inset-0 bg-gradient-to-br from-${b.color}-950/80 via-black/60 to-${b.color}-950/80`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          key={`title${idx}`}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter"
        >
          {b.title}
        </motion.h1>

        <motion.div
          key={`highlight${idx}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className={`mt-6 px-8 py-3 rounded-full bg-${b.color}-500/20 backdrop-blur-xl border-2 border-${b.color}-400/60`}
        >
          <span
            className={`text-4xl md:text-6xl font-black bg-gradient-to-r from-${b.color}-200 to-white bg-clip-text text-transparent`}
          >
            {b.highlight}
          </span>
        </motion.div>

        <motion.p
          key={`sub${idx}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl font-medium"
        >
          {b.subtitle}
        </motion.p>

        {/* CTA BUTTON - ĐỈNH CAO CỦA ĐỈNH CAO */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 relative"
        >
          {/* Nền kính mờ + viền kim cương */}
          <div className="absolute inset-0 -m-4">
            <div
              className={`absolute inset-0 rounded-3xl bg-${b.color}-500/20 backdrop-blur-2xl border border-${b.color}-400/30 shadow-2xl`}
            />
            <motion.div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-${b.color}-400/40 via-white/10 to-${b.color}-400/40 blur-2xl`}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Nút chính */}
          <Link
            to="/shop"
            className={`
  relative px-8 py-5 text-xl md:text-2xl font-bold text-white rounded-2xl
  overflow-hidden transition-all duration-500
  hover:scale-105 active:scale-95
  shadow-2xl hover:shadow-${b.color}-500/90
  bg-gradient-to-r
  ${b.color === "emerald" && "from-emerald-600 to-emerald-400"}
  ${b.color === "purple" && "from-purple-600 to-purple-400"}
  ${b.color === "amber" && "from-amber-600 to-amber-400"}
  ${b.color === "pink" && "from-pink-600 to-pink-400"}
  inline-flex items-center justify-center gap-2 whitespace-nowrap
`}
          >
            <span className="relative z-20 drop-shadow-2xl tracking-tight">
              {b.cta}
            </span>

            {/* Icon mũi tên nhỏ nhấp nháy */}
            {/* <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-white"
            >
              →
            </motion.span> */}

            {/* Shimmer cao cấp - chạy mượt như nước */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            {/* Hạt sáng lấp lánh (như kim cương) */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 3, 0],
                    x: [0, (i % 2 ? 1 : -1) * 60],
                    y: [0, -30],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                  style={{
                    left: `${20 + i * 10}%`,
                    top: "50%",
                  }}
                />
              ))}
            </div>

            {/* Glow bung siêu to khi hover */}
            <motion.div
              className={`absolute -inset-2 rounded-3xl blur-2xl
        ${b.color === "emerald" && "bg-emerald-400"}
        ${b.color === "purple" && "bg-purple-400"}
        ${b.color === "amber" && "bg-amber-400"}
        ${b.color === "pink" && "bg-pink-400"}
      `}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 0.9, scale: 1.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </Link>
        </motion.div>
      </div>

      {/* Arrows - hover only */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full opacity-0 hover:opacity-100 hover:bg-white/20 transition-all duration-300"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full opacity-0 hover:opacity-100 hover:bg-white/20 transition-all duration-300"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots iOS style */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === idx ? "bg-white w-10 shadow-lg" : "bg-white/50"
              }`}
          />
        ))}
      </div>

      {/* Countdown ring */}
      {/* Countdown ring - ĐÃ FIX CHÍNH XÁC 100%, SỐ GIỮA, MƯỢT NHƯ IPHONE */}
      <div className="absolute top-6 right-6 w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          {/* Vòng nền xám */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="7"
            fill="none"
            className="drop-shadow-lg"
          />
          {/* Vòng đếm ngược trắng */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke="white"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={226} // 2π × 36 ≈ 226
            initial={{ strokeDashoffset: 226 }}
            animate={{ strokeDashoffset: hover ? 226 : 0 }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
            className="drop-shadow-2xl"
          />
        </svg>

        {/* Số ở giữa - CHÍNH XÁC 100% */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-3xl font-black drop-shadow-2xl">
            {idx + 1}
          </span>
        </div>

        {/* Hiệu ứng glow nhẹ quanh vòng tròn */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,255,255,0)",
              "0 0 40px rgba(255,255,255,0.4)",
              "0 0 20px rgba(255,255,255,0)",
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
