// "use client";

// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "../components/ui/field";
// import { Input } from "../components/ui/input";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { FcGoogle } from "react-icons/fc";
// import API_CUSTOMER from "~/api/Customer";
// import API_CART from "~/api/Cart";
// export async function loader() {
//   return null;
// }

// export default function LoginPage() {
//   const [redirectPath, setRedirectPath] = useState("/");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       setRedirectPath(params.get("redirect") || "/cart");
//     }
//   }, []);

//   // ✅ Hàm xử lý đăng nhập
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const email = (document.getElementById("email") as HTMLInputElement).value;
//     const password = (document.getElementById("password") as HTMLInputElement)
//       .value;

//     try {
//       const res = await API_CUSTOMER.post("/login", {
//         email,
//         password,
//       });

//       const token = res.data.token;
//       localStorage.setItem("token", token);

//       // Nếu có giỏ hàng tạm thì đồng bộ
//       const savedCart = sessionStorage.getItem("pending_cart");
//       if (savedCart) {
//         try {
//           await API_CART.post(
//             "/cart/sync",
//             { cart: JSON.parse(savedCart) },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           sessionStorage.removeItem("pending_cart");
//         } catch (err) {
//           console.error("Đồng bộ giỏ hàng thất bại:", err);
//         }
//       }

//       await Swal.fire({
//         icon: "success",
//         title: "Đăng nhập thành công!",
//         text: `Chào mừng ${res.data.customer.fullName} quay lại BookStore`,
//         showConfirmButton: false,
//         timer: 1200,
//       });

//       window.location.href = redirectPath;
//     } catch (err: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Đăng nhập thất bại",
//         text: err.response?.data?.message || err.message,
//       });
//     }
//   };

//   // ✅ Hàm xử lý đăng nhập Google
//   const handleGoogleLogin = () => {
//     window.location.href = `${API_CUSTOMER.defaults.baseURL}/google?redirect=${redirectPath}`;
//   };

//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center min-h-screen bg-gray-50 p-4"
//       )}
//     >
//       <Card className="w-full max-w-md shadow-xl border border-gray-200">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold text-black-800">
//             Đăng nhập tài khoản
//           </CardTitle>
//           <CardDescription>
//             Nhập email và mật khẩu để truy cập SamShop
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleLogin}>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="vd: tenban@gmail.com"
//                   required
//                 />
//               </Field>

//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
//                   <a
//                     href="/forgot-password"
//                     className="ml-auto inline-block text-sm text-orange-600 underline-offset-4 hover:underline"
//                   >
//                     Quên mật khẩu?
//                   </a>
//                 </div>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   required
//                 />
//               </Field>

//               <Field>
//                 <Button
//                   type="submit"
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
//                 >
//                   Đăng nhập
//                 </Button>

//                 <Button
//                   variant="outline"
//                   type="button"
//                   onClick={handleGoogleLogin}
//                   className="w-full mt-2 flex items-center justify-center gap-2 border-gray-300"
//                 >
//                   <FcGoogle size={20} /> Đăng nhập với Google
//                 </Button>

//                 <FieldDescription className="text-center mt-4">
//                   Chưa có tài khoản?{" "}
//                   <a
//                     href="/register"
//                     className="underline text-orange-600 font-medium"
//                   >
//                     Đăng ký ngay
//                   </a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Swal from "sweetalert2";
import API_CUSTOMER from "~/api/Customer";
import API_CART from "~/api/Cart";
import { ArrowLeft, Leaf, Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [redirectPath, setRedirectPath] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setRedirectPath(params.get("redirect") || "/");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    try {
      const res = await API_CUSTOMER.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const savedCart = sessionStorage.getItem("pending_cart");
      if (savedCart) {
        try {
          await API_CART.post("/cart/sync", { cart: JSON.parse(savedCart) }, {
            headers: { Authorization: `Bearer ${res.data.token}` }
          });
          sessionStorage.removeItem("pending_cart");
        } catch (err) { console.error(err); }
      }

      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: `Chào mừng ${res.data.customer.fullName}!`,
        timer: 1500,
        showConfirmButton: false,
        background: "#ecfdf5",
        color: "#065f46",
      });

      setTimeout(() => window.location.href = redirectPath, 1000);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: err.response?.data?.message || "Email hoặc mật khẩu sai!",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_CUSTOMER.defaults.baseURL}/google?redirect=${redirectPath}`;
  };

  // 40 chiếc lá – dày đặc, rơi tự nhiên khắp màn hình
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

      {/* 40 LÁ RƠI DÀY ĐẶC, SIÊU TỰ NHIÊN */}
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
          <Leaf
            className="text-emerald-600/60 drop-shadow-md"
            style={{ width: leaf.size, height: leaf.size }}
          />
        </motion.div>
      ))}

      {/* Nút quay lại */}
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-emerald-800 hover:bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-md border border-emerald-200 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Trang chủ
      </Button>

      {/* CARD NHỎ GỌN, RỘNG HỢP LÝ, HẸP CHIỀU CAO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-emerald-200 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl mb-3">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">Đăng nhập</CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-7 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="h-11 mt-1 border-emerald-200 focus:border-emerald-500" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
                  <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required className="h-11 border-emerald-200 focus:border-emerald-500" />
              </div>

              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md">
                Đăng nhập ngay
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-emerald-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">Hoặc</span></div>
            </div>

            <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-11 flex items-center justify-center gap-3 border-2 hover:border-emerald-400 hover:bg-emerald-50/50">
              <Chrome className="w-5 h-5" />
              Google
            </Button>

            <p className="text-center text-xs text-gray-600 pt-2">
              Chưa có tài khoản? <Link to="/register" className="font-bold text-emerald-600 hover:underline">Đăng ký ngay</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
