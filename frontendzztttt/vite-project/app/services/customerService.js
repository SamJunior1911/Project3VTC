import { patch, get, post } from "@/utils/requestCustomer";
import { patchFile } from "@/utils/requestAvatar";

export const getCustomerData = async (path) => {
  return await get(path);
};

export const patchCustomerData = async (options) => {
  return await patch("api/customer/profile", options);
};

export const getOTPUpdateProfile = async (path) => {
  return await get(path);
};

export const patchAvatar = async (options) => {
  return await patchFile("/api/customer/avatar", options);
};

export const changePassword = async (options) => {
  return await patch("/api/customer/change-password", options);
};

export const changeProfileData = async (options) => {
  return await patch("/api/customer/profile", options);
};
export const postAddressData = async (options) => {
  return await post("/api/customer/create-address", options);
};

export const getAddressData = async (path) => {
  return await get(path);
};

export const patchAddressData = async (path, options) => {
  return await patch(path, options);
};

export const deleteAddress = async (path) => {
  return await del(path);
};
