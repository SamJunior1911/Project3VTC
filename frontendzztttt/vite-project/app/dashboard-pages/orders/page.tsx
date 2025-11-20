"use client";

import "../globals.css";
import type React from "react";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/dashboard/ui/sidebar";
import { Button } from "@/components/dashboard/ui/button";
import { IconEye, IconCheck, IconX } from "@tabler/icons-react";
import {
  getProvinceName,
  getDistrictName,
  getWardName,
} from "../helper/getSubvn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { toast } from "sonner";
import { Label } from "@/components/dashboard/ui/label";
import { orderApi, type Order } from "@/lib/dashboard/apiorder";

export default function OrdersPage() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAllOrdersAdmin();
      console.log("[v0] Orders data:", data);
      setOrders(data);
    } catch (error) {
      console.error("[v0] Error:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    revenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, endIndex);
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) {
      toast.error("Vui lòng chọn trạng thái mới");
      return;
    }

    try {
      await orderApi.updateOrderStatus(selectedOrder.id, newStatus);
      toast.success("Đã cập nhật trạng thái đơn hàng thành công!");
      setIsUpdateStatusOpen(false);
      fetchOrders(); // Refresh danh sách
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;

    try {
      await orderApi.updateOrderStatus(selectedOrder.id, "canceled");
      toast.success("Đã hủy đơn hàng thành công!");
      setIsCancelOpen(false);
      fetchOrders(); // Refresh danh sách
    } catch (error: any) {
      toast.error(error.message || "Không thể hủy đơn hàng");
    }
  };

  const openView = async (order: Order) => {
    try {
      console.log("[v0] Fetching order details for:", order.id);

      const orderItems = await orderApi.getOrderDetail(order.id);
      console.log("[v0] Order items received:", orderItems);

      let couponInfo = null;
      if (order.coupon_id) {
        couponInfo = await orderApi.getCouponById(order.coupon_id);
        console.log("[v0] Coupon info:", couponInfo);
      }

      const enrichedOrder = {
        ...order,
        coupon_code: couponInfo?.coupon_code || order.coupon_code,
        coupon_type: couponInfo?.coupon_type || order.coupon_type,
        coupon_value: couponInfo?.coupon_value || order.coupon_value || 0,
        items: orderItems.map((item: any) => {
          console.log("[v0] Processing item:", item);

          const productName =
            item.product_name || item.name || "Sản phẩm không xác định";
          const originalPrice = item.original_price || item.price;
          const discount = item.discount || 0;
          const discountedPrice = item.discounted_price || originalPrice;

          return {
            product_id: item.product_id,
            product_name: productName,
            quantity: item.quantity,
            price: discountedPrice,
            total: item.quantity * discountedPrice,
            discount: discount,
            original_price: originalPrice,
          };
        }),
      };

      console.log("[v0] Enriched order with products:", enrichedOrder);
      setSelectedOrder(enrichedOrder);
      setIsViewOpen(true);
    } catch (error: any) {
      console.error("[v0] Error in openView:", error);
      toast.error(error.message || "Không thể lấy chi tiết đơn hàng");
      setSelectedOrder(order);
      setIsViewOpen(true);
    }
  };

  const openUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateStatusOpen(true);
  };

  const openCancel = (order: Order) => {
    setSelectedOrder(order);
    setIsCancelOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      completed: "Hoàn thành",
      canceled: "Đã hủy",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending:
        "bg-amber-400 text-white dark:bg-amber-800/50 dark:text-amber-500",
      confirmed:
        "bg-blue-500 text-white dark:bg-blue-800/50 dark:text-blue-500",
      completed:
        "bg-emerald-500 text-white dark:bg-emerald-800/50 dark:text-emerald-500",
      canceled: "bg-red-500 text-white dark:bg-red-800/50 dark:text-red-500",
    };
    return (
      colorMap[status.toLowerCase()] ||
      "bg-gray-200 text-gray-900 dark:bg-gray-800/50 dark:text-gray-200"
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
                  <p className="text-muted-foreground">
                    Theo dõi và xử lý tất cả đơn hàng
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tổng đơn hàng</CardDescription>
                    <CardTitle className="text-2xl">{stats.total}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Đang xử lý</CardDescription>
                    <CardTitle className="text-2xl">{stats.pending}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Hoàn thành</CardDescription>
                    <CardTitle className="text-2xl">
                      {stats.completed}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Doanh thu (Hoàn thành)</CardDescription>
                    <CardTitle className="text-2xl text-red-600">
                      {stats.revenue.toLocaleString()} VND
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách đơn hàng</CardTitle>
                  <CardDescription>
                    Xem và quản lý tất cả đơn hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Đang tải...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có đơn hàng nào
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã đơn</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>Ngày đặt</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                #{order.id}
                              </TableCell>
                              <TableCell className="font-medium">
                                {order.customer_name || "Khách vãng lai"}
                              </TableCell>
                              <TableCell className="font-semibold text-red-500">
                                {order.total.toLocaleString()} VND
                              </TableCell>
                              <TableCell>
                                {formatDate(order.created_at)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                              </TableCell>

                              <TableCell className="text-right">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openView(order)}
                                  >
                                    <IconEye className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openUpdateStatus(order)}
                                  >
                                    <IconCheck className="size-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openCancel(order)}
                                    disabled={order.status === "canceled"}
                                  >
                                    <IconX className="size-4" />
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
                <CardFooter>
                  <div className="flex w-full justify-center">
                    <div className="text-sm text-muted-foreground flex-1">
                      Hiển thị {startIndex + 1}-
                      {Math.min(endIndex, orders.length)} trong {orders.length}{" "}
                      đơn hàng
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Trang trước
                      </Button>
                      <div className="flex items-center gap-2 px-3">
                        <span className="text-sm font-medium">
                          Trang {page}/{totalPages}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        Trang sau
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Khách hàng
                </Label>
                <p className="mt-1 font-semibold">
                  {selectedOrder?.customer_name || "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="mt-1">{selectedOrder?.customer_email || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </Label>
                <p className="mt-1">{selectedOrder?.customer_phone || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ngày đặt
                </Label>
                <p className="mt-1">
                  {selectedOrder && formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Địa chỉ giao hàng
                </Label>
                <p className="mt-1">
                  {selectedOrder?.shipping_address
                    ? `${
                        selectedOrder.shipping_address.addressDetail
                      }, ${getWardName(
                        selectedOrder.shipping_address.ward
                      )}, ${getDistrictName(
                        selectedOrder.shipping_address.district
                      )}, ${getProvinceName(
                        selectedOrder.shipping_address.city
                      )}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Phương thức thanh toán
                </Label>
                <p className="mt-1">
                  {selectedOrder?.payment_method.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>
            {selectedOrder?.coupon_code && (
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-3 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Mã giảm giá
                  </Label>
                  <p className="mt-1 font-mono text-sm bg-background px-2 py-1 rounded inline-block">
                    {selectedOrder.coupon_code}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Giá trị giảm
                  </Label>
                  <p className="mt-1 text-red-600 font-semibold">
                    {selectedOrder.coupon_value?.toLocaleString() +
                      " " +
                      `${selectedOrder.coupon_type === "fixed" ? "VND" : "%"}`}
                  </p>
                </div>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Sản phẩm
              </Label>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead className="text-right">Giá gốc</TableHead>
                      <TableHead className="text-right">Giá sau giảm</TableHead>
                      <TableHead className="text-right">Tổng đạt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder?.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.product_name || item.product_id}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discount ? (
                            <span className="text-orange-600 font-medium">
                              {item.discount}%
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discount > 0 ? (
                            <span className="line-through text-muted-foreground text-sm">
                              {formatCurrency(
                                item.original_price || item.price
                              )}
                            </span>
                          ) : (
                            formatCurrency(item.original_price || item.price)
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              item.discount > 0
                                ? "text-green-600 font-semibold"
                                : ""
                            }
                          >
                            {formatCurrency(item.price)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">
                  Tổng tiền hàng (sau giảm sản phẩm):
                </span>
                <span className="font-medium text-red-600 ">
                  {selectedOrder?.items
                    ?.reduce((sum, item) => sum + (item.total || 0), 0)
                    .toLocaleString() +
                    " " +
                    "VND" || 0 + " " + "VND"}
                </span>
              </div>
              {selectedOrder?.coupon_value &&
                selectedOrder.coupon_value > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Giảm giá coupon{" "}
                      {selectedOrder.coupon_code
                        ? `(${selectedOrder.coupon_code})`
                        : ""}
                      :
                    </span>
                    <span className="font-medium text-red-600">
                      -{" "}
                      {selectedOrder.coupon_value?.toLocaleString() +
                        " " +
                        `${
                          selectedOrder.coupon_type === "fixed" ? "VND" : "%"
                        }`}
                    </span>
                  </div>
                )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span>Thành tiền:</span>
                <span className="text-lg text-primary">
                  {selectedOrder && formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </Label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedOrder && getStatusColor(selectedOrder.status)
                    }`}
                  >
                    {selectedOrder && getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ngày đặt hàng
                </Label>
                <p className="mt-1">
                  {selectedOrder && formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái cho đơn hàng #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái mới</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="canceled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateStatusOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrder?.id}? Hành động
              này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Không
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Hủy đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
