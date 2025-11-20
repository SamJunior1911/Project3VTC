// src/Purchase.jsx - Đã sửa
import React, { useState, useEffect } from "react";
import OrderTable from "./orders/OrderTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllOrderData } from "../../services/orderService";
import { getAssetsData } from "../../services/productService";
import { Ellipsis } from "lucide-react";

const Purchase = () => {
  const [data, setData] = useState([]); // data sẽ là mảng các đơn hàng
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchAllOrder = async () => {
      setLoading(true);
      try {
        const res = await getAllOrderData(
          `api/order/customer?page=${currentPage}&limit=${limit}`
        );
        console.log(res);

        const { orders, pagination } = res;
        setTotalPages(pagination.total_pages);
        setTotalItems(pagination.total_items);

        // Chỉ cần thêm productImage vào từng order_detail, không gộp
        const ordersWithImages = await Promise.all(
          orders.map(async (order) => {
            if (Array.isArray(order.order_detail)) {
              const detailsWithImages = await Promise.all(
                order.order_detail.map(async (detail) => {
                  try {
                    const assetRes = await getAssetsData(
                      `api/assets/${detail.product_id}`
                    );
                    const path = assetRes.map((asset) => asset.path) || [];
                    return { ...detail, productImage: path[0] || "" };
                  } catch (error) {
                    console.error(
                      "Lỗi khi fetch asset cho sản phẩm:",
                      detail.product_id,
                      error
                    );
                    return { ...detail, productImage: "" };
                  }
                })
              );
              return { ...order, order_detail: detailsWithImages };
            }
            return order;
          })
        );

        setData(ordersWithImages);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu đơn hàng:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrder();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginationItems = () => {
    const delta = 2;
    const items = [];

    if (totalPages > 0) {
      items.push(1);
    }

    const startPage = Math.max(2, currentPage - delta);
    const endPage = Math.min(totalPages - 1, currentPage + delta);

    if (startPage > 2) {
      items.push("ellipsis_before");
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages - 1) {
      items.push("ellipsis_after");
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const paginationItems = getPaginationItems();

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử Mua hàng</h1>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="flex-grow p-2 border border-gray-300 rounded-md"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent className="h-auto">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrderTable
          data={data}
          globalFilter={globalFilter}
          statusFilter={statusFilter}
        />

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {paginationItems.map((item, index) => (
                <PaginationItem key={index}>
                  {item === "ellipsis_before" || item === "ellipsis_after" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(item);
                      }}
                      isActive={currentPage === item}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div className="text-center text-sm text-gray-500 mt-2">
          Tổng cộng: {totalItems} đơn hàng
        </div>
      </div>
    </div>
  );
};

export default Purchase;
