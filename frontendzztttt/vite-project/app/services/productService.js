import { get } from "../utils/requestProduct.js";

export const getAssetsData= async (path) => {
  return await get(path);
};
