"use client";

import { useState } from "react";
import { Button } from "@/components/dashboard/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { Label } from "@/components/dashboard/ui/label";
import { toast } from "sonner";
import { updateOrderStatus, type Order } from "@/lib/dashboard/apiorder";

interface UpdateOrderStatusDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ORDER_STATUSES = [
  { value: "pending", label: "Đang xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "canceled", label: "Đã hủy" },
];

export function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: UpdateOrderStatusDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!order || !status) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }

    setIsLoading(true);
    try {
      await updateOrderStatus(order.id, status);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      onOpenChange(false);
      onSuccess();
      setStatus("");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái đơn hàng");
      console.error("Error updating order status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái cho đơn hàng #{order?.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái mới</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm text-muted-foreground">
              Trạng thái hiện tại
            </Label>
            <p className="text-sm font-medium">{order?.status}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setStatus("");
            }}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
