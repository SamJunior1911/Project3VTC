import { ProductCode, VnpLocale, dateFormat } from "vnpay";
import vnpayConfig from "../config/vnpay.config.js";

const createVnpayPayment = (orderId, amount) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const paymentUrl = vnpayConfig.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: "13.160.92.202",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
  });

  return paymentUrl;
};

export default createVnpayPayment;
