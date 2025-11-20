import axios from "axios";

const API_BASE_URL = "http://localhost:3001/";

export const getAssetsData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu assets:", error);
    return [];
  }
};
