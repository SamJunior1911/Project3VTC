import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const SearchController = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const keyword = q.trim();

    const matchedCategories = await Category.find({
      name: { $regex: keyword, $options: "i" },
    }).select("_id name");

    const categoryIds = matchedCategories.map((c) => c._id);

    const products = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { category_id: { $in: categoryIds } },
      ],
    })
      .populate("category_id", "name")
      .lean();

    res.status(200).json({
      query: keyword,
      results: products,
      total: products.length,
    });
  } catch (err) {
    console.error("Lỗi search:", err);
    res.status(500).json({
      message: "Lỗi server khi tìm kiếm",
      error: err.message,
    });
  }
};
