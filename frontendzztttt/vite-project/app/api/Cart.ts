import axios from "axios";

const API_CART = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: true,
});

API_CART.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_CART;
