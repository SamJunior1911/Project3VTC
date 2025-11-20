import axios from "axios";

const API_PRODUCT = axios.create({
  baseURL: "http://localhost:3001/api", // Product Service
  headers: {
    "Content-Type": "application/json",
  },
});

export default API_PRODUCT;
