import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/index.js";
import { connectDB } from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

dotenv.config({ path: "./src/.env" });

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5100",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 2️⃣ Sau đó mới khai báo session
app.use(
  session({
    secret: "samshop_secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTIONSTRING,
    }),
    cookie: {
      secure: false, // ⚠️ false khi test localhost
      httpOnly: true,
      sameSite: "lax", // 👉 Nếu vẫn không lưu thì thử đổi "none"
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

router(app);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
