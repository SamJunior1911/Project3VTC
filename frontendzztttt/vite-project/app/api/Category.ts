import axios from "axios";

const API_CATEGORY = axios.create({
  baseURL: "http://localhost:3001/categories",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API_CATEGORY;
