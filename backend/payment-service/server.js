// server.js
import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./src/routes/payment.route.js";
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
import { consumePaymentRequests } from "./src/consumers/paymentRequestConsumer.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const API_PATH = process.env.API_PATH;
app.use(
  cors({
    origin: "*", // hoặc ['http://localhost:3000'] để giới hạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use(API_PATH, paymentRoutes);

connectRabbitMQ().then(() => {
  consumePaymentRequests(); // Bắt đầu lắng nghe yêu cầu thanh toán
  app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
  });
});
