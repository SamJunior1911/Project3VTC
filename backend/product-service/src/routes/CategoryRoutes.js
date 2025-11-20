import express from "express";
import { body, param, query, validationResult } from "express-validator";
import {
  listCategory,
  listCategoryByParent,
  createCategory,
  updatedCategory,
  deleteCategory,
  listParentCategories,
  getCategoryTree,
  listSubcategories,
} from "../controller/CategoryController.js";
import mongoose from "mongoose";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Dữ liệu đầu vào không hợp lệ",
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

const validateCategory = [
  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên danh mục phải từ 2 đến 100 ký tự")
    .matches(/^[\p{L}\s-]+$/u)
    .withMessage(
      "Tên danh mục chỉ được chứa chữ cái, khoảng trắng và dấu gạch ngang (-)"
    ),
  body("description").optional().isString().withMessage("Mô tả phải là chuỗi"),
  body("status")
    .optional()
    .isBoolean()
    .withMessage("Trạng thái phải là true/false"),
  body("parentId")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("parentId phải là ObjectId hợp lệ");
      }
      return true;
    })
    .withMessage("parentId phải là ObjectId hợp lệ hoặc null"),
];

const validateSlug = [
  param("slug").isString().trim().notEmpty().withMessage("Slug không hợp lệ"),
];

const validateParentId = [
  param("parentId").isMongoId().withMessage("parentId phải là ObjectId hợp lệ"),
];

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page phải là số nguyên dương"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit phải là số nguyên dương"),
  query("search")
    .optional()
    .isString()
    .trim()
    .withMessage("Tìm kiếm phải là chuỗi"),
  query("parentId")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("parentId phải là ObjectId hợp lệ");
      }
      return true;
    })
    .withMessage("parentId phải là ObjectId hợp lệ hoặc null"),
];

router.get("/", validatePagination, validate, listCategory);
router.get("/parents", validatePagination, validate, listParentCategories);
router.get("/subcategories", validatePagination, validate, listSubcategories);
router.get(
  "/by-parent/:parentId",
  validateParentId,
  validatePagination,
  validate,
  listCategoryByParent
);
router.get("/tree", getCategoryTree);
router.post("/", validateCategory, validate, createCategory);
router.put("/:slug", validateSlug, validateCategory, validate, updatedCategory);
router.delete("/:slug", validateSlug, validate, deleteCategory);

export default router;
