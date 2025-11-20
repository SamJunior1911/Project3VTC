const API_BASE_ORDER = "http://localhost:5003/api/order";
const API_BASE_CUSTOMER = "http://localhost:5100/api/customer";
const API_BASE_PRODUCT = "http://localhost:3001/api/products";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  orderGrowth: number;
  customerGrowth: number;
  averageOrderValue: number;
}

export interface OrderStats {
  pending: number;
  confirmed: number;
  completed: number;
  canceled: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [ordersRes, customersRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_ORDER}/admin`, { method: "GET" }),
      fetch(`${API_BASE_CUSTOMER}/admin/customers?page=1&limit=1000`, {
        method: "GET",
      }),
      fetch(`${API_BASE_PRODUCT}`, { method: "GET" }),
    ]);

    const orders = await ordersRes.json();
    const customersData = await customersRes.json();
    const products = await productsRes.json();

    const customers = customersData?.result?.customers || [];
    const totalOrders = Array.isArray(orders) ? orders.length : 0;
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: any) => c.isActive).length;
    const totalProducts = Array.isArray(products) ? products.length : 0;

    const totalRevenue = Array.isArray(orders)
      ? orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
      : 0;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      activeCustomers,
      totalProducts,
      orderGrowth: 12.5,
      customerGrowth: -20,
      averageOrderValue,
    };
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      activeCustomers: 0,
      totalProducts: 0,
      orderGrowth: 0,
      customerGrowth: 0,
      averageOrderValue: 0,
    };
  }
};

export const getOrderStats = async (): Promise<OrderStats> => {
  try {
    const response = await fetch(`${API_BASE_ORDER}/admin`, { method: "GET" });
    const orders = await response.json();

    if (!Array.isArray(orders)) {
      return { pending: 0, confirmed: 0, completed: 0, canceled: 0 };
    }

    return {
      pending: orders.filter((o: any) => o.status === "pending").length,
      confirmed: orders.filter((o: any) => o.status === "confirmed").length,
      completed: orders.filter((o: any) => o.status === "completed").length,
      canceled: orders.filter((o: any) => o.status === "canceled").length,
    };
  } catch (error) {
    console.error("[v0] Error fetching order stats:", error);
    return { pending: 0, confirmed: 0, completed: 0, canceled: 0 };
  }
};

export const dashboardApi = {
  getDashboardStats,
  getOrderStats,
};
