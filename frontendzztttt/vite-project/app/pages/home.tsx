import { Book } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Bestsellers from "~/components/user/Bestsellers";
import Categories from "~/components/user/Categories";
import FeaturedBooks from "~/components/user/FeaturedBooks";
import Footer from "~/components/user/Footer";
import Header from "~/components/user/Header";
import Hero from "~/components/user/Hero";
import BookList from "~/components/user/BookList";

// NẮNG CHIẾU ỐNG KÍNH – TIA NẮNG RÕ RÀNG, ĐỘNG, SIÊU ĐẸP
const GodRaysSunshine = () => {
  const [dims, setDims] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 2. BỤI NẮNG LẤP LÁNH SIÊU NHIỀU */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          initial={{
            x: Math.random() * dims.w,
            y: dims.h + 50,
          }}
          animate={{
            y: -100,
            x: Math.random() * dims.w,
          }}
          transition={{
            duration: Math.random() * 25 + 20,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        >
          <motion.div
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 ? "#fff" : "#fef08a",
                boxShadow: "0 0 15px #fff, 0 0 30px #fbbf24",
                filter: "blur(0.5px)",
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="font-sans bg-gradient-to-b from-sky-50 via-white to-emerald-50 relative min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <Categories />

      <FeaturedBooks />
      <Bestsellers />

      <Footer />

      {/* TIA NẮNG ỐNG KÍNH – ĐẸP NHƯ PHIM */}
      <GodRaysSunshine />
    </div>
  );
};

export default App;
