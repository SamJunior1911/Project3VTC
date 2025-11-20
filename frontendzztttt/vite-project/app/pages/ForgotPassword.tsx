// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import Swal from "sweetalert2";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import { Label } from "~/components/ui/label";
// import { Input } from "~/components/ui/input";
// import { Button } from "~/components/ui/button";
// import axios from "axios";
// import API_CUSTOMER from "~/api/Customer";
// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [step, setStep] = useState<"email" | "reset">("email"); // bước hiện tại

//   const handleSendOTP = async () => {
//     if (!email) return Swal.fire("Lỗi", "Vui lòng nhập email", "error");
//     try {
//       await API_CUSTOMER.post("/send-otp-reset", {
//         email,
//       });
//       Swal.fire("Thành công", "OTP đã được gửi đến email của bạn", "success");
//       setStep("reset");
//     } catch (err: any) {
//       Swal.fire("Lỗi", err.response?.data?.message || err.message, "error");
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!otp || !newPassword)
//       return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
//     try {
//       await API_CUSTOMER.post("/reset-password", {
//         email,
//         otp,
//         newPassword,
//       });
//       Swal.fire(
//         "Thành công",
//         "Mật khẩu đã được thay đổi, bạn có thể đăng nhập lại",
//         "success"
//       ).then(() => {
//         window.location.href = "/login";
//       });
//     } catch (err: any) {
//       Swal.fire("Lỗi", err.response?.data?.message || err.message, "error");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen ">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Card className="w-[380px] p-6 shadow-2xl border border-orange-200 bg-white/90 backdrop-blur-md rounded-2xl">
//           <CardHeader>
//             <CardTitle className="text-center text-3xl font-bold text-gray-800">
//               Quên mật khẩu
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-5">
//             {step === "email" && (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Nhập email của bạn</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <Button
//                   onClick={handleSendOTP}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
//                 >
//                   Gửi OTP
//                 </Button>
//               </>
//             )}

//             {step === "reset" && (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="otp">Nhập mã OTP</Label>
//                   <Input
//                     id="otp"
//                     type="text"
//                     placeholder="123456"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="newPassword">Mật khẩu mới</Label>
//                   <Input
//                     id="newPassword"
//                     type="password"
//                     placeholder="••••••••"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <Button
//                   onClick={handleResetPassword}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
//                 >
//                   Đặt lại mật khẩu
//                 </Button>
//               </>
//             )}
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
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import API_CUSTOMER from "~/api/Customer";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) return Swal.fire("Lỗi", "Vui lòng nhập email", "error");
    try {
      await API_CUSTOMER.post("/send-otp-reset", { email });
      Swal.fire({
        icon: "success",
        title: "Đã gửi OTP!",
        text: "Mã xác nhận đã được gửi đến email của bạn",
        timer: 2000,
        showConfirmButton: false,
        background: "#ecfdf5",
        color: "#065f46",
      });
      setStep("reset");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gửi thất bại",
        text: err.response?.data?.message || "Email không tồn tại!",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword)
      return Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");

    try {
      await API_CUSTOMER.post("/reset-password", { email, otp, newPassword });
      Swal.fire({
        icon: "success",
        title: "Đặt lại thành công!",
        text: "Mật khẩu đã được thay đổi. Đang chuyển về trang đăng nhập...",
        timer: 2000,
        showConfirmButton: false,
        background: "#ecfdf5",
        color: "#065f46",
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.response?.data?.message || "Mã OTP không đúng!",
        confirmButtonColor: "#f97316",
      });
    }
  };

  // 40 lá rơi giống hệt Login/Register
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

      {/* 40 LÁ RƠI ĐẸP LUNG LINH */}
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

      {/* Nút quay lại trang chủ */}
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-emerald-800 hover:bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-md border border-emerald-200 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Trang chủ
      </Button>

      {/* CARD NHỎ GỌN, ĐẸP NHƯ LOGIN/REGISTER */}
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
              Quên mật khẩu
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6 space-y-4">
            {step === "email" && (
              <>
                <div>
                  <Label htmlFor="email" className="text-sm">Email của bạn</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 mt-1 border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <Button
                  onClick={handleSendOTP}
                  className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl"
                >
                  Gửi mã OTP
                </Button>
              </>
            )}

            {step === "reset" && (
              <>
                <div>
                  <Label htmlFor="otp" className="text-sm">Mã OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-10 mt-1 border-emerald-200 focus:border-emerald-500 text-center text-lg tracking-widest"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-sm">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 mt-1 border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <Button
                  onClick={handleResetPassword}
                  className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl"
                >
                  Đặt lại mật khẩu
                </Button>
              </>
            )}

            <p className="text-center text-xs text-gray-600 pt-2">
              Nhớ mật khẩu rồi?{" "}
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