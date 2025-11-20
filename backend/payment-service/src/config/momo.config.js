import dotenv from "dotenv";

dotenv.config();

const config = {
  accessKey: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
  secretKey: process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMO",
  redirectUrl:
    process.env.MOMO_RETURN_URL || "https://localhost:5173/order-summary",
  ipnUrl:
    process.env.MOMO_IPN_URL ||
    "https://reva-subfastigiate-aside.ngrok-free.dev/api/v1/payment/momo/callback",
  requestType: "payWithMethod",
  lang: "vi",
};

export default config;
