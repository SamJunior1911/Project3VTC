import crypto from "crypto";
import config from "../config/momo.config.js";
import axios from "axios";

export const createMomoPayment = async (orderId, amount, description) => {
  const requestId = `${config.partnerCode}-${Date.now()}`;
  const orderIdStr = orderId.toString();

  const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=&ipnUrl=${config.ipnUrl}&orderId=${orderIdStr}&orderInfo=${description}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${config.requestType}`;

  const signature = crypto
    .createHmac("sha256", config.secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: config.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount,
    orderId: orderIdStr,
    orderInfo: description,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: config.lang,
    requestType: config.requestType,
    signature: signature,
    extraData: "",
  });

  console.log(requestBody);
  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const verifyMomoSignature = (body, signature) => {
  const { partnerCode, orderId, requestId } = body;

  const rawSignature = `accessKey=accessKey=${config.accessKey}&orderId=${orderId}&partnerCode=${partnerCode}
&requestId=${requestId}`;

  const computedSignature = crypto
    .createHmac("sha256", config.secretKey)
    .update(rawSignature)
    .digest("hex");

  return computedSignature === signature;
};
