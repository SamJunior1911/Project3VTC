// import React from "react";
// import { motion } from "framer-motion";
// import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react";
// import { Box } from "@mui/material";

// const ZaloIcon = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className="text-cyan-400"
//   >
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15h-1v-5h-2v-2h3v7zm5-3.5c-.28 0-.53-.11-.71-.29l-2.29-2.29v4.58h-2V9h2.71l2.29 2.29c.18.18.29.43.29.71v3.5z" />
//   </svg>
// );

// const Footer: React.FC = () => {
//   const currentYear = new Date().getFullYear();

//   const featured = [
//     { name: "Bloomberg", quote: "Sự đổi mới trong thẻ quà tặng" },
//     { name: "URBANDADDY", quote: "Bước tiến công nghệ thanh toán" },
//     { name: "Mashable", quote: "Trẻ trung và hiện đại" },
//     { name: "TNW", quote: "Tốt hơn thẻ quà tặng thông thường" },
//   ];

//   const columns = [
//     {
//       title: "Về chúng tôi",
//       links: [
//         "Giới thiệu",
//         "Tuyển dụng",
//         "Báo chí",
//         "Đánh giá",
//         "Truyền thông",
//       ],
//     },
//     {
//       title: "Doanh nghiệp",
//       links: ["Quà tặng DN", "API", "Đặt số lượng lớn"],
//     },
//     { title: "Pháp lý", links: ["Điều khoản", "Bảo mật", "Quyền lợi"] },
//     {
//       title: "Dịch vụ",
//       links: ["Thẻ quà tặng", "Hướng dẫn", "Tại sao chọn", "Đổi quà", "Hỗ trợ"],
//     },
//   ];

//   return (
//     <footer className="relative mt-16 overflow-hidden bg-white">
//       {/* Wave Background - Nhỏ gọn hơn */}
//       <div className="absolute inset-x-0 top-0 -z-10">
//         <svg
//           viewBox="0 0 1440 200"
//           className="w-full h-32 md:h-40"
//           preserveAspectRatio="none"
//         >
//           <path
//             fill="#292524"
//             d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L0,0Z"
//           />
//         </svg>
//       </div>

//       {/* Featured On - Gọn hơn */}
//       <div className="bg-stone-800 py-8">
//         <div className="max-w-6xl mx-auto px-4">
//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             className="text-center text-white/60 text-xs uppercase tracking-widest mb-6"
//           >
//             Được nhắc đến trên
//           </motion.p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             {featured.map((item, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.08 }}
//               >
//                 <h3 className="text-white font-semibold text-sm">
//                   {item.name}
//                 </h3>
//                 <p className="text-white/50 text-xs italic mt-1">
//                   “{item.quote}”
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Footer - Siêu gọn */}
//       <div className="bg-gradient-to-b from-stone-800 to-stone-900 py-10">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
//             {/* Logo */}
//             <div className="col-span-2 md:col-span-3">
//               <motion.div whileHover={{ scale: 1.03 }}>
//                 <Box
//                   component="img"
//                   src="/image/logo2.png"
//                   alt="BookStore"
//                   sx={{
//                     height: { xs: 160, md: 220 },
//                     width: "auto",
//                     objectFit: "contain",
//                   }}
//                 />
//               </motion.div>
//             </div>

//             {/* 4 cột gọn */}
//             {columns.map((col, i) => (
//               <div
//                 key={i}
//                 className="md:col-span-2 flex flex-col justify-start pt-8 md:pt-10"
//               >
//                 <h4 className="text-white/90 font-medium text-xs uppercase tracking-wider mb-4">
//                   {col.title}
//                 </h4>
//                 <ul className="space-y-2.5">
//                   {col.links.map((link, j) => (
//                     <motion.li
//                       key={j}
//                       whileHover={{ x: 4 }}
//                       transition={{ type: "spring", stiffness: 400 }}
//                     >
//                       <a
//                         href="#"
//                         className="text-white/60 hover:text-white text-xs block transition-colors duration-300"
//                       >
//                         {link}
//                       </a>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* Bottom Bar - Gọn đẹp */}
//           <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
//             <div className="flex flex-col md:flex-row items-center gap-3 text-white/60">
//               <span>© {currentYear} BookStore. Bản quyền đã đăng ký.</span>
//               <div className="flex gap-4">
//                 <a
//                   href="tel:0347011209"
//                   className="hover:text-white flex items-center gap-1"
//                 >
//                   <Phone size={13} /> 0347 011 209
//                 </a>
//                 <a
//                   href="mailto:sle35915@gmail.com"
//                   className="hover:text-white flex items-center gap-1"
//                 >
//                   <Mail size={13} /> sle35915@gmail.com
//                 </a>
//               </div>
//             </div>

//             {/* Social Icons - Zalo đẹp như anh em */}
//             <div className="flex items-center gap-4">
//               <motion.a href="https://facebook.com/" whileHover={{ y: -2 }}>
//                 <Facebook
//                   size={17}
//                   className="text-white/70 hover:text-white"
//                 />
//               </motion.a>
//               {/* <motion.a href="https://zalo.me/0347011209" whileHover={{ y: -2 }}>
//                 <ZaloIcon />
//               </motion.a> */}
//               <motion.a href="#" whileHover={{ y: -2 }}>
//                 <Instagram
//                   size={17}
//                   className="text-white/70 hover:text-white"
//                 />
//               </motion.a>
//               <motion.a href="#" whileHover={{ y: -2 }}>
//                 <Twitter size={17} className="text-white/70 hover:text-white" />
//               </motion.a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Khiên bảo vệ - Bay cao, không lỗi */}
//       {/* Khiên bảo vệ PREMIUM – Y HỆT ICON BẠN GỬI – KHÔNG BAO GIỜ BỊ CẮT */}
//       {/* LOGO ZALO NHỎ GỌN – NHẤN VÀO MỞ CHAT NGAY 0385341244 */}
//       <motion.a
//         href="https://zalo.me/0385341244"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="fixed right-4 bottom-6 md:right-8 md:bottom-10 z-50 flex items-center justify-center"
//         initial={{ scale: 0 }}
//         animate={{
//           scale: 1,
//           y: [0, -10, 0],
//         }}
//         transition={{
//           scale: { duration: 0.8, ease: "backOut" },
//           y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
//         }}
//         whileHover={{ scale: 1.15 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <img
//           src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
//           alt="Chat Zalo"
//           width="60"
//           height="60"
//           className="drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300"
//         />
//       </motion.a>
//     </footer>
//   );
// };

// export default Footer;



// components/Footer.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Phone, Mail, MessageCircle, Sparkles } from "lucide-react";
import { Box } from "@mui/material";
import AIChatBox from "../AIChatBox";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const featured = [
    { name: "Bloomberg", quote: "Sự đổi mới trong thẻ quà tặng" },
    { name: "URBANDADDY", quote: "Bước tiến công nghệ thanh toán" },
    { name: "Mashable", quote: "Trẻ trung và hiện đại" },
    { name: "TNW", quote: "Tốt hơn thẻ quà tặng thông thường" },
  ];

  const columns = [
    { title: "Về chúng tôi", links: ["Giới thiệu", "Tuyển dụng", "Báo chí", "Đánh giá", "Truyền thông"] },
    { title: "Doanh nghiệp", links: ["Quà tặng DN", "API", "Đặt số lượng lớn"] },
    { title: "Pháp lý", links: ["Điều khoản", "Bảo mật", "Quyền lợi"] },
    { title: "Dịch vụ", links: ["Thẻ quà tặng", "Hướng dẫn", "Tại sao chọn", "Đổi quà", "Hỗ trợ"] },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden bg-white">
      {/* ... TOÀN BỘ PHẦN TRÊN GIỮ NGUYÊN (Wave, Featured, Main Footer, Bottom Bar) ... */}
      {/* === GIỮ NGUYÊN TỪ ĐÂY XUỐNG DƯỚI === */}
      <div className="absolute inset-x-0 top-0 -z-10">
        <svg viewBox="0 0 1440 200" className="w-full h-32 md:h-40" preserveAspectRatio="none">
          <path fill="#292524" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L0,0Z" />
        </svg>
      </div>

      <div className="bg-stone-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center text-white/60 text-xs uppercase tracking-widest mb-6">
            Được nhắc đến trên
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {featured.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                <p className="text-white/50 text-xs italic mt-1">“{item.quote}”</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-stone-800 to-stone-900 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
            <div className="col-span-2 md:col-span-3">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Box component="img" src="/image/logo2.png" alt="BookStore" sx={{ height: { xs: 160, md: 220 }, width: "auto", objectFit: "contain" }} />
              </motion.div>
            </div>

            {columns.map((col, i) => (
              <div key={i} className="md:col-span-2 flex flex-col justify-start pt-8 md:pt-10">
                <h4 className="text-white/90 font-medium text-xs uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <motion.li key={j} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                      <a href="#" className="text-white/60 hover:text-white text-xs block transition-colors duration-300">
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex flex-col md:flex-row items-center gap-3 text-white/60">
              <span>© {currentYear} BookStore. Bản quyền đã đăng ký.</span>
              <div className="flex gap-4">
                <a href="tel:0347011209" className="hover:text-white flex items-center gap-1">
                  <Phone size={13} /> 0347 011 209
                </a>
                <a href="mailto:sle35915@gmail.com" className="hover:text-white flex items-center gap-1">
                  <Mail size={13} /> sle35915@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.a href="https://facebook.com/" whileHover={{ y: -2 }}>
                <Facebook size={17} className="text-white/70 hover:text-white" />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }}>
                <Instagram size={17} className="text-white/70 hover:text-white" />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -2 }}>
                <Twitter size={17} className="text-white/70 hover:text-white" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* NÚT CHAT SIÊU ĐẸP */}
      {/* NÚT CHAT SIÊU NHỎ XINH – CHỈ CHUYỂN ĐỘNG NHẸ (2025) */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative group">
          {/* Hiệu ứng "thở" nhẹ nhàng (floating) */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative"
          >
            {/* Vòng sáng mờ khi hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

            {/* Nút chính – nhỏ xinh, gradient xanh lá sang */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-3.5 rounded-full shadow-2xl border border-white/30">
              <MessageCircle size={28} className="text-white" strokeWidth={2.3} />
            </div>

            {/* Badge AI nhỏ tinh tế (không nhấp nháy) */}
            <div className="absolute -top-1.5 -right-1.5 bg-white text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
              AI
            </div>
          </motion.div>

          {/* Tooltip nhẹ nhàng khi hover */}
          <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-2xl">
              Chat với trợ lý AI
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </motion.button>

      {/* CHATBOX */}
      <AIChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </footer>
  );
};

export default Footer;