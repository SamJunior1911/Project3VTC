import mongoose from "mongoose";
import slugify from "slugify";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      minlength: [2, "Tên danh mục phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên danh mục không được vượt quá 100 ký tự"],
      match: [
        /^[\p{L}\s-]+$/u,
        "Tên danh mục chỉ được chứa chữ cái, số và khoảng trắng",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      validate: {
        validator: async function (value) {
          if (!value) return true; // Danh mục cha hợp lệ
          const parent = await mongoose
            .model("Category")
            .findOne({ _id: value, deleted_at: null });
          if (!parent) {
            throw new Error("Danh mục cha không tồn tại");
          }
          if (parent.parentId !== null) {
            throw new Error("Danh mục cha không thể là danh mục con");
          }
          const hasCircularReference = async (categoryId, parentId) => {
            let currentId = parentId;
            const visited = new Set();
            while (currentId && !visited.has(currentId.toString())) {
              visited.add(currentId.toString());
              const parent = await mongoose
                .model("Category")
                .findOne({ _id: currentId, deleted_at: null });
              if (!parent) break;
              if (parent._id.toString() === categoryId.toString()) return true;
              currentId = parent.parentId;
            }
            return false;
          };
          if (this._id && (await hasCircularReference(this._id, value))) {
            throw new Error("Không thể tạo vòng lặp danh mục");
          }
          return true;
        },
        message: (props) => props.reason.message,
      },
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Thêm index để cải thiện hiệu suất
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ status: 1, deleted_at: 1 });

categorySchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: new Date() });
  next();
});
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && typeof this.name === "string") {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

categorySchema.pre("findOneAndDelete", async function (next) {
  const category = await this.model.findOne(this.getQuery());
  if (category && category.parentId === null) {
    const hasChildren = await this.model.findOne({
      parentId: category._id,
      deleted_at: null,
    });
    if (hasChildren) {
      throw new Error("Không thể xóa danh mục cha khi còn danh mục con");
    }
  }
  next();
});

categorySchema.pre("save", async function (next) {
  // Nếu document mới hoặc tên bị thay đổi
  if (this.isNew || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });

    // Nếu slug rỗng (ví dụ name trống)
    if (!this.slug) {
      this.slug = `slug-${Date.now()}`;
    }

    // Kiểm tra trùng slug trong DB
    const exists = await mongoose.model("Category").findOne({
      slug: this.slug,
      _id: { $ne: this._id },
      deleted_at: null,
    });
    if (exists) {
      this.slug += "-" + Date.now(); // thêm hậu tố tránh trùng
    }
  }
  next();
});
categorySchema.post("findOneAndUpdate", function (error, doc, next) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message);
    next(new Error(messages.join("; ")));
  } else {
    next(error);
  }
});

categorySchema.static("findActive", function () {
  return this.find({ deleted_at: null });
});

categorySchema.static(
  "findByParentId",
  async function (parentId, options = {}) {
    const { page = 1, limit = 10, search = "" } = options;
    const skip = (Number(page) - 1) * Number(limit);
    const query = { parentId, deleted_at: null };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const categories = await this.find(query)
      .populate("parentId", "name slug")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await this.countDocuments(query);
    return {
      categories,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
);

categorySchema.static("getCategoryTree", async function () {
  const categories = await this.find({ deleted_at: null }).select(
    "name slug _id parentId status"
  );
  const buildTree = (categories, parentId = null) => {
    return categories
      .filter(
        (cate) => (cate.parentId ? cate.parentId.toString() : null) === parentId
      )
      .map((cate) => ({
        ...cate._doc,
        children: buildTree(categories, cate._id.toString()),
      }));
  };
  return buildTree(categories);
});

export default mongoose.model("Category", categorySchema);
