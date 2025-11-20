import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./src/routes/order.route.js";
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import { consumePaymentResponses } from "./src/consumers/paymentResponseConsumer.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/order", orderRoutes);

const PORT = process.env.PORT;

connectRabbitMQ().then(() => {
  consumePaymentResponses(); // Bắt đầu lắng nghe phản hồi từ Payment Service
  app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
  });
});
