"use client";

import { useState } from "react";
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
import { validateCoupon } from "@/lib/dashboard/coupon";
import { toast } from "sonner";

interface ValidateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ValidateCouponDialog({
  open,
  onOpenChange,
}: ValidateCouponDialogProps) {
  const [code, setCode] = useState("");
  const [total, setTotal] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<{
    discount: number;
    total_after_discount: number;
  } | null>(null);

  const handleValidate = async () => {
    if (!code || total <= 0) {
      toast.error("Vui lòng nhập mã và tổng tiền hợp lệ");
      return;
    }

    setIsValidating(true);
    try {
      const validationResult = await validateCoupon(code, total);
      setResult(validationResult);
      toast.success("Mã giảm giá hợp lệ!");
    } catch (error: any) {
      toast.error(error.message || "Không thể xác thực mã");
      setResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setTotal(0);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kiểm tra mã giảm giá</DialogTitle>
          <DialogDescription>
            Nhập mã và tổng tiền đơn hàng để kiểm tra
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="validate_code">Mã giảm giá</Label>
            <Input
              id="validate_code"
              placeholder="VD: SALE2024"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="validate_total">Tổng tiền đơn hàng (đ)</Label>
            <Input
              id="validate_total"
              type="number"
              min="0"
              placeholder="0"
              value={total || ""}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
          </div>

          {result && (
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-medium">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá:</span>
                <span className="font-medium text-destructive">
                  -{result.discount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span>Tổng sau giảm:</span>
                <span className="text-primary">
                  {result.total_after_discount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isValidating}
          >
            Đóng
          </Button>
          <Button onClick={handleValidate} disabled={isValidating}>
            {isValidating ? "Đang kiểm tra..." : "Kiểm tra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
