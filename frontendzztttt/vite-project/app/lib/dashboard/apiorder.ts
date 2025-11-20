const API_BASE_URL = "http://localhost:5003/api/order";
const CUSTOMER_API_BASE_URL = "http://localhost:5100/api/customer";
const COUPON_API_BASE_URL = "http://localhost:3005/api/coupons";
const PRODUCT_API_BASE_URL = "http://localhost:3001/api/products";
const PAYMENT_API_BASE_URL = "http://localhost:5002/api/v1/payment";
export interface Order {
  _id?: string;
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  coupon_type: "percent" | "fixed";
  status: "pending" | "confirmed" | "completed" | "canceled";
  total: number;
  shipping_id?: string | null;
  shipping_address: string | null;
  payment_id?: string | null;
  coupon_id?: string | null;
  coupon_value?: number;
  coupon_code?: string;
  created_at: string;
  canceled_at?: string | null;
  completed_at?: string | null;
  delivered_at?: string | null;
  items?: OrderItem[];
}

export interface OrderItem {
  product_id: string;
  product_name?: string;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
  discounted_price?: number;
}

export interface Customer {
  _id: string;
  fullName: string;
  birthDay?: Date;
  email: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  addresses?: Array<{
    address: {
      city?: string;
      district?: string;
      ward?: string;
    };
    addressDetail?: string;
    isDefault?: boolean;
  }>;
  city?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderSummary extends Order {
  items: OrderItem[];
  shipping_address?: string;
  payment_method?: string;
}

export interface Coupon {
  _id: string;
  coupon_code: string;
  coupon_value: number;
  coupon_type: "percent" | "fixed";
  coupon_status: "active" | "inactive" | "expired";
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Product {
  _id: string;
  category_id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  quantity: number;
  sold: number;
  author: string;
  status: "active" | "inactive";
  is_feature: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  __v?: number;
}
export interface Payment {
  id: number;
  order_id: string;
  method: string;
  amount: number;
  status: "pending" | "success" | "failed";
  transaction_id?: string | null;
  paid_at?: string | null;
  created_at: string;
}
export interface OrderDetail {
  id: number;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  product?: Product;
  product_name?: string;
  original_price?: number;
  discount?: number;
  discounted_price?: number;
}

export const getCustomerById = async (
  customer_id: string
): Promise<Customer | null> => {
  try {
    const response = await fetch(`${CUSTOMER_API_BASE_URL}/${customer_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[v0] Customer not found for ID: ${customer_id}`);
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("[v0] Error fetching customer:", error);
    return null;
  }
};
export const getPaymentsByOrderId = async (
  order_id: string
): Promise<Payment[] | null> => {
  try {
    const response = await fetch(`${PAYMENT_API_BASE_URL}/${order_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[v0] Payment not found for Order ID: ${order_id}`);
      return null;
    }

    const result = await response.json();

    console.log("[v0] Payment API response:", result);

    if (result.success && Array.isArray(result.data)) {
      return result.data as Payment[];
    }

    return null;
  } catch (error) {
    console.error("[v0] Error fetching payment:", error);
    return null;
  }
};
// Lấy tất cả đơn hàng cho admin
export const getAllOrdersAdmin = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Không thể lấy danh sách đơn hàng");
    }

    const orders = await response.json();
    console.log("[v0] Orders from API:", orders);

    const ordersWithCustomers = await Promise.all(
      orders.map(async (order: any) => {
        const customer = await getCustomerById(order.customer_id);
        const payments = await getPaymentsByOrderId(order.id);
        const paymentMethod =
          payments && payments.length > 0 ? payments[0].method : "N/A";
        const customerName = customer
          ? `${customer.fullName}`.trim()
          : "Khách vãng lai";

        return {
          ...order,
          customer_name: customerName,
          customer_email: customer?.email || "",
          customer_phone: customer?.phone || "",
          payment_method: paymentMethod,
        };
      })
    );

    return ordersWithCustomers;
  } catch (error) {
    console.error("[v0] Error fetching orders:", error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (
  order_id: string,
  status: string
): Promise<{ message: string; order: Order }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, status }),
    });

    const text = await response.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.warn("Response không phải JSON:", text);
    }

    if (!response.ok) {
      throw new Error(data.error || "Không thể cập nhật trạng thái đơn hàng");
    }

    return data;
  } catch (error) {
    console.error("[v0] Error updating order status:", error);
    throw error;
  }
};

export const getOrderSummary = async (token: string): Promise<OrderSummary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Không thể lấy thông tin đơn hàng");
    }

    const orderSummary = await response.json();
    return orderSummary;
  } catch (error) {
    console.error("[v0] Error fetching order summary:", error);
    throw error;
  }
};

export const getCouponById = async (
  coupon_id: string
): Promise<Coupon | null> => {
  try {
    const response = await fetch(`${COUPON_API_BASE_URL}/${coupon_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[v0] Coupon not found for ID: ${coupon_id}`);
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("[v0] Error fetching coupon:", error);
    return null;
  }
};

export const getProductById = async (
  product_id: string
): Promise<Product | null> => {
  try {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${product_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[v0] Product not found for ID: ${product_id}`);
      return null;
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error("[v0] Error fetching product:", error);
    return null;
  }
};

export const getOrderDetail = async (
  orderId: string
): Promise<OrderDetail[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orderdetail/${orderId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Lỗi khi gọi API: ${response.status} ${response.statusText}`
      );
    }

    const data: OrderDetail[] = await response.json();

    const detailsWithProducts = await Promise.all(
      data.map(async (detail) => {
        const product = await getProductById(detail.product_id);
        return {
          ...detail,
          product,
          product_name: product?.title || detail.name,
          original_price: product?.price || detail.price,
          discount: product?.discount || 0,
          discounted_price: product
            ? product.price - (product.price * product.discount) / 100
            : detail.price,
        };
      })
    );

    return detailsWithProducts;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    throw error;
  }
};

export const orderApi = {
  getAllOrdersAdmin,
  updateOrderStatus,
  getCustomerById,
  getOrderSummary,
  getOrderDetail,
  getCouponById,
  getProductById,
};
