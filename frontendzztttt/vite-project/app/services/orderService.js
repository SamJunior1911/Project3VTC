import { get, post } from "../utils/requestOrder.js";

export const postOrderData = async (options) => {
  return await post("api/order/create", options);
};

export const getOrderData = async (path) => {
  return await get(path);
};

export const getAllOrderData = async (path) => {
  return await get(path);
};
