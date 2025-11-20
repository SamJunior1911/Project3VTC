import { get } from "../utils/requestCoupon.js";

export const getCouponData = async (path) => {
  return await get(path);
};
