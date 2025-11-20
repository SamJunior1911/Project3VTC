"use client";

import "../globals.css";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/dashboard/ui/sidebar";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { toast } from "sonner";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  type Coupon,
  type CouponFormData,
} from "@/lib/dashboard/coupon";
import { CouponDialog } from "@/components/dashboard/coupon-dialog";
import { ValidateCouponDialog } from "@/components/dashboard/validate-coupon-dialog";

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
      setFilteredCoupons(data);
    } catch (error) {
      toast.error("Không thể tải danh sách mã giảm giá");
      console.error("[v0] Error loading coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    let filtered = coupons;

    if (searchTerm) {
      filtered = filtered.filter((coupon) =>
        coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (coupon) => coupon.coupon_status === statusFilter
      );
    }

    setFilteredCoupons(filtered);
  }, [searchTerm, statusFilter, coupons]);

  const handleCreate = async (data: CouponFormData) => {
    try {
      await createCoupon(data);
      toast.success("Tạo mã giảm giá thành công!");
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || "Không thể tạo mã giảm giá");
      throw error;
    }
  };

  const handleUpdate = async (data: CouponFormData) => {
    if (!selectedCoupon) return;
    try {
      await updateCoupon(selectedCoupon._id, data);
      toast.success("Cập nhật mã giảm giá thành công!");
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật mã giảm giá");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Xóa mã giảm giá thành công!");
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa mã giảm giá");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isExpired = (coupon: Coupon) => {
    return new Date(coupon.coupon_end) < new Date();
  };

  const getStatusBadge = (coupon: Coupon) => {
    if (coupon.coupon_status === "disabled") {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Vô hiệu hóa
        </Badge>
      );
    }
    if (isExpired(coupon)) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    }
    if (coupon.coupon_used_count >= coupon.coupon_uses_per_coupon) {
      return <Badge variant="outline">Hết lượt</Badge>;
    }
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        Hoạt động
      </Badge>
    );
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý mã giảm giá cho cửa hàng của bạn
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Danh sách mã giảm giá</CardTitle>
                      <CardDescription>
                        Tổng cộng {coupons.length} mã giảm giá
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setValidateDialogOpen(true)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Kiểm tra mã
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedCoupon(null);
                          setDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo mã mới
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo mã..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Lọc trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="disabled">Vô hiệu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="text-muted-foreground">Đang tải...</div>
                    </div>
                  ) : filteredCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-muted-foreground mb-4">
                        Không tìm thấy mã giảm giá nào
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedCoupon(null);
                          setDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo mã đầu tiên
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Giá trị</TableHead>
                            <TableHead>Sử dụng</TableHead>
                            <TableHead>Thời hạn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCoupons.map((coupon) => (
                            <TableRow key={coupon._id}>
                              <TableCell className="font-mono font-semibold">
                                {coupon.coupon_code}
                              </TableCell>
                              <TableCell>
                                {coupon.coupon_type === "percent"
                                  ? "Phần trăm"
                                  : "Cố định"}
                              </TableCell>
                              <TableCell>
                                {coupon.coupon_type === "percent"
                                  ? `${coupon.coupon_value}%`
                                  : `${coupon.coupon_value.toLocaleString(
                                      "vi-VN"
                                    )}đ`}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {coupon.coupon_used_count}/
                                  {coupon.coupon_uses_per_coupon}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div>{formatDate(coupon.coupon_start)}</div>
                                <div className="text-muted-foreground">
                                  {formatDate(coupon.coupon_end)}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(coupon)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedCoupon(coupon);
                                      setDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(coupon._id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>

      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={selectedCoupon}
        onSubmit={selectedCoupon ? handleUpdate : handleCreate}
      />

      <ValidateCouponDialog
        open={validateDialogOpen}
        onOpenChange={setValidateDialogOpen}
      />
    </SidebarProvider>
  );
}
