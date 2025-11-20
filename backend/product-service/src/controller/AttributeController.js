import Attribute from "../models/Attribute.js";

export const listAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json(attributes);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const getAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);
    if (!attribute)
      return res.status(404).json({ message: "Không tìm thấy Attribute" });
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const createAttribute = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Tên thuộc tính là bắt buộc" });
    }
    const exists = await Attribute.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Thuộc tính này đã tồn tại trong hệ thống" });
    }
    const newAttr = new Attribute({ name, description });
    await newAttr.save();
    res.status(201).json({
      message: "Tạo attribute thành công",
      attribute: newAttr,
    });
  } catch (err) {
    console.error("Lỗi khi tạo attribute:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const attribute = await Attribute.findById(id);
    if (!attribute)
      return res.status(404).json({ message: "Không tìm thấy Attribute" });

    if (name) attribute.name = name;
    if (description) attribute.description = description;

    await attribute.save();
    res.status(200).json({ message: "Cập nhật thành công", attribute });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    await Attribute.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa attribute thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
