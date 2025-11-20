import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thiếu token" });

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Kiểm tra role nếu có trong token, nếu không có thì cho phép (vì có thể token cũ không có role)
    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Set cả req.admin và req.user để tương thích
    req.admin = decoded;
    req.user = decoded; // Thêm dòng này để tương thích với code cũ
    next();
  } catch (error) {
    console.error("Error verifying admin token:", error);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
