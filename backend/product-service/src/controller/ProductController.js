// import fs from "fs";
// import mongoose from "mongoose";
// import slugify from "slugify";
// import Product from "../models/Product.js";
// import ProductAttribute from "../models/ProductAttribute.js";
// import { handleCreateProductAttribute } from "../controller/ProductAttributeController.js";
// import Asset from "../models/Asset.js";
// import cloudinary from "../config/cloudinary.js";
// export const ListProduct = async (req, res, next) => {
//   try {
//     const listProduct = await Product.find().sort({
//       created_at: -1,
//     });
//     res.status(200).json(listProduct);
//   } catch (error) {
//     console.log("Lỗi khi lấy dữ liệu:", error);
//     res.status(500).json({ message: "Lỗi hệ thống" });
//   }
// };
// export const getSuggest = async (req, res) => {
//   const { request } = req.body;
//   const keyword = String(request || "").trim();

//   if (!keyword) {
//     return res.json({ data: [] });
//   }

//   try {
//     const products = await Product.find({
//       status: "active",
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { author: { $regex: keyword, $options: "i" } },
//         { category: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } }
//       ]
//     })
//     .limit(10)
//     .lean();

//     // Lấy ảnh đầu tiên
//     const results = await Promise.all(
//       products.map(async (p) => {
//         const asset = await Asset.findOne({ product_id: p._id }).sort({ createdAt: 1 });
//         return {
//           ...p,
//           image: asset?.path || "https://via.placeholder.com/300x400"
//         };
//       })
//     );

//     res.json({ data: results });
//   } catch (error) {
//     console.error(error);
//     res.json({ data: [] });
//   }
// };
// export const ListActiveProduct = async (req, res) => {
//   try {
//     const listProduct = await Product.find({ status: "active" }).sort({
//       created_at: -1,
//     });
//     res.status(200).json(listProduct);
//   } catch (error) {
//     console.log("Lỗi khi lấy dữ liệu:", error);
//     res.status(500).json({ message: "Lỗi hệ thống" });
//   }
// };
// export const CreateProduct = async (req, res) => {
//   try {
//     const {
//       category_id,
//       title,
//       author,
//       description,
//       price,
//       discount,
//       quantity,
//       status,
//       is_feature,
//       attributes,
//     } = req.body;

//     if (!category_id || !title || !price || !quantity || !author) {
//       return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
//     }

//     const slug = slugify(title, {
//       lower: true,
//       strict: true,
//       locale: "vi",
//       trim: true,
//     });

//     const newProduct = new Product({
//       category_id,
//       title,
//       author,
//       slug,
//       description,
//       price,
//       discount,
//       quantity,
//       status,
//       is_feature,
//     });
//     await newProduct.save();

//     const files = req.files || [];
//     const uploadedAssets = [];

//     for (let file of files) {
//       const uploadRes = await cloudinary.uploader.upload(file.path, {
//         folder: "products",
//       });

//       const newAsset = new Asset({
//         product_id: newProduct._id,
//         file_name: file.originalname,
//         path: uploadRes.secure_url,
//         public_id: uploadRes.public_id,
//         type: file.mimetype.startsWith("image") ? "image" : "other",
//         size: file.size,
//       });
//       await newAsset.save();
//       uploadedAssets.push(newAsset);

//       fs.unlink(file.path, (err) => {
//         if (err) console.error("Không xoá được file tạm:", err.message);
//       });
//     }

//     let parsedAttributes = [];
//     if (attributes) {
//       try {
//         parsedAttributes =
//           typeof attributes === "string" ? JSON.parse(attributes) : attributes;
//       } catch (err) {
//         console.error("Lỗi parse attributes:", err);
//       }
//     }

//     let addedAttributes = [];

//     if (Array.isArray(parsedAttributes) && parsedAttributes.length > 0) {
//       for (const attr of parsedAttributes) {
//         try {
//           const newAttr = await handleCreateProductAttribute({
//             product_id: newProduct._id,
//             attribute_id: attr.attribute_id,
//             type: attr.type,
//             values: attr.values,
//           });
//           addedAttributes.push(newAttr);
//         } catch (err) {
//           console.warn(`Không thể thêm attribute: ${err.message}`);
//         }
//       }
//     }

//     res.status(201).json({
//       message: "Tạo sản phẩm thành công",
//       product: newProduct,
//       assets: uploadedAssets,
//       attributes: addedAttributes,
//     });
//   } catch (error) {
//     console.error("Lỗi khi gọi hàm CreateProduct", error);
//     res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
//   }
// };

// export const UpdateProduct = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const product = await Product.findOne({ slug });
//     if (!product) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }

//     const {
//       category_id,
//       title,
//       author,
//       description,
//       price,
//       discount,
//       quantity,
//       status,
//       is_feature,
//       attributes,
//     } = req.body;

//     // Update cơ bản
//     if (title) {
//       product.title = title;
//       product.slug = slugify(title, {
//         lower: true,
//         strict: true,
//         locale: "vi",
//       });
//     }
//     if (category_id) product.category_id = category_id;
//     if (author) product.author = author;
//     if (description) product.description = description;
//     if (price) product.price = price;
//     if (discount) product.discount = discount;
//     if (quantity) product.quantity = quantity;
//     if (status) product.status = status;
//     if (typeof is_feature !== "undefined") product.is_feature = is_feature;

//     await product.save();

//     // ========================
//     //  1. XÓA ẢNH CŨ
//     // ========================
//     const oldAssets = await Asset.find({ product_id: product._id });

//     for (const asset of oldAssets) {
//       if (asset.public_id) {
//         try {
//           await cloudinary.uploader.destroy(asset.public_id);
//         } catch (err) {
//           console.error("Lỗi xoá ảnh Cloudinary:", err.message);
//         }
//       }
//     }

//     await Asset.deleteMany({ product_id: product._id });

//     // ========================
//     //  2. UPLOAD ẢNH MỚI
//     // ========================
//     const files = req.files || [];
//     const uploadedAssets = [];

//     for (let file of files) {
//       const uploadRes = await cloudinary.uploader.upload(file.path, {
//         folder: "products",
//       });

//       const newAsset = new Asset({
//         product_id: product._id,
//         file_name: file.originalname,
//         path: uploadRes.secure_url,
//         public_id: uploadRes.public_id, // ✔ LƯU PUBLIC_ID
//         type: file.mimetype.startsWith("image") ? "image" : "other",
//         size: file.size,
//       });

//       await newAsset.save();
//       uploadedAssets.push(newAsset);

//       fs.unlink(file.path, (err) => {
//         if (err) console.error("Không xoá file tạm:", err.message);
//       });
//     }

//     // ========================
//     //  3. XỬ LÝ ATTRIBUTES
//     // ========================
//     let parsedAttributes = [];

//     if (attributes) {
//       try {
//         parsedAttributes =
//           typeof attributes === "string" ? JSON.parse(attributes) : attributes;
//       } catch (error) {
//         console.error("Lỗi parse:", error);
//       }
//     }

//     const updatedAttributes = [];

//     for (const attr of parsedAttributes) {
//       const newAttr = await handleCreateProductAttribute({
//         product_id: product._id,
//         attribute_id: attr.attribute_id,
//         type: attr.type,
//         values: attr.values,
//       });
// updatedAttributes.push(newAttr);
//     }

//     res.json({
//       message: "Cập nhật sản phẩm thành công",
//       product,
//       assets: uploadedAssets,
//       attributes: updatedAttributes,
//     });
//   } catch (error) {
//     console.error("UpdateProduct ERROR:", error);
//     res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
//   }
// };
// export const DeleteProduct = async (req, res, next) => {
//   try {
//     const { slug } = req.params;
//     const product = await Product.findOne({ slug });
//     if (!product) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }
//     await ProductAttribute.deleteMany({ product_id: product._id });
//     await Asset.deleteMany({ product_id: product._id });
//     await Product.deleteOne({ _id: product._id });

//     res.status(200).json({ message: "Sản phẩm đã được xóa hoàn toàn" });
//   } catch (error) {
//     console.error("Lỗi khi xóa sản phẩm:", error);
//     res.status(500).json({ message: "Lỗi hệ thống" });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log(" Nhận ID:", id);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       console.log(" ID không hợp lệ");
//       return res.status(400).json({ message: "❌ ID sản phẩm không hợp lệ" });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       console.log(" Không tìm thấy sản phẩm");
//       return res.status(404).json({ message: "❌ Không tìm thấy sản phẩm" });
//     }

//     console.log(" Tìm thấy sản phẩm:", product);
//     res.json(product);
//   } catch (error) {
//     console.error(" Lỗi lấy sản phẩm chi tiết:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const DecreaseStock = async (req, res) => {
//   try {
//     if (!Array.isArray(req.body) || req.body.length === 0) {
//       return res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ" });
//     }

//     const results = [];
//     let hasError = false;

//     for (const { product_id, quantity } of req.body) {
//       if (!product_id || !quantity) {
//         results.push({
//           product_id,
//           success: false,
//           message: "Thiếu product_id hoặc quantity",
//         });
//         hasError = true;
//         continue;
//       }

//       const product = await Product.findById(product_id);
//       if (!product) {
//         results.push({
//           product_id,
//           success: false,
//           message: "Không tìm thấy sản phẩm",
//         });
//         hasError = true;
//         continue;
//       }

//       if (product.quantity < quantity) {
//         results.push({
//           product_id,
//           success: false,
//           message: "Không đủ hàng tồn kho",
//         });
//         hasError = true;
//         continue;
//       }

//       // Trừ tồn kho
//       product.quantity -= quantity;
//       product.sold += quantity;
//       await product.save();

//       results.push({
//         product_id,
//         success: true,
//         message: "Đã cập nhật tồn kho thành công",
//       });
//     }

//     // Nếu có bất kỳ sản phẩm lỗi nào, trả status 400, vẫn gửi chi tiết
//     if (hasError) {
//       return res.status(400).json({
//         message: "Có một số sản phẩm không thể trừ tồn kho",
//         results,
//       });
//     }

//     // Nếu tất cả thành công
//     return res.status(200).json({
//       message: "Đã trừ tồn kho tất cả sản phẩm thành công",
//       results,
//     });
//   } catch (error) {
//     console.error("❌ Lỗi khi trừ hàng:", error.message);
//     return res
//       .status(500)
//       .json({ message: "Lỗi server", error: error.message });
//   }
// };
// export const getDetail = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const data = await Product.findOne({ slug: slug });
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ message: "Loi server", error: error.message });
//   }
// };


import fs from "fs";
import mongoose from "mongoose";
import slugify from "slugify";
import Product from "../models/Product.js";
import ProductAttribute from "../models/ProductAttribute.js";
import { handleCreateProductAttribute } from "../controller/ProductAttributeController.js";
import Asset from "../models/Asset.js";
import cloudinary from "../config/cloudinary.js";
export const ListProduct = async (req, res, next) => {
  try {
    const listProduct = await Product.find().sort({
      created_at: -1,
    });
    res.status(200).json(listProduct);
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getSuggest = async (req, res) => {
  const { request } = req.body;
  const keyword = String(request || "").trim();

  if (!keyword) {
    return res.json({ data: [] });
  }

  try {
    const products = await Product.find({
      status: "active",
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    })
    .limit(10)
    .lean();

    // Lấy ảnh đầu tiên
    const results = await Promise.all(
      products.map(async (p) => {
        const asset = await Asset.findOne({ product_id: p._id }).sort({ createdAt: 1 });
        return {
          ...p,
          image: asset?.path || "https://via.placeholder.com/300x400"
        };
      })
    );

    res.json({ data: results });
  } catch (error) {
    console.error(error);
    res.json({ data: [] });
  }
};
export const ListActiveProduct = async (req, res) => {
  try {
    const listProduct = await Product.find({ status: "active" }).sort({
      created_at: -1,
    });
    res.status(200).json(listProduct);
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const CreateProduct = async (req, res) => {
  try {
    const {
      category_id,
      title,
      author,
      description,
      price,
      discount,
      quantity,
      status,
      is_feature,
      attributes,
    } = req.body;

    if (!category_id || !title || !price || !quantity || !author) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
    });

    const newProduct = new Product({
      category_id,
      title,
      author,
      slug,
      description,
      price,
      discount,
      quantity,
      status,
      is_feature,
    });
    await newProduct.save();

    const files = req.files || [];
    const uploadedAssets = [];

    for (let file of files) {
      const uploadRes = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      const newAsset = new Asset({
        product_id: newProduct._id,
        file_name: file.originalname,
        path: uploadRes.secure_url,
        public_id: uploadRes.public_id,
        type: file.mimetype.startsWith("image") ? "image" : "other",
        size: file.size,
      });
      await newAsset.save();
      uploadedAssets.push(newAsset);

      fs.unlink(file.path, (err) => {
        if (err) console.error("Không xoá được file tạm:", err.message);
      });
    }

    let parsedAttributes = [];
    if (attributes) {
      try {
        parsedAttributes =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;
      } catch (err) {
        console.error("Lỗi parse attributes:", err);
      }
    }

    let addedAttributes = [];

    if (Array.isArray(parsedAttributes) && parsedAttributes.length > 0) {
      for (const attr of parsedAttributes) {
        try {
          const newAttr = await handleCreateProductAttribute({
            product_id: newProduct._id,
            attribute_id: attr.attribute_id,
            type: attr.type,
            values: attr.values,
          });
          addedAttributes.push(newAttr);
        } catch (err) {
          console.warn(`Không thể thêm attribute: ${err.message}`);
        }
      }
    }

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product: newProduct,
      assets: uploadedAssets,
      attributes: addedAttributes,
    });
  } catch (error) {
    console.error("Lỗi khi gọi hàm CreateProduct", error);
    res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    // Cập nhật thông tin cơ bản
    const { category_id, title, author, description, price, discount, quantity, status, is_feature, attributes } = req.body;

    if (title) {
      product.title = title;
      product.slug = slugify(title, { lower: true, strict: true, locale: "vi" });
    }
    if (category_id) product.category_id = category_id;
    if (author) product.author = author;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discount !== undefined) product.discount = Number(discount);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (status) product.status = status;
    if (is_feature !== undefined) product.is_feature = is_feature === "true" || is_feature === true;

    await product.save();

    let uploadedAssets = [];

    // CHỈ XỬ LÝ ẢNH KHI CÓ ẢNH MỚI
    if (req.files && req.files.length > 0) {
      const oldAssets = await Asset.find({ product_id: product._id });
      for (const asset of oldAssets) {
        if (asset.public_id) {
          await cloudinary.uploader.destroy(asset.public_id).catch(() => {});
        }
      }
      await Asset.deleteMany({ product_id: product._id });

      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, { folder: "products" });
        const newAsset = new Asset({
          product_id: product._id,
          file_name: file.originalname,
          path: uploadRes.secure_url,
          public_id: uploadRes.public_id,
          type: file.mimetype.startsWith("image") ? "image" : "other",
          size: file.size,
        });
        await newAsset.save();
        uploadedAssets.push(newAsset);
        fs.unlink(file.path, () => {});
      }
    }

    // Xử lý attributes
    if (attributes) {
      await ProductAttribute.deleteMany({ product_id: product._id });
      const attrs = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
      if (Array.isArray(attrs)) {
        for (const attr of attrs) {
          await handleCreateProductAttribute({
            product_id: product._id,
            attribute_id: attr.attribute_id,
            type: attr.type,
            values: attr.values,
          });
        }
      }
    }

    res.json({
      message: "Cập nhật sản phẩm thành công",
      product,
      assets: uploadedAssets.length > 0 ? uploadedAssets : "Giữ nguyên ảnh cũ"
    });
  } catch (error) {
    console.error("UpdateProduct ERROR:", error);
    res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};
export const DeleteProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    // Xóa ảnh Cloudinary trước
    const assets = await Asset.find({ product_id: product._id });
    for (const asset of assets) {
      if (asset.public_id) {
        await cloudinary.uploader.destroy(asset.public_id).catch(() => {});
      }
    }

    await Asset.deleteMany({ product_id: product._id });
    await ProductAttribute.deleteMany({ product_id: product._id });
    await Product.deleteOne({ _id: product._id });

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(" Nhận ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // console.log(" ID không hợp lệ");
      return res.status(400).json({ message: "❌ ID sản phẩm không hợp lệ" });
    }

    const product = await Product.findById(id);
    if (!product) {
      console.log(" Không tìm thấy sản phẩm");
      return res.status(404).json({ message: "❌ Không tìm thấy sản phẩm" });
    }

    console.log(" Tìm thấy sản phẩm:", product);
    res.json(product);
  } catch (error) {
    console.error(" Lỗi lấy sản phẩm chi tiết:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const DecreaseStock = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ" });
    }

    const results = [];
    let hasError = false;

    for (const { product_id, quantity } of req.body) {
      if (!product_id || !quantity) {
        results.push({
          product_id,
          success: false,
          message: "Thiếu product_id hoặc quantity",
        });
        hasError = true;
        continue;
      }

      const product = await Product.findById(product_id);
      if (!product) {
        results.push({
          product_id,
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
        hasError = true;
        continue;
      }

      if (product.quantity < quantity) {
        results.push({
          product_id,
          success: false,
          message: "Không đủ hàng tồn kho",
        });
        hasError = true;
        continue;
      }

      // Trừ tồn kho
      product.quantity -= quantity;
      product.sold += quantity;
      await product.save();

      results.push({
        product_id,
        success: true,
        message: "Đã cập nhật tồn kho thành công",
      });
    }

    // Nếu có bất kỳ sản phẩm lỗi nào, trả status 400, vẫn gửi chi tiết
    if (hasError) {
      return res.status(400).json({
        message: "Có một số sản phẩm không thể trừ tồn kho",
        results,
      });
    }

    // Nếu tất cả thành công
    return res.status(200).json({
      message: "Đã trừ tồn kho tất cả sản phẩm thành công",
      results,
    });
  } catch (error) {
    console.error("❌ Lỗi khi trừ hàng:", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
export const getDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await Product.findOne({ slug: slug });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Loi server", error: error.message });
  }
};
