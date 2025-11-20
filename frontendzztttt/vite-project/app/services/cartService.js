import { get } from "../utils/requestCart.js";

export const getCartData = async (path) => {
  return await get(path);
};
