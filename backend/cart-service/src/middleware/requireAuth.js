import jwt from "jsonwebtoken";

// Middleware xác thực JWT nhưng không bắt buộc
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(" decoded:", decoded);
      req.customer_id = decoded.id; // Lưu customer_id vào request
    } catch (error) {
      console.warn("⚠️ Token không hợp lệ, sẽ xử lý như chưa login");
      req.customer_id = null;
    }
  } else {
    // Không có token  coi như chưa login
    req.customer_id = null;
  }

  next(); // Cho phép route tiếp theo chạy
};
