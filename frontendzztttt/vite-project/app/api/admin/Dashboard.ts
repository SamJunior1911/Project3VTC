import axios from "axios";

const DASHBOARD_URL = axios.create({
  baseURL: "http://localhost:3000", // Dashboard Service
  headers: {
    "Content-Type": "application/json",
  },
});

export default DASHBOARD_URL;
