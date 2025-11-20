import mongoose from "mongoose";
import Category from "../models/Category.js";
import slugify from "slugify";

export const listParentCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      parentId: null,
      deleted_at: null,
    };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const listCate = await Category.findActive()
      .find(query)
      .select("name slug _id status")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(query);

    const listWithChildrenCount = await Promise.all(
      listCate.map(async (cate) => {
        const childrenCount = await Category.countDocuments({
          parentId: cate._id,
          deleted_at: null,
        });
        return { ...cate._doc, childrenCount };
      })
    );

    res.status(200).json({
      message: " Lấy danh sách danh mục cha thành công",
      listCate: listWithChildrenCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(" Lỗi khi lấy danh mục cha:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Lỗi server khi lấy danh mục cha",
      error: error.message,
    });
  }
};

export const listSubcategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      parentId: { $ne: null },
      deleted_at: null,
    };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const listCate = await Category.findActive()
      .find(query)
      .populate("parentId", "name slug")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(query);

    res.status(200).json({
      message: " Lấy danh sách danh mục con thành công",
      listCate,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục con:", {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });
    res.status(500).json({
      message: "Lỗi server khi lấy danh mục con",
      error: error.message,
    });
  }
};

export const listCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", parentId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      deleted_at: null,
      status: true,
    };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ message: "parentId không hợp lệ" });
      }
      const parentCategory = await Category.findOne({
        _id: parentId,
        deleted_at: null,
      });
      if (!parentCategory) {
        return res.status(404).json({ message: "Danh mục cha không tồn tại" });
      }
      query.parentId = parentId;
    } else {
      query.parentId = null;
    }

    const listCate = await Category.findActive()
      .find(query)
      .populate("parentId", "name slug")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(query);

    res.status(200).json({
      message: " Lấy danh sách danh mục thành công",
      listCate,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(" Lỗi khi lấy danh mục:", {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });
    res.status(500).json({
      message: "Lỗi server khi lấy danh mục",
      error: error.message,
    });
  }
};

export const listCategoryByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const { categories: listCate, pagination } = await Category.findByParentId(
      parentId,
      {
        page,
        limit,
        search,
      }
    );

    res.status(200).json({
      message: "✅ Lấy danh mục con thành công",
      listCate,
      pagination,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục con:", {
      error: error.message,
      stack: error.stack,
      params: req.params,
      query: req.query,
    });
    res.status(500).json({
      message: "Lỗi server khi lấy danh mục con",
      error: error.message,
    });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categoryTree = await Category.getCategoryTree();
    res.status(200).json({
      message: " Lấy cây danh mục thành công",
      categoryTree,
    });
  } catch (error) {
    console.error(" Lỗi khi lấy cây danh mục:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Lỗi server khi lấy cây danh mục",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, status, parentId } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Tên danh mục là bắt buộc và phải là chuỗi",
      });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description || "",
      status: status !== undefined ? status : true,
      parentId: parentId || null,
    });

    await newCategory.save();

    res.status(201).json({
      message: `✅ Tạo danh mục "${newCategory.name}" thành công`,
      category: await newCategory.populate("parentId", "name slug"),
    });
  } catch (error) {
    console.error(" Lỗi khi tạo danh mục:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });

    res.status(500).json({
      message: "Lỗi server khi tạo danh mục",
      error: error.message,
    });
  }
};

export const updatedCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description, status, parentId } = req.body;

    const category = await Category.findOne({ slug, deleted_at: null });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    if (name) {
      const newSlug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      const existedSlug = await Category.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
        deleted_at: null,
      });
      if (existedSlug) {
        return res
          .status(400)
          .json({ message: "Slug đã tồn tại ở danh mục khác" });
      }
      category.name = name.trim();
      category.slug = newSlug;
    }

    if (description !== undefined) category.description = description;
    if (status !== undefined) category.status = status;
    if (parentId !== undefined) {
      category.parentId = parentId || null;
    }

    await category.save();

    res.status(200).json({
      message: ` Cập nhật danh mục "${category.name}" thành công`,
      category: await category.populate("parentId", "name slug"),
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật danh mục:", {
      error: error.message,
      stack: error.stack,
      body: req.body,
      params: req.params,
    });
    res.status(500).json({
      message: "Lỗi server khi cập nhật danh mục",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, deleted_at: null });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    category.deleted_at = new Date();
    category.status = false;
    await category.save();

    res.status(200).json({
      message: ` Xóa danh mục "${category.name}" thành công`,
      category: await category.populate("parentId", "name slug"),
    });
  } catch (error) {
    console.error(" Lỗi khi xóa danh mục:", {
      error: error.message,
      stack: error.stack,
      params: req.params,
    });
    res.status(500).json({
      message: "Lỗi server khi xóa danh mục",
      error: error.message,
    });
  }
};
