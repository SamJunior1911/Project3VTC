import { VNPay, ignoreLogger } from "vnpay";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
     path: path.resolve(__dirname, '../../src/.env') 
});

const vnpayConfig = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || 'R8H5UOX3',
  secureSecret: process.env.HASH_SECRET || "TBLHLSP0C4Y6893CFJUC0Z47KVQFCJ0I",
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  queryDrAndRefundHost: "https://sandbox.vnpayment.vn", // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)

  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
  hashAlgorithm: "SHA512", // tùy chọn
});

export default vnpayConfig;
