// // src/config/rabbitmqConsumer.js
// import { receiveFromQueue } from "./rabbitmq.js";
// import axios from "axios";
// import { supabase } from "./supabase.js";

// export const startPaymentConsumer = async () => {
//   await receiveFromQueue(process.env.ORDER_UPDATE_QUEUE, async (msg) => {
//     const { order_id, status } = msg;

//     if (status === "paid") {
//       console.log(`💰 Đơn hàng ${order_id} đã thanh toán thành công`);

//       // 🔹 Lấy danh sách sản phẩm trong đơn hàng
//       const { data: details, error } = await supabase
//         .from("order_detail")
//         .select("product_id, quantity")
//         .eq("order_id", order_id);

//       if (error) {
//         console.error("❌ Lỗi lấy order_detail:", error.message);
//         return;
//       }

//       // 🔹 Trừ từng sản phẩm trong Product Service
//       for (const item of details) {
//         try {
//           const res = await axios.post(
//             `${process.env.PRODUCT_SERVICE_URL}/decrease-stock`,
//             {
//               product_id: item.product_id,
//               quantity: item.quantity,
//             }
//           );

//           console.log(
//             `✅ Đã trừ ${item.quantity} sản phẩm ID: ${item.product_id}`
//           );
//         } catch (err) {
//           console.error(`❌ Lỗi trừ sản phẩm ${item.product_id}:`, err.message);
//         }
//       }

//       console.log("🎉 Đã xử lý xong cập nhật tồn kho sau thanh toán!");
//     }
//   });
// };
