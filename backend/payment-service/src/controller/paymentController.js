import vnpayConfig from "../config/vnpay.config.js";
import * as paymentService from "../services/payment.service.js";
import {
  IpnFailChecksum,
  IpnOrderNotFound,
  IpnInvalidAmount,
  InpOrderAlreadyConfirmed,
  IpnUnknownError,
  IpnSuccess,
} from "vnpay";

import {
  createPaymentService,
  updatePaymentStatusService,
} from "../services/payment.service.js";
import { supabase } from "../config/supabase.js";
import { verifyMomoSignature } from "../utils/momo.utils.js";

export const createPaymentController = async (req, res) => {
  try {
    const { order_id, method, amount } = req.body;
    const result = await createPaymentService(order_id, method, amount);

    res.status(201).json({
      message: "Tạo thanh toán thành công",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const vnpayCallbackController = async (req, res) => {
  try {
    const verify = vnpayConfig.verifyIpnCall(req.query);
    if (!verify.isVerified) return res.json(IpnFailChecksum);

    if (!verify.isSuccess) return res.json(IpnUnknownError);

    const { dataGet, errorGet } = await supabase
      .from("payment")
      .select("*")
      .eq("order_id", Number(verify.vnp_TxnRef))
      .single();

    if (errorGet) return res.json(IpnOrderNotFound);

    if (verify.vnp_Amount !== dataGet.amount) return res.json(IpnInvalidAmount);

    if (dataGet.status === "completed")
      return res.json(InpOrderAlreadyConfirmed);

    const status = verify.vnp_TransactionStatus === "00" ? "success" : "failed";

    await updatePaymentStatusService(
      verify.vnp_TxnRef,
      status,
      verify.vnp_TransactionNo
    );

    return res.status(200).json({ message: IpnSuccess });
  } catch (error) {
    console.log(`verify error: ${error}`);
    return res.json(IpnUnknownError);
  }
};

export const momoCallbackController = async (req, res) => {
  const isIPN = req.headers["content-type"] === "application/json";
  const rawBody = req.body;
  const signature = req.headers["x-signature"];

  if (!signature || !verifyMomoSignature(rawBody, signature)) {
    console.error("MoMo: Invalid signature");
    return isIPN
      ? res.status(400).json({ resultCode: 1, message: "Invalid signature" })
      : res.status(400).send("Invalid signature");
  } else {
    console.log("xác thực thành công");
  }

  const { orderId, transId: transaction_id, resultCode } = req.body;

  let status;

  switch (resultCode) {
    case 0:
      status = "success";
      break;
    case 7002:
      status = "pending";
      break;
    default:
      status = "failed";
      break;
  }

  await updatePaymentStatusService(orderId, status, transaction_id);

  res.status(204).end();
};
export const getPaymentsByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    console.log("OrderId:", order_id);

    const payments = await paymentService.getAllPaymentsAdminService(order_id);
    console.log("PaymentData:", payments);

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có thanh toán cho đơn hàng này",
      });
    }

    return res.status(200).json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách thanh toán theo đơn hàng",
      error: error.message,
    });
  }
};
