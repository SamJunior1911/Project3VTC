import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Brain, Palette, Baby, Globe, Lightbulb, Scale } from "lucide-react";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ReactNode;
  gradient: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Văn học",
    slug: "van-hoc",
    icon: <BookOpen className="w-8 h-8" />,
    gradient: "from-rose-400 to-pink-600",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
  },
  {
    id: 2,
    name: "Kinh tế - Kinh doanh",
    slug: "kinh-te",
    icon: <Scale className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
  },
  {
    id: 3,
    name: "Tâm lý - Kỹ năng",
    slug: "tam-ly",
    icon: <Brain className="w-8 h-8" />,
    gradient: "from-purple-500 to-indigo-600",
    image: "../../../public/image/tamly.png",
  },
  {
    id: 4,
    name: "Thiếu nhi",
    slug: "thieu-nhi",
    icon: <Baby className="w-8 h-8" />,
    gradient: "from-yellow-400 to-orange-500",
    image: "../../../public/image/thieu-nhi.png",
  },
  {
    id: 5,
    name: "Tiểu thuyết",
    slug: "tieu-thuyet",
    icon: <Heart className="w-8 h-8" />,
    gradient: "from-red-500 to-rose-600",
    image: "../../../public/image/tieuthuyet.png",
  },
  {
    id: 6,
    name: "Khoa học - Công nghệ",
    slug: "khoa-hoc",
    icon: <Lightbulb className="w-8 h-8" />,
    gradient: "from-emerald-500 to-teal-600",
    image: "../../../public/image/khoahoc.png",
  },
  {
    id: 7,
    name: "Nghệ thuật - Thiết kế",
    slug: "nghe-thuat",
    icon: <Palette className="w-8 h-8" />,
    gradient: "from-fuchsia-500 to-purple-600",
    image: "../../../public/image/nghethuat.png",
  },
  {
    id: 8,
    name: "Du lịch - Văn hóa",
    slug: "du-lich",
    icon: <Globe className="w-8 h-8" />,
    gradient: "from-sky-500 to-blue-600",
    image: "../../../public/image/dulich.png",
  },
];

const CategoryCard: React.FC<{ category: Category; index: number }> = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-3.5xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      <Link to={`/categories/${category.slug}`} className="block">
        {/* Hình nền + overlay gradient */}
        <div className="relative h-64 md:h-72 lg:h-80">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay gradient + icon + tên */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-4">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-2xl mb-4`}>
              {category.icon}
            </div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-2xl">
              {category.name}
            </h3>
            <p className="text-sm opacity-90 mt-1 font-medium">Khám phá ngay</p>
          </div>

          {/* Hiệu ứng viền phát sáng khi hover */}
          <div className="absolute inset-0 rounded-3.5xl ring-4 ring-transparent group-hover:ring-white/30 transition-all duration-500 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

const Categories: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-emerald-50/50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Khám phá theo danh mục
          </h2>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Hơn 50.000 đầu sách thuộc 20+ thể loại đang chờ bạn
          </p>
          <div className="h-1.5 w-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mt-6" />
        </motion.div>

        {/* Grid danh mục */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Nút xem tất cả */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            to="/categories"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-10 py-5 rounded-full 
                     hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Xem tất cả danh mục
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;