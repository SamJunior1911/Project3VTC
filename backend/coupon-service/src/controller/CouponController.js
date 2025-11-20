import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo coupon thành công",
      data: coupon,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      create_at: -1,
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const ListCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({ coupon_status: "active" }).sort({
      create_at: -1,
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getCouponByIdOrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({
      _id: id,
      coupon_status: "active",
    });

    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy coupon" });

    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy coupon để cập nhật" });

    res.status(200).json({
      success: true,
      message: "Cập nhật coupon thành công",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, {
      deleted_at: new Date(), //Soft delete giúp vẫn giữ dữ liệu trong DB, chỉ ẩn đi khi truy vấn.
    });

    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy coupon để xóa" });

    res
      .status(200)
      .json({ success: true, message: "Đã xóa coupon (soft delete)" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;
    const coupon = await Coupon.findOne({
      coupon_code: code.toUpperCase(),
      deleted_at: null,
    });

    if (!coupon)
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không tồn tại.",
      });

    if (!coupon.isValid())
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã hết hạn hoặc bị vô hiệu.",
      });

    if (coupon.coupon_used_count >= coupon.coupon_uses_per_coupon)
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã được sử dụng hết số lượt cho phép.",
      });

    if (total < coupon.coupon_min_spend)
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${coupon.coupon_min_spend.toLocaleString()}đ để áp dụng mã này.`,
      });

    if (coupon.coupon_max_spend && total > coupon.coupon_max_spend)
      return res.status(400).json({
        success: false,
        message: `Mã chỉ áp dụng cho đơn hàng tối đa ${coupon.coupon_max_spend.toLocaleString()}đ.`,
      });

    let discount =
      coupon.coupon_type === "percent"
        ? (total * coupon.coupon_value) / 100
        : coupon.coupon_value;

    if (discount > total) discount = total;

    coupon.coupon_used_count += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Áp dụng mã giảm giá thành công",
      discount,
      total_after_discount: total - discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const useCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy coupon",
      });
    }
    const now = new Date();
    if (
      coupon.coupon_status !== "active" ||
      now < coupon.coupon_start ||
      now > coupon.coupon_end
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon đã hết hạn hoặc không hợp lệ",
      });
    }

    if (coupon.coupon_used_count >= coupon.coupon_uses_per_coupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon đã được sử dụng hết lượt",
      });
    }

    coupon.coupon_used_count += 1;

    if (coupon.coupon_used_count >= coupon.coupon_uses_per_coupon) {
      coupon.coupon_status = "disabled";
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật coupon thành công",
      data: coupon,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật coupon",
    });
  }
};
