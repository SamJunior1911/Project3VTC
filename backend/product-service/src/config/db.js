import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔑 DB URI:", process.env.MONGODB_CONNECTIONSTRING); // debug
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Lỗi khi liên kết MongoDB:", error.message);
    process.exit(1);
  }
};
