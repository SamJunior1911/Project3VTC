import axios from "axios";

const API_DOMAIN = "http://localhost:5100/";

const api = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

// interceptor thêm header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET
export const get = async (path) => (await api.get(path)).data;

// POST
export const post = async (path, options) =>
  (await api.post(path, options)).data;

// DELETE
export const del = async (path) => (await api.delete(path)).data;

// PATCH
export const patchFile = async (path, options) =>
  (await api.patch(path, options)).data;
