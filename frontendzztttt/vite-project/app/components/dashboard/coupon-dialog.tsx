"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import { Label } from "@/components/dashboard/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import type { Coupon, CouponFormData } from "@/lib/dashboard/coupon";

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  onSubmit: (data: CouponFormData) => Promise<void>;
}

export function CouponDialog({
  open,
  onOpenChange,
  coupon,
  onSubmit,
}: CouponDialogProps) {
  const [formData, setFormData] = useState<CouponFormData>({
    coupon_code: "",
    coupon_type: "percent",
    coupon_value: 0,
    coupon_min_spend: 0,
    coupon_max_spend: undefined,
    coupon_uses_per_coupon: 1,
    coupon_status: "active",
    coupon_start: "",
    coupon_end: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        coupon_code: coupon.coupon_code,
        coupon_type: coupon.coupon_type,
        coupon_value: coupon.coupon_value,
        coupon_min_spend: coupon.coupon_min_spend,
        coupon_max_spend: coupon.coupon_max_spend,
        coupon_uses_per_coupon: coupon.coupon_uses_per_coupon,
        coupon_status: coupon.coupon_status,
        coupon_start: coupon.coupon_start.split("T")[0],
        coupon_end: coupon.coupon_end.split("T")[0],
      });
    } else {
      setFormData({
        coupon_code: "",
        coupon_type: "percent",
        coupon_value: 0,
        coupon_min_spend: 0,
        coupon_max_spend: undefined,
        coupon_uses_per_coupon: 1,
        coupon_status: "active",
        coupon_start: "",
        coupon_end: "",
      });
    }
  }, [coupon, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("[v0] Error submitting coupon:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {coupon ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
          </DialogTitle>
          <DialogDescription>
            {coupon
              ? "Cập nhật thông tin mã giảm giá"
              : "Điền thông tin để tạo mã giảm giá mới"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="coupon_code">Mã giảm giá *</Label>
              <Input
                id="coupon_code"
                placeholder="VD: SALE2024"
                value={formData.coupon_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coupon_code: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coupon_type">Loại giảm giá *</Label>
                <Select
                  value={formData.coupon_type}
                  onValueChange={(value: "percent" | "fixed") =>
                    setFormData({ ...formData, coupon_type: value })
                  }
                >
                  <SelectTrigger id="coupon_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coupon_value">
                  Giá trị {formData.coupon_type === "percent" ? "(%)" : "(đ)"} *
                </Label>
                <Input
                  id="coupon_value"
                  type="number"
                  min="0"
                  max={formData.coupon_type === "percent" ? "100" : undefined}
                  value={formData.coupon_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coupon_value: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coupon_min_spend">
                  Giá trị đơn tối thiểu (đ) *
                </Label>
                <Input
                  id="coupon_min_spend"
                  type="number"
                  min="0"
                  value={formData.coupon_min_spend}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coupon_min_spend: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coupon_max_spend">Giá trị đơn tối đa (đ)</Label>
                <Input
                  id="coupon_max_spend"
                  type="number"
                  min="0"
                  placeholder="Không giới hạn"
                  value={formData.coupon_max_spend || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coupon_max_spend: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coupon_uses_per_coupon">
                Số lượt sử dụng tối đa *
              </Label>
              <Input
                id="coupon_uses_per_coupon"
                type="number"
                min="1"
                value={formData.coupon_uses_per_coupon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coupon_uses_per_coupon: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coupon_start">Ngày bắt đầu *</Label>
                <Input
                  id="coupon_start"
                  type="date"
                  value={formData.coupon_start}
                  onChange={(e) =>
                    setFormData({ ...formData, coupon_start: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coupon_end">Ngày kết thúc *</Label>
                <Input
                  id="coupon_end"
                  type="date"
                  value={formData.coupon_end}
                  onChange={(e) =>
                    setFormData({ ...formData, coupon_end: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coupon_status">Trạng thái *</Label>
              <Select
                value={formData.coupon_status}
                onValueChange={(value: "active" | "disabled") =>
                  setFormData({ ...formData, coupon_status: value })
                }
              >
                <SelectTrigger id="coupon_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="disabled">Vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : coupon ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
