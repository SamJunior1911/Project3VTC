import { channel, sendToQueue } from "../config/rabbitmq.js";
import { createPaymentService } from "../services/payment.service.js";

export const consumePaymentRequests = async () => {
  channel.consume(process.env.PAYMENT_REQUEST_QUEUE, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      console.log(content)
      const { order_id, method, amount } = content;
      try {
        const result = await createPaymentService(order_id, method, amount);

        await sendToQueue(process.env.PAYMENT_RESPONSE_QUEUE, {
          order_id,
          payment_id: result.payment,
          status: "pending",
          redirect_url: result.redirect_url,
          method: method,
        });
      } catch (err) {
        await sendToQueue(process.env.PAYMENT_RESPONSE_QUEUE, {
          order_id,
          status: "failed",
          error: err.message,
        });
      }

      channel.ack(msg);
    }
  });
};
