const API_BASE_URL = "http://localhost:5100/api/customer";

// Interface cho Customer
export interface Customer {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  birthDay?: string;
  isVerified: boolean;
  isActive: boolean;
  addresses?: any[];
  orders?: number;
  spent?: number;
}

export interface PaginatedCustomersResponse {
  result: {
    customers: Customer[];
    totalCustomer: number;
    activeCount: number;
    verifiedCount: number;
    inactiveCount: number;
    page: number;
    totalPage: number;
  };
}

// Lấy tất cả khách hàng với phân trang
export const getAllCustomers = async (
  page = 1,
  limit = 3
): Promise<PaginatedCustomersResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/customers?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể lấy danh sách khách hàng"
      );
    }

    const data = await response.json();
    console.log("[v0] Customers data from API:", data);
    return data;
  } catch (error) {
    console.error("[v0] Error fetching customers:", error);
    throw error;
  }
};

// Bật/Tắt trạng thái khách hàng
export const toggleCustomerStatus = async (
  customerId: string
): Promise<{ message: string; customer: Customer }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/customer/${customerId}/toggle-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Không thể cập nhật trạng thái khách hàng"
      );
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("[v0] Error toggling customer status:", error);
    throw error;
  }
};

export const customerApi = {
  getAllCustomers,
  toggleCustomerStatus,
};
