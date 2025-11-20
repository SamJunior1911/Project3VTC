import { geminiResponseController } from "../controller/gemini.controller.js";
import express from "express";
const router = express.Router();

router.post("/ask", geminiResponseController);

export default router;
