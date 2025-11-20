import axios from "axios";
import * as orderService from "../services/order.service.js";
export const createOrderController = async (req, res) => {
  try {
    const { customerToken, items, coupon_id, method, total, address } =
      req.body;

    const result = await orderService.createOrderService(
      customerToken,
      items,
      coupon_id,
      method,
      address,
      total
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderSummaryController = async (req, res) => {
  try {
    const customerToken = req.headers.authorization?.split(" ")[1];

    if (!customerToken) {
      return res.status(401).json({ error: "Chưa có token" });
    }

    const order = await orderService.getOrderSummaryService(customerToken);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    const result = await orderService.updateOrderStatusService(
      order_id,
      status
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrderCustomerController = async (req, res) => {
  try {
    const customerToken = req.headers.authorization?.split(" ")[1];
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!customerToken) {
      return res.status(401).json({ error: "Chưa có token" });
    }

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Page và limit phải lớn hơn 0" });
    }
    const result = await orderService.getAllOrderCustomerService(
      customerToken,
      page,
      limit
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrdersAdminController = async (req, res) => {
  try {
    const orders = await orderService.getAllOrdersAdminService();
    console.log(orders);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const orderDetails = await orderService.getAllOrderDetailsAdminService(id);
    console.log(orderDetails);
    if (!orderDetails || orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy chi tiết đơn hàng",
      error: error.message,
    });
  }
};
