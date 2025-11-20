import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for admin-service"))
  .catch((err) => console.error(err));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5100",
      "http://localhost:3000",
    ], // 👈 frontend domain
    credentials: true, // 👈 cho phép gửi cookie/session
  })
);
app.use("/api/admin", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(` Admin Service running on port ${process.env.PORT}`);
});
