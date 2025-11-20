const API_BASE_URL = "http://localhost:3005/api";

export interface Coupon {
  _id: string;
  coupon_code: string;
  coupon_type: "percent" | "fixed";
  coupon_value: number;
  coupon_min_spend: number;
  coupon_max_spend?: number;
  coupon_uses_per_coupon: number;
  coupon_used_count: number;
  coupon_status: "active" | "disabled";
  coupon_start: string;
  coupon_end: string;
  create_at?: string;
  deleted_at?: string | null;
}

export interface CouponFormData {
  coupon_code: string;
  coupon_type: "percent" | "fixed";
  coupon_value: number;
  coupon_min_spend: number;
  coupon_max_spend?: number;
  coupon_uses_per_coupon: number;
  coupon_status: "active" | "disabled";
  coupon_start: string;
  coupon_end: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const response = await fetch(`${API_BASE_URL}/coupons`);
  const result: ApiResponse<Coupon[]> = await response.json();
  return result.data || [];
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const response = await fetch(`${API_BASE_URL}/coupons/${id}`);
  const result: ApiResponse<Coupon> = await response.json();
  return result.data || null;
}

export async function createCoupon(data: CouponFormData): Promise<Coupon> {
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<Coupon> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data!;
}

export async function updateCoupon(
  id: string,
  data: Partial<CouponFormData>
): Promise<Coupon> {
  const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<Coupon> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data!;
}

export async function deleteCoupon(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
    method: "DELETE",
  });
  const result: ApiResponse<void> = await response.json();
  if (!result.success) throw new Error(result.message);
}

export async function validateCoupon(
  code: string,
  total: number
): Promise<{
  discount: number;
  total_after_discount: number;
}> {
  const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, total }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return {
    discount: result.discount,
    total_after_discount: result.total_after_discount,
  };
}
