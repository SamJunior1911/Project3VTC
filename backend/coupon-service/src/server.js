import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/index.js";
import { connectDB } from "./config/db.js";

import cors from "cors";

dotenv.config({ path: "./src/.env" });

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // 👈 frontend domain
    credentials: true, // 👈 cho phép gửi cookie/session
  })
);
router(app);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
