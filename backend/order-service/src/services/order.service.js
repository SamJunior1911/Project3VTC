import { nanoid } from "nanoid";
import { supabase } from "../config/supabase.js";
import { sendToQueue } from "../config/rabbitmq.js";
import dotenv from "dotenv";
import axios from "axios";
import { customAlphabet } from "nanoid";

dotenv.config();

export const createOrderService = async (
  customerToken,
  items,
  coupon_id,
  method,
  address
) => {
  let customerId;
  console.log(address);
  try {
    const customerResponse = await axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      }
    );
    customerId = customerResponse.data?.id;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Customer not found");
    }
    throw new Error("Cannot verify customer");
  }
  try {
    const productData = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/decrease-stock`,
      productData
    );
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ server:", error.response.data);
      throw new Error("Có lỗi khi giảm tồn kho:\n", error.response.data);
    } else {
      // Lỗi network hoặc khác
      console.error("Lỗi network hoặc không xác định:", error.message);
    }
  }
  let total = items.reduce((sum, item) => sum + item.price, 0);
  let discountPercent = 0;
  let discountAmount = 0;
  if (coupon_id) {
    try {
      const couponResponse = await axios.get(
        `${process.env.COUPON_SERVICE_URL}/${coupon_id}`
      );

      // console.log(couponResponse)
      const couponData = couponResponse.data?.data;

      if (!couponData) {
        throw new Error("Không tìm thấy thông tin coupon");
      }
      const now = new Date();
      const start = new Date(couponData.coupon_start);
      const end = new Date(couponData.coupon_end);

      if (couponData.coupon_status !== "active") {
        throw new Error("Coupon không còn hiệu lực");
      }
      if (now < start || now > end) {
        throw new Error("Coupon đã hết hạn hoặc chưa bắt đầu");
      }
      if (total < couponData.coupon_min_spend) {
        throw new Error(
          `Đơn hàng cần tối thiểu ${couponData.coupon_min_spend}đ để dùng mã này`
        );
      }

      if (couponData.coupon_type === "percent") {
        discountPercent = couponData.coupon_value;
        discountAmount = (total * couponData.coupon_value) / 100;
      } else if (couponData.coupon_type === "fixed") {
        discountAmount = couponData.coupon_value;
      }

      total = Math.max(total - discountAmount, 0);
      await axios.patch(`${process.env.COUPON_SERVICE_URL}/${coupon_id}/use`);
    } catch (error) {
      console.error("Lỗi khi lấy coupon:", error.message);
      throw new Error("Không thể lấy thông tin coupon");
    }
  }
  const nanoidSafe = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    10
  );

  const order_id = nanoidSafe();

  const { data: order, error } = await supabase
    .from("order")
    .insert([
      {
        id: order_id,
        customer_id: customerId,
        total,
        shipping_address: address,
        coupon_id,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  const discountedItems = items.map((item) => ({
    product_id: item.product_id,
    name: item.name,
    quantity: item.quantity,
    discountedPrice: item.price - (item.price * discountPercent) / 100,
  }));

  const order_detail = discountedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    name: item.name,
    quantity: item.quantity,
    price: item.discountedPrice,
  }));

  const { error: detailError } = await supabase
    .from("order_detail")
    .insert(order_detail);

  if (detailError) throw new Error(detailError.message);

  // if (coupon_id) {
  //   try {
  //     const couponResponse = await axios.patch();
  //   } catch (error) {
  //     throw new Error("Lỗi khi xóa coupon", error);
  //   }
  // }

  if (method === "cod") {
    await supabase
      .from("order")
      .update({ status: "pending" })
      .eq("id", order.id);

    await sendToQueue(process.env.PAYMENT_REQUEST_QUEUE, {
      order_id: order.id,
      method,
      amount: total,
    });
    await sendToQueue(process.env.CART_DELETE_QUEUE, {
      customer_id: order.customer_id,
    });

    return {
      order_id: order.id,
      status: "pending",
      message: "Đơn hàng đã được tạo, thanh toán khi nhận hàng",
      method: "cod",
    };
  } else {
    await sendToQueue(process.env.PAYMENT_REQUEST_QUEUE, {
      order_id: order.id,
      method,
      amount: total,
    });
    await sendToQueue(process.env.CART_DELETE_QUEUE, {
      customer_id: order.customer_id,
    });
    return {
      order_id: order.id,
      status: "pending_payment",
      message: "Yêu cầu thanh toán đã được gửi",
    };
  }
};

export const updateOrderStatusService = async (
  order_id,
  status,
  payment_id = null
) => {
  const updateData = { status };
  if (payment_id) updateData.payment_id = payment_id;
  const { error } = await supabase
    .from("order")
    .update(updateData)
    .eq("id", order_id);

  if (error) throw new Error(error.message);
};

export const getOrderSummaryService = async (customerToken) => {
  let customer_id;

  try {
    const customerResponse = await axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/profile`,
      {
        headers: {
          authorization: `Bearer ${customerToken}`,
        },
      }
    );

    customer_id = customerResponse.data.id;
  } catch (error) {
    throw new Error(error);
  }

  const { data: order, error } = await supabase
    .from("order")
    .select(`*,order_detail (*)`)
    .eq("customer_id", customer_id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  const productData = await Promise.all(
    order[0].order_detail?.map(async (od) => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/assets/${od.product_id}`
        );
        const mergeData = data.flat();
        const paths = mergeData
          .filter((item) => item.path)
          .map((item) => item.path);
        return paths;
      } catch (error) {
        console.error("Error fetching product:", error.message);
        return [];
      }
    })
  );

  const detailedOrder = {
    ...order[0],
    order_detail: order[0].order_detail?.map((od, index) => ({
      ...od,
      image: productData[index][0] || null,
    })),
  };

  return detailedOrder;
};

/**
 * Service để lấy tất cả đơn hàng của một khách hàng
 * @param {string} customerToken - Token của khách hàng (hoặc token có thể xác thực khách hàng)
 * @returns {Promise<Array>} - Danh sách đơn hàng của khách hàng
 */
export const getAllOrderCustomerService = async (
  customerToken,
  page = 1,
  limit = 10
) => {
  let customerId;

  try {
    const customerResponse = await axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      }
    );

    customerId = customerResponse.data.id;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Customer not found");
    }
    console.error("Error verifying customer:", error.message);
    throw new Error("Cannot verify customer");
  }

  const offset = (page - 1) * limit;

  const {
    data: orders,
    error: supabaseError,
    count,
  } = await supabase
    .from("order")
    .select(
      `
      id,
      customer_id,
      status,
      total,
      created_at,
      order_detail (
        id,
        product_id,
        name,
        quantity,
        price,
        created_at
      )
    `,
      { count: "exact" }
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (supabaseError) {
    console.error("Supabase error:", supabaseError.message);
    throw new Error(
      `Có lỗi xảy ra khi truy vấn đơn hàng: ${supabaseError.message}`
    );
  }

  return {
    orders,
    pagination: {
      current_page: page,
      per_page: limit,
      total_items: count,
      total_pages: Math.ceil(count / limit),
    },
  };
};

/**
 * Service để lấy tất cả đơn hàng (dành cho admin)
 * @returns {Promise<Array>} - Danh sách tất cả đơn hàng
 */
export const getAllOrdersAdminService = async () => {
  const { data: allOrders, error: supabaseError } = await supabase
    .from("order")
    .select("*")
    .order("created_at", { ascending: false });
  if (supabaseError) {
    console.error("Supabase error:", supabaseError.message);
    throw new Error(
      `Có lỗi xảy ra khi truy vấn tất cả đơn hàng: ${supabaseError.message}`
    );
  }

  return allOrders;
};
export const getAllOrderDetailsAdminService = async (order_id = null) => {
  let query = supabase
    .from("order_detail")
    .select("*")
    .order("created_at", { ascending: false });

  if (order_id) {
    query = query.eq("order_id", order_id);
  }

  const { data: orderDetails, error: supabaseError } = await query;

  if (supabaseError) {
    console.error("Supabase error:", supabaseError.message);
    throw new Error(
      `Có lỗi xảy ra khi truy vấn chi tiết đơn hàng: ${supabaseError.message}`
    );
  }

  return orderDetails;
};
