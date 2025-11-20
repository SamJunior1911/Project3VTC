"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/dashboard/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/dashboard/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/dashboard/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/dashboard/ui/toggle-group";
import { orderApi } from "@/lib/dashboard/apiorder";
import type { Order } from "@/lib/dashboard/apiorder";

interface ChartDataPoint {
  date: string; // "YYYY-MM-DD" theo giờ local
  pending: number;
  canceled: number;
  completed: number;
}

const chartConfig = {
  orders: {
    label: "Đơn hàng",
  },
  pending: {
    label: "Đơn đặt",
    color: "hsl(45 100% 55%)",
  },
  canceled: {
    label: "Đơn hủy",
    color: "hsl(0 84% 60%)",
  },
  completed: {
    label: "Đơn hoàn thành",
    color: "hsl(142 76% 36%)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orders = await orderApi.getAllOrdersAdmin();

        const dateMap = new Map<
          string,
          { pending: number; canceled: number; completed: number }
        >();

        orders.forEach((order: Order) => {
          const createdAt = new Date(order.created_at);

          // chuẩn hóa về 00:00 theo giờ local
          createdAt.setHours(0, 0, 0, 0);

          // dùng NGÀY LOCAL làm key, tránh lệch ngày do UTC
          const year = createdAt.getFullYear();
          const month = String(createdAt.getMonth() + 1).padStart(2, "0");
          const day = String(createdAt.getDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`; // ví dụ: "2025-11-13"

          const existing = dateMap.get(dateKey) || {
            pending: 0,
            canceled: 0,
            completed: 0,
          };

          if (order.status === "pending") {
            existing.pending++;
          } else if (order.status === "canceled") {
            existing.canceled++;
          } else if (order.status === "completed") {
            existing.completed++;
          }

          dateMap.set(dateKey, existing);
        });

        const data: ChartDataPoint[] = Array.from(
          dateMap,
          ([date, counts]) => ({
            date,
            ...counts,
          })
        ).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setChartData(data);
      } catch (error) {
        console.error("[v0] Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date); // "YYYY-MM-DD" → OK

    const referenceDate = new Date();
    referenceDate.setHours(0, 0, 0, 0);

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Thống Kê Đơn Hàng</CardTitle>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          ></ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 tháng qua" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 tháng qua
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 ngày qua
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 ngày qua
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(45 100% 55%)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(45 100% 55%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCanceled" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(0 84% 60%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(0 84% 60%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142 76% 36%)"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142 76% 36%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value as string).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="canceled"
                type="natural"
                fill="url(#fillCanceled)"
                stroke="hsl(0 84% 60%)"
                stackId="a"
              />
              <Area
                dataKey="pending"
                type="natural"
                fill="url(#fillPending)"
                stroke="hsl(45 100% 55%)"
                stackId="a"
              />
              <Area
                dataKey="completed"
                type="natural"
                fill="url(#fillCompleted)"
                stroke="hsl(142 76% 36%)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
        <ul className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(142 76% 36%) 0%, hsla(142, 76%, 36%, 0.1) 100%)",
              }}
            />
            <span>Đơn hoàn thành</span>
          </li>

          <li className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(45 100% 55%) 0%, hsla(45, 100%, 55%, 0.1) 100%)",
              }}
            />
            <span>Đơn đặt</span>
          </li>

          <li className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(0 84% 60%) 0%, hsla(0, 84%, 60%, 0.1) 100%)",
              }}
            />
            <span>Đơn huỷ</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
