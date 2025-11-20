"use client";

import "../globals.css";
import type React from "react";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/dashboard/ui/sidebar";
import { Button } from "@/components/dashboard/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dashboard/ui/dialog";
import { Label } from "@/components/dashboard/ui/label";
import { toast } from "sonner";
import { customerApi, type Customer } from "@/lib/dashboard/apicustomer";

export default function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const [stats, setStats] = useState({
    totalCustomer: 0,
    active: 0,
    verified: 0,
    inactive: 0,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAllCustomers(page, limit);

      setCustomers(data.result.customers || []);
      setTotal(data.result.totalCustomer || 0);
      setTotalPages(data.result.totalPage || 1);
      setStats({
        totalCustomer: data.result.totalCustomer,
        active: data.result.activeCount,
        verified: data.result.verifiedCount,
        inactive: data.result.inactiveCount,
      });
      console.log("[v0] Customers response:", data);
      setCustomers(data.result.customers || []);
      console.log(customers);
      setTotal(data.result.totalCustomer || 0);
      const pages = Math.ceil((data.result.totalCustomer || 0) / limit) || 1;
      setTotalPages(pages);
    } catch (error) {
      console.error("[v0] Error:", error);
      toast.error("Không thể tải danh sách khách hàng");
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      await customerApi.toggleCustomerStatus(selectedUser._id);
      toast.success(
        `Đã ${selectedUser.isActive ? "khóa" : "kích hoạt"} tài khoản ${
          selectedUser.fullName
        }!`
      );
      setIsEditOpen(false);
      fetchCustomers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật trạng thái khách hàng");
    }
  };

  const handleDelete = () => {
    toast.info("Chức năng xóa khách hàng chưa được triển khai");
    setIsDeleteOpen(false);
  };

  const openEdit = (user: Customer) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDelete = (user: Customer) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
              <div>
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <p className="text-muted-foreground">
                  Quản lý thông tin và hoạt động của khách hàng
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tổng người dùng</CardDescription>
                    <CardTitle className="text-4xl">
                      {stats.totalCustomer}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Đang hoạt động</CardDescription>
                    <CardTitle className="text-4xl">{stats.active}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Đã xác thực</CardDescription>
                    <CardTitle className="text-4xl">{stats.verified}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Đã khóa</CardDescription>
                    <CardTitle className="text-4xl">{stats.inactive}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Danh sách người dùng</CardTitle>
                  <CardDescription>
                    Xem và quản lý tất cả người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Đang tải...</div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có khách hàng nào
                    </div>
                  ) : (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Xác thực</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell className="font-medium">
                                #{user._id.slice(-6)}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {user.fullName}
                              </TableCell>
                              <TableCell className="text-bold">
                                {user.email}
                              </TableCell>
                              <TableCell>{user.phone || "N/A"}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.isVerified
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}
                                >
                                  {user.isVerified
                                    ? "Đã xác thực"
                                    : "Chưa xác thực"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.isActive
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  {user.isActive ? "Hoạt động" : "Đã khóa"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEdit(user)}
                                  >
                                    <IconPencil className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          {total > 0 ? (
                            <>
                              Hiển thị {(page - 1) * limit + 1} -{" "}
                              {Math.min(page * limit, total)} trong tổng số{" "}
                              {total} khách hàng
                            </>
                          ) : (
                            "Không có dữ liệu"
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                          >
                            Trang trước
                          </Button>
                          <span className="flex items-center px-2 text-sm text-muted-foreground">
                            Trang {page} / {Math.max(1, totalPages)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPage((p) =>
                                Math.min(p + 1, Math.max(1, totalPages))
                              )
                            }
                            disabled={page >= totalPages || totalPages <= 1}
                          >
                            Trang sau
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái khách hàng</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái hoạt động của khách hàng{" "}
              {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Tên khách hàng</Label>
              <p className="font-semibold">{selectedUser?.fullName}</p>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <p>{selectedUser?.email}</p>
            </div>
            <div className="grid gap-2">
              <Label>Trạng thái hiện tại</Label>
              <p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedUser?.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {selectedUser?.isActive ? "Hoạt động" : "Đã khóa"}
                </span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Hành động</Label>
              <p className="text-sm text-muted-foreground">
                Nhấn "Xác nhận" để{" "}
                {selectedUser?.isActive ? "khóa" : "kích hoạt"} tài khoản này
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleToggleStatus}
              variant={selectedUser?.isActive ? "destructive" : "default"}
            >
              {selectedUser?.isActive
                ? "Khóa tài khoản"
                : "Kích hoạt tài khoản"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
