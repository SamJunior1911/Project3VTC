import crypto from "crypto";

export const randomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
