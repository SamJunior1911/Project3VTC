import React, { useState } from "react";
import axios from "axios";

export default function CouponPage() {
  const [code, setCode] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3005/api/coupons/validate",
        {
          code,
          total: Number(total),
        }
      );
      setResult(res.data);
    } catch (error: any) {
      setResult(error.response?.data || { message: "Lỗi không xác định" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg mt-10 p-5 border rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        🧾 Kiểm tra mã giảm giá
      </h2>

      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label className="block font-semibold">Mã Coupon:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Tổng đơn hàng (VNĐ):</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Đang kiểm tra..." : "Áp dụng mã"}
        </button>
      </form>

      {result && (
        <div className="mt-5 p-4 border rounded bg-gray-50">
          <h3 className="font-bold text-lg">Kết quả:</h3>
          <pre className="text-sm mt-2 bg-white p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.success && (
            <div className="mt-2 text-green-600 font-semibold">
              Giảm: {result.discount.toLocaleString()}đ
              <br />
              Tổng sau giảm: {result.total_after_discount.toLocaleString()}đ
            </div>
          )}
        </div>
      )}
    </div>
  );
}
