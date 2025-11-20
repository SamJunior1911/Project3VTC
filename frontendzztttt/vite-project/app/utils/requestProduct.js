import axios from "axios";

const API_DOMAIN = "http://localhost:3001/";

const api = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// interceptor thêm header
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmUwMmQxYjRkMWZjZmE1ODI3ZGUzMyIsImlhdCI6MTc2MTQ3NzQzMCwiZXhwIjoxNzYyMDgyMjMwfQ.WBbB54w57XWZ1I75tceih_hkJ8dqoGGl37LodrT0wmY";
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
export const patch = async (path, options) =>
  (await api.patch(path, options)).data;
