import { supabase } from "../config/supabase.js";
import { createMomoPayment } from "../utils/momo.utils.js";
import createVnpayPayment from "../utils/vnpay.utils.js";

export const createPaymentService = async (order_id, method, amount) => {
  const { data: payment, error } = await supabase
    .from("payment")
    .insert([{ order_id, method, amount, status: "pending" }])
    .select()
    .single();

  if (error) throw new Error(`Lỗi khi tạo bản ghi: ${error.message}`);

  console.log(payment);
  let paymentUrl;

  switch (method) {
    case "vnpay":
      paymentUrl = createVnpayPayment(order_id, amount);
      if (!paymentUrl)
        throw new Error(
          "Tạo url thanh toán vnpay thất bại,vui lòng kiểm tra lại thông tin"
        );
      break;
    case "momo":
      if (amount < 1000) {
        throw new Error(
          "Số tiền thanh toán phải tối thiểu là 1000đ (quy định MoMo test)"
        );
      }
      const momoResponse = await createMomoPayment(
        order_id,
        amount,
        `Thanh toán đơn hàng #${order_id}`
      );
      paymentUrl = momoResponse.payUrl;
      if (!paymentUrl) throw new Error(momoResponse.message);
      break;
    case "cod":
      paymentUrl = null;
      break;
    default:
      throw new Error("Phương thức thanh toán không hỗ trợ");
  }

  return {
    payment: payment.id,
    redirect_url: paymentUrl,
  };
};

export const updatePaymentStatusService = async (
  order_id,
  status,
  transaction_id = null
) => {
  const updates = { status, paid_at: new Date() };

  if (transaction_id) updates.transaction_id = transaction_id;

  const { error } = await supabase
    .from("payment")
    .update(updates)
    .eq("order_id", order_id);

  if (error) throw new Error(error.message);
};
export const getAllPaymentsAdminService = async (order_id = null) => {
  let query = supabase
    .from("payment")
    .select("*")
    .order("created_at", { ascending: false });

  if (order_id) {
    query = query.eq("order_id", order_id);
  }

  const { data: payments, error } = await query;
  console.log("Supabase query result:", payments);
  console.log("Supabase query error:", error);

  if (error) throw new Error(error.message);
  return payments;
};
