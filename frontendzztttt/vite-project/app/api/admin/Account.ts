import axios from "axios";

// Tạo instance axios cho Admin
const API_ADMIN = axios.create({
  baseURL: "http://localhost:3009/api/admin",
  withCredentials: true, // nếu cần gửi cookie
});

// Thêm token vào header nếu có
API_ADMIN.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // có thể lưu token admin riêng
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_ADMIN;
