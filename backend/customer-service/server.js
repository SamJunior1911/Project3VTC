import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { dbConnect } from "./config/db.js";
import customerRouter from "./routes/customer.routes.js";
import cors from "cors";
// import redisClient from "./config/redis.js";
import passport from "./config/passport.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5100;

dbConnect();

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// try {
//   console.log("Đang kết nối đến Redis...");
//   await redisClient.ping();
//   console.log("Kết nối Redis thành công!");
// } catch (err) {
//   console.error("Lỗi kết nối Redis:", err);
// }

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3009",
    "http://localhost:5003",
    "http://localhost:3000",
  ],
  method: ["GET", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/customer", customerRouter);

app.get("/", (req, res) => {
  res.send("Customer Service is running");
});

app.listen(PORT, () => {
  console.log(`Customer Service is running on port ${PORT}`);
});
