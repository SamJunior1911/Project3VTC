import redis from "../config/redis.js";

const OTP_COOLDOWN_TIME = 60; // 60 giây

export async function checkOtpRateLimit(identifier) {
  const key = `otp:cooldown:${identifier}`;
  const exists = await redis.exists(key);

  if (exists) {
    const remainingTime = await redis.ttl(key);
    return { allowed: false, remainingTime };
  }

  // ✅ Redis v4+ syntax
  await redis.set(key, "1", { EX: OTP_COOLDOWN_TIME });

  return { allowed: true, remainingTime: 0 };
}

// Xóa thủ công cooldown nếu cần
export async function resetOtpRateLimit(identifier) {
  const key = `otp:cooldown:${identifier}`;
  await redis.del(key);
}
