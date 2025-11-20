import jwt from "jsonwebtoken";
import { Customer } from "../models/Customer.js";

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({
      code: 401,
      message: "Không có token,không thể xác thực",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id);
    if (!customer) {  
      return res.json({
        code: 401,
        message: "Token không hợp lệ",
      });
    }
    req.customer = customer;
    next();
  } catch (error) {
    return res.json({
      code: 401,
      message: "Token không hợp lệ",
    });
  }
};
