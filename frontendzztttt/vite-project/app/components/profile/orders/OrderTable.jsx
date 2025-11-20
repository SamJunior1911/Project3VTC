// src/components/OrderTable.jsx - Đã sửa để hiển thị theo đơn hàng
import React, { useMemo } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { SquareDashedBottom } from "lucide-react";
import { Link } from "react-router-dom";
import { statusOptions } from "../../../lib/statusOptions";

const OrderTable = ({ data, globalFilter, statusFilter }) => {
  const filteredOrders = useMemo(() => {
    return data.filter((order) => {
      if (
        statusFilter &&
        statusFilter !== "all" &&
        order.status !== statusFilter
      ) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm
      if (globalFilter) {
        const searchLower = globalFilter.toLowerCase();
        // Tìm kiếm trong ID đơn hàng, tên sản phẩm, hoặc bất kỳ trường nào khác
        const matchesId = order.id.toLowerCase().includes(searchLower);
        const matchesProduct = order.order_detail.some(
          (detail) =>
            detail.name.toLowerCase().includes(searchLower) ||
            detail.product_id.toLowerCase().includes(searchLower)
        );
        return matchesId || matchesProduct;
      }

      return true;
    });
  }, [data, globalFilter, statusFilter]);

  if (filteredOrders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SquareDashedBottom />
          </EmptyMedia>
          <EmptyTitle>Chưa có đơn hàng nào</EmptyTitle>
          <EmptyDescription>Bắt đầu mua sản phẩm</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>
            <Link to="/">Đi đến cửa hàng</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => {
        let statusColor = "bg-gray-100 text-gray-800";
        if (order.status === "pending")
          statusColor = "bg-yellow-100 text-yellow-800";
        if (order.status === "completed")
          statusColor = "bg-green-100 text-green-800";
        if (order.status === "cancelled")
          statusColor = "bg-red-100 text-red-800";

        const statusLabel =
          statusOptions.find((opt) => opt.value === order.status)?.label ||
          order.status;

        return (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            {/* Header của đơn hàng */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold text-gray-900">
                  Mã đơn hàng: {order.id}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total)}
                </div>
                <div className="text-sm text-gray-500">
                  Ngày đặt: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm trong đơn hàng */}
            <div className="space-y-3">
              {order.order_detail.map((detail) => (
                <div
                  key={detail.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
                >
                  {detail.productImage ? (
                    <img
                      src={detail.productImage}
                      alt={detail.name}
                      className="size-15 object-cover rounded-md"
                    />
                  ) : null}

                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {detail.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Số lượng: {detail.quantity}
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(detail.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTable;
