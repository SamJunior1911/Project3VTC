import express from "express";
import {
  listAttributes,
  getAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controller/AttributeController.js";

const router = express.Router();

router.get("/", listAttributes);
router.get("/:id", getAttribute);
router.post("/", createAttribute);
router.put("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

export default router;
