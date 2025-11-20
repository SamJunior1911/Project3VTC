import axios from "axios";

const API_CUSTOMER = axios.create({
  baseURL: "http://localhost:5100/api/customer",
  withCredentials: true,
});

API_CUSTOMER.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API_CUSTOMER;
