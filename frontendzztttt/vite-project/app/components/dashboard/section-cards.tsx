"use client";

import { useEffect, useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/dashboard/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import { dashboardApi } from "@/lib/dashboard/dashboard";

export function SectionCards() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    averageOrderValue: 0,
    orderGrowth: 0,
    customerGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getDashboardStats();
        setStats({
          totalRevenue: data.totalRevenue,
          totalOrders: data.totalOrders,
          activeCustomers: data.activeCustomers,
          averageOrderValue: data.averageOrderValue,
          orderGrowth: data.orderGrowth,
          customerGrowth: data.customerGrowth,
        });
      } catch (error) {
        console.error("[v0] Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tổng Doanh Thu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            {loading
              ? "..."
              : stats.totalRevenue.toLocaleString() + " " + "VND"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Tổng từ tất cả các đơn hàng
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tổng Đơn Hàng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            {loading ? "..." : stats.totalOrders}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Tất cả đơn hàng trong hệ thống
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Khách Hàng Hoạt Động</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            {loading ? "..." : stats.activeCustomers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Khách hàng đang hoạt động</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Giá Trị Đơn Hàng Trung Bình</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            {loading
              ? "..."
              : Math.round(stats.averageOrderValue).toLocaleString() +
                " " +
                "VND"}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tăng lên mỗi đơn <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Trung bình doanh thu trên đơn
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
