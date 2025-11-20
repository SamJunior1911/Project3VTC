// import { geminiResponseService } from "../service/gemini.service.js";

// export const geminiResponseController = async (req, res) => {
//   const { request } = req.body;

//   if (!request) {
//     return res.status(400).json({ error: "Prompt không được để trống" });
//   }

//   try {
//     const result = await geminiResponseService(request);
//     res.json({ success: true, data: result });
//   } catch (error) {
//     console.error("Lỗi khi gọi Gemini API:", error);
//     res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý yêu cầu" });
//   }
// };

// controller/gemini.controller.js
import { geminiResponseService } from "../service/gemini.service.js";

export const geminiResponseController = async (req, res) => {
  const { request, userId } = req.body;

  if (!request?.trim()) {
    return res.status(400).json({ error: "Nội dung không được để trống" });
  }

  try {
    const result = await geminiResponseService(request, userId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Lỗi Gemini:", error.message);
    res.status(500).json({ success: false, error: "Mình đang bận chút xíu, thử lại sau nha!" });
  }
};