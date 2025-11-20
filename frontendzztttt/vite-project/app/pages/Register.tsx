// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "../components/ui/card";
// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { Eye, EyeOff } from "lucide-react";
// import API_CUSTOMER from "~/api/Customer";
// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.id]: e.target.value });
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (form.password !== form.confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Mật khẩu không khớp",
//         text: "Vui lòng nhập lại mật khẩu cho khớp.",
//         confirmButtonColor: "#f97316",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await API_CUSTOMER.post("/register", {
//         fullName: form.fullName,
//         email: form.email,
//         password: form.password,
//       });

//       if (res.status === 201 || res.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "Đăng ký thành công!",
//           text: "Bạn sẽ được chuyển đến trang đăng nhập.",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         setTimeout(() => {
//           window.location.href = "/login";
//         }, 1500);
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Đăng ký thất bại",
//           text: res.data?.message || "Vui lòng thử lại sau.",
//           confirmButtonColor: "#f97316",
//         });
//       }
//     } catch (error: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Lỗi máy chủ",
//         text: error.response?.data?.message || "Vui lòng thử lại sau.",
//         confirmButtonColor: "#f97316",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleRegister = () => {
//     window.location.href = `${API_CUSTOMER.defaults.baseURL}/google`;
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen  px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Card className="w-full max-w-5xl p-6 shadow-2xl border border-orange-200 bg-white/90 backdrop-blur-md rounded-2xl">
//           <CardHeader>
//             <CardTitle className="text-center text-3xl font-bold text-black-800">
//               Tạo tài khoản
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="w-xl">
//             <form onSubmit={handleRegister} className="space-y-5">
//               {/* Họ và Tên */}
//               <div className="grid grid-cols-1 gap-3">
//                 <div className="space-y-2">
//                   <Label htmlFor="fullName">Họ và tên</Label>
//                   <Input
//                     id="fullName"
//                     type="text"
//                     placeholder="Nguyễn Văn A"
//                     required
//                     value={form.fullName}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   required
//                   value={form.email}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Mật khẩu */}
//               <div className="space-y-2">
//                 <Label htmlFor="password">Mật khẩu</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     required
//                     value={form.password}
//                     onChange={handleChange}
//                     className="pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Nhập lại mật khẩu */}
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
//                 <div className="relative">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirm ? "text" : "password"}
//                     placeholder="••••••••"
//                     required
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     className="pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm(!showConfirm)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
//                   >
//                     {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Nút đăng ký */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
//               >
//                 {loading ? "Đang đăng ký..." : "Đăng ký"}
//               </Button>

//               {/* Divider */}
//               <div className="flex items-center gap-2">
//                 <div className="h-[1px] bg-gray-300 w-full" />
//                 <span className="text-gray-500 text-sm">hoặc</span>
//                 <div className="h-[1px] bg-gray-300 w-full" />
//               </div>

//               {/* Google */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 rounded-xl"
//                 onClick={handleGoogleRegister}
//               >
//                 <FcGoogle size={22} /> Đăng ký với Google
//               </Button>
//             </form>

//             <p className="text-center text-sm text-gray-500 mt-4">
//               Đã có tài khoản?{" "}
//               <a
//                 href="/login"
//                 className="text-orange-600 font-semibold hover:underline"
//               >
//                 Đăng nhập ngay
//               </a>
//             </p>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Eye, EyeOff, Leaf, Chrome, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import API_CUSTOMER from "~/api/Customer";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không khớp!",
        confirmButtonColor: "#f97316",
      });
      return;
    }
    try {
      setLoading(true);
      await API_CUSTOMER.post("/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chào mừng bạn đến với BookStore!",
        timer: 1500,
        showConfirmButton: false,
        background: "#ecfdf5",
        color: "#065f46",
      });
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: error.response?.data?.message || "Vui lòng thử lại!",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${API_CUSTOMER.defaults.baseURL}/google`;
  };

  // 40 lá rơi dày đặc
  const leaves = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 12,
    duration: 18 + Math.random() * 20,
    left: Math.random() * 100 + "%",
    rotate: Math.random() * 720,
    size: 20 + Math.random() * 25,
    opacity: 0.3 + Math.random() * 0.4,
    sway: 40 + Math.random() * 60,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-teal-50 relative overflow-hidden flex items-center justify-center px-4">
      {/* 40 lá rơi */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -200, opacity: 0 }}
          animate={{
            y: "120vh",
            x: [0, leaf.sway, -leaf.sway, leaf.sway / 2, -leaf.sway / 2, 0],
            opacity: [0, leaf.opacity, leaf.opacity, leaf.opacity * 0.8, 0],
            rotate: leaf.rotate + 1080,
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
          style={{ left: leaf.left }}
          className="absolute pointer-events-none z-0"
        >
          <Leaf className="text-emerald-600/60 drop-shadow-md" style={{ width: leaf.size, height: leaf.size }} />
        </motion.div>
      ))}

      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-emerald-800 hover:bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-md border border-emerald-200 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Trang chủ
      </Button>

      {/* CARD NGẮN HẸP, RỘNG RA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-emerald-200 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pt-6 pb-3">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl mb-3">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Tạo tài khoản
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6 space-y-3">
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <Label htmlFor="fullName" className="text-sm">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="h-10 mt-1 border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="h-10 mt-1 border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="h-10 pr-10 border-emerald-200 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm">Nhập lại mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="h-10 pr-10 border-emerald-200 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl"
              >
                {loading ? "Đang tạo..." : "Đăng ký ngay"}
              </Button>
            </form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-emerald-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">Hoặc</span></div>
            </div>

            <Button
              onClick={handleGoogleRegister}
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-3 border-2 hover:border-emerald-400 hover:bg-emerald-50/50 text-sm"
            >
              <Chrome className="w-4 h-4" />
              Google
            </Button>

            <p className="text-center text-xs text-gray-600 pt-3">
              Đã có tài khoản?{" "}
              <a href="/login" className="font-bold text-emerald-600 hover:underline">
                Đăng nhập ngay
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}