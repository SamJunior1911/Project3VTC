import ProductAttribute from "../models/ProductAttribute.js";
import Product from "../models/Product.js";
import Attribute from "../models/Attribute.js";

export const listProductAttributes = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    const attrs = await ProductAttribute.find({
      product_id: productId,
    }).populate("attribute_id", "name description");

    res.status(200).json(attrs);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const handleCreateProductAttribute = async ({
  product_id,
  attribute_id,
  type,
  values,
}) => {
  if (!product_id || !attribute_id || !type || !values) {
    throw new Error("Thiếu dữ liệu bắt buộc");
  }

  const product = await Product.findById(product_id);
  if (!product) throw new Error("Sản phẩm không tồn tại");

  const attribute = await Attribute.findById(attribute_id);
  if (!attribute) throw new Error("Thuộc tính không tồn tại");

  const validTypes = ["select", "radio", "checkbox", "custom"];
  if (!validTypes.includes(type)) throw new Error("Loại type không hợp lệ");

  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Values phải là một mảng và không được rỗng");
  }

  const exists = await ProductAttribute.findOne({ product_id, attribute_id });
  if (exists) throw new Error("Thuộc tính này đã tồn tại cho sản phẩm");

  const newProdAttr = new ProductAttribute({
    product_id,
    attribute_id,
    type,
    values,
  });
  await newProdAttr.save();
  return newProdAttr;
};

export const createProductAttribute = async (req, res) => {
  try {
    const { product_id, attribute_id, type, values } = req.body;
    const newProdAttr = await handleCreateProductAttribute({
      product_id,
      attribute_id,
      type,
      values,
    });

    res.status(201).json({
      message: "Tạo ProductAttribute thành công",
      productAttribute: newProdAttr,
    });
  } catch (err) {
    console.error("Lỗi khi tạo ProductAttribute:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProductAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    const pa = await ProductAttribute.findById(id);
    if (!pa)
      return res
        .status(404)
        .json({ message: "Không tìm thấy ProductAttribute" });

    if (type) pa.type = type;
    if (value) pa.value = value;

    await pa.save();

    res
      .status(200)
      .json({ message: "Cập nhật thành công", productAttribute: pa });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const deleteProductAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductAttribute.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa ProductAttribute thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
export const DecreaseStock = async (req, res) => {
  const { items } = req.body;

  try {
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity },
      });
    }

    res.json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error("Lỗi khi trừ kho:", error.message);
    res.status(500).json({ error: error.message });
  }
};
