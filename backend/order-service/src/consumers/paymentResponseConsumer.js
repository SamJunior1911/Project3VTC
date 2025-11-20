import { channel } from "../config/rabbitmq.js";
import { updateOrderStatusService } from "../services/order.service.js";
import axios from "axios";

export const consumePaymentResponses = async () => {
  channel.consume(process.env.PAYMENT_RESPONSE_QUEUE, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      const { order_id, status, redirect_url, method, payment_id, error } =
        content;
      try {
        if (status === "failed") {
          await updateOrderStatusService(order_id, "canceled");
          await axios.post(process.env.FRONTEND_WEBHOOK_URL, {
            order_id,
            status: "failed",
            error,
          });
        } else if (status === "pending") {
          await updateOrderStatusService(order_id, "pending", payment_id);
          await axios.post(process.env.FRONTEND_WEBHOOK_URL, {
            order_id,
            status: "pending",
            redirect_url,
            method: method,
          });
        }
      } catch (err) {
        console.error(`Error updating order ${order_id}:`, err);
      }

      channel.ack(msg);
    }
  });
};
