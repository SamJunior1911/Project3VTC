import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // bắt buộc vì Upstash dùng rediss:// (SSL)
    rejectUnauthorized: false, // tránh lỗi chứng chỉ tự ký
  },
});

client.on("connect", () => console.log("✅ Redis connected"));
client.on("error", (err) => console.error("❌ Redis Client Error:", err));

await client.connect();

export default client;
