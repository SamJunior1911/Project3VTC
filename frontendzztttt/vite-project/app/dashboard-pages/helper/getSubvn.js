// utils/subvn.js (hoặc đặt trên đầu file AddressFormDialog.jsx)
import subVn from "sub-vn";

/* ----------------------- GET CODE ----------------------- */
export const getProvinceCode = (val) =>
  subVn.getProvinces().find((c) => c.code === val || c.name === val)?.code ||
  "";

export const getDistrictCode = (val) =>
  subVn.getDistricts().find((d) => d.code === val || d.name === val)?.code ||
  "";

export const getWardCode = (val) =>
  subVn.getWards().find((w) => w.code === val || w.name === val)?.code || "";

/* --------------------- GET NAME BY CODE ------------------ */
export const getProvinceName = (code) =>
  subVn.getProvinces().find((c) => c.code === code)?.name || "";

export const getDistrictName = (code) =>
  subVn.getDistricts().find((d) => d.code === code)?.name || "";

export const getWardName = (code) =>
  subVn.getWards().find((w) => w.code === code)?.name || "";

export const toNameAddress = (addr = {}) => ({
  city: getProvinceName(addr.city),
  district: getDistrictName(addr.district),
  ward: getWardName(addr.ward),
});

export const toCodeAddress = (addr = {}) => ({
  city: getProvinceCode(addr.city),
  district: getDistrictCode(addr.district),
  ward: getWardCode(addr.ward),
});
