
// // services/gemini.service.js – BẢN CUỐI CÙNG, HOÀN HẢO, KHÔNG LỖI, THÔNG MINH NHƯ GEMINI
// import { model } from "../config/gemini.js";
// import axios from "axios";

// const PRODUCT_API = process.env.PRODUCT_URL || "http://localhost:5000";

// // PROMPT SIÊU THÔNG MINH – ĐÃ NHÚNG TRỰC TIẾP, KHÔNG CẦN FILE RIÊNG
// const createSmartPrompt = (userInput, dbBooks = [], isAuthorQuery = false, authorName = "") => `
// Bạn là trợ lý AI siêu thông minh của một nhà sách online, giống hệt Gemini.
// Bạn hỗ trợ TẤT CẢ: tìm sách, tư vấn tác giả, thể loại, giá, khuyến mãi, đăng nhập/đăng xuất, trò chuyện vui vẻ.

// Người dùng hỏi: "${userInput}"

// Dữ liệu sách có sẵn trong shop (rất quan trọng – chỉ được gợi ý những sách này):
// ${dbBooks.length > 0 
//   ? JSON.stringify(dbBooks.map(b => ({ title: b.title, author: b.author, price: b.price, discount: b.discount })), null, 2)
//   : "Hiện tại KHÔNG có sách nào khớp với yêu cầu này."}

// ${isAuthorQuery ? `Người dùng đang hỏi về tác giả "${authorName}". Hãy trả lời ngắn gọn về tác giả (1-2 câu), sau đó kiểm tra xem shop có sách của tác giả này không.` : ""}

// QUY TẮC BẮT BUỘC:
// 1. Luôn trả lời bằng tiếng Việt, thân thiện, tự nhiên, thêm emoji vui vẻ.
// 2. Nếu có sách trong danh sách → gợi ý ngay, không bịa thêm sách nào khác.
// 3. Nếu không có sách → nói thật: "Shop mình chưa có sách này" hoặc "Chưa có sách của tác giả này".
// 4. Nếu hỏi "logout", "đăng xuất" → hướng dẫn: "Bạn vào góc phải trên → Avatar → Đăng xuất nhé!"
// 5. Không dùng markdown (**bold**, *nghiêng*, #heading).
// 6. Không thêm link thủ công trừ khi cần thiết.

// Trả lời tự nhiên và ngắn gọn (tối đa 3-4 câu):
// `.trim();

// export const geminiResponseService = async (request) => {
//   const input = (request || "").toString().trim();
//   const lower = input.toLowerCase();

//   // 1. XỬ LÝ NHANH – KHÔNG GỌI GEMINI
//   if (!input || lower.length <= 3 || /hello|hi|chào|helo|hey|hí|alo/.test(lower)) {
//     return { greeting: "Chào bạn! Mình là trợ lý tìm sách siêu thông minh đây. Bạn cần tìm gì hôm nay nào?", books: [] };
//   }
//   if (/bye|baibai|tạm biệt|88|bb/.test(lower)) {
//     return { greeting: "Tạm biệt bạn! Hẹn gặp lại nha!", books: [] };
//   }
//   if (/cảm ơn|thanks|ok|okie/.test(lower)) {
//     return { greeting: "Hihi không có gì! Chúc bạn mua sách vui vẻ nha!", books: [] };
//   }
//   if (/logout|đăng xuất/.test(lower)) {
//     return { greeting: "Để đăng xuất, bạn click vào avatar ở góc phải trên → chọn 'Đăng xuất' nhé!", books: [] };
//   }

//   // 2. TÌM SÁCH TRONG DB
//   let dbBooks = [];
//   let isAuthorQuery = false;
//   let authorName = "";

//   // Trích xuất tên tác giả nếu có
//   const authorMatch = input.match(/(tác giả|tác giả của|ai viết|viết bởi)\s+["']?([^"']+?)["']?\??$/i);
//   if (authorMatch) {
//     isAuthorQuery = true;
//     authorName = authorMatch[2].trim();
//   }

//   try {
//     const keyword = input.replace(/[^a-zA-Zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủiũụưứừửữựỳýỷỹỵđ\s]/g, " ").trim();
//     const res = await axios.post(
//       `${PRODUCT_API}/api/products/get-suggest-books`,
//       { request: keyword || input },
//       { timeout: 7000 }
//     );

//     if (res.data?.data?.length > 0) {
//       dbBooks = res.data.data.map(book => ({
//         _id: book._id,
//         title: book.title,
//         author: book.author || "Không rõ",
//         price: book.price,
//         discount: book.discount || 0,
//         image: book.assets?.[0]?.path || book.image || "https://via.placeholder.com/300x400",
//         slug: book.slug,
//       }));
//     }
//   } catch (err) {
//     console.log("DB search lỗi → vẫn tiếp tục:", err.message);
//   }

//   // 3. NẾU CÓ SÁCH → TRẢ NGAY, KHÔNG GỌI GEMINI (NHANH + CHÍNH XÁC)
//   if (dbBooks.length > 0) {
//     const greeting = isAuthorQuery
//       ? `Tác giả ${authorName} rất nổi tiếng! Shop mình đang có ${dbBooks.length} cuốn sách của tác giả này đây:`
//       : "Mình tìm thấy vài cuốn sách phù hợp với bạn đây!";
    
//     return { greeting, books: dbBooks.slice(0, 6) };
//   }

//   // 4. KHÔNG CÓ SÁCH → GỌI GEMINI ĐỂ TRẢ LỜI THÔNG MINH
//   try {
//     const prompt = createSmartPrompt(input, dbBooks, isAuthorQuery, authorName);

//     const result = await model.generateContent(prompt);
//     const text = (await result.response)?.text()?.trim();

//     const fallbackGreeting = isAuthorQuery
//       ? `Tác giả ${authorName} là một nhà văn nổi tiếng. Rất tiếc shop mình chưa có sách của tác giả này. Bạn muốn tìm sách tương tự không?`
//       : "Mình chưa tìm được sách phù hợp. Bạn thử nói rõ hơn hoặc xem danh mục sách nhé!";

//     return { greeting: text || fallbackGreeting, books: [] };

//   } catch (geminiError) {
//     console.log("Gemini lỗi → trả lời an toàn:", geminiError.message);
//     return {
//       greeting: "Mình đang hơi mệt xíu, bạn thử lại sau vài giây nha!",
//       books: []
//     };
//   }
// };


// services/gemini.service.js – MỖI USER CÓ LỊCH SỬ RIÊNG, KHÔNG DÙNG LOCALSTORAGE
import { model } from "../config/gemini.js";
import axios from "axios";
import NodeCache from "node-cache";

// Cache lưu lịch sử chat riêng cho từng user (24h tự xóa nếu không hoạt động)
const chatHistoryCache = new NodeCache({ stdTTL: 24 * 60 * 60, checkperiod: 600 });

const PRODUCT_API = process.env.PRODUCT_URL || "http://localhost:5000";

// Prompt thông minh (giữ nguyên như cũ)
const createSmartPrompt = (userInput, dbBooks = [], isAuthorQuery = false, authorName = "") => `
Bạn là trợ lý AI siêu thông minh của một nhà sách online, giống hệt Gemini.
Bạn hỗ trợ TẤT CẢ: tìm sách, tư vấn tác giả, thể loại, giá, khuyến mãi, đăng nhập/đăng xuất, trò chuyện vui vẻ.

Người dùng hỏi: "${userInput}"

Dữ liệu sách có sẵn trong shop:
${dbBooks.length > 0 
  ? JSON.stringify(dbBooks.map(b => ({ title: b.title, author: b.author, price: b.price, discount: b.discount })), null, 2)
  : "Hiện tại KHÔNG có sách nào khớp với yêu cầu này."}

${isAuthorQuery ? `Người dùng đang hỏi về tác giả "${authorName}". Hãy trả lời ngắn gọn về tác giả (1-2 câu), sau đó kiểm tra xem shop có sách của tác giả này không.` : ""}

QUY TẮC:
1. Tiếng Việt, thân thiện, thêm emoji.
2. Chỉ gợi ý sách có trong danh sách.
3. Không markdown, không link.
4. Ngắn gọn 3-4 câu.

Trả lời:
`.trim();

export const geminiResponseService = async (request, userId = "guest") => {
  const input = (request || "").toString().trim();
  const lower = input.toLowerCase();

  // Tạo key duy nhất cho user
  const userKey = userId.startsWith("guest") ? `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : `user_${userId}`;

  // Lấy lịch sử cũ
  let history = chatHistoryCache.get(userKey) || [];

  // ================== XỬ LÝ NHANH ==================
  const quickReplies = {
    hello: "Chào bạn! Mình là trợ lý tìm sách siêu thông minh đây. Bạn đang muốn tìm gì nào?",
    bye: "Tạm biệt bạn! Hẹn gặp lại nha!",
    thanks: "Hihi không có gì! Chúc bạn mua sách vui vẻ nha!",
    logout: "Để đăng xuất, bạn click avatar góc phải trên → chọn 'Đăng xuất' nhé!"
  };

  if (!input || lower.length <= 3 || /hello|hi|chào|helo|hey|hí|alo/.test(lower)) {
    const reply = quickReplies.hello;
    history.push({ role: "user", content: input || "hello" }, { role: "assistant", content: reply });
    chatHistoryCache.set(userKey, history.slice(-50));
    return { greeting: reply, books: [], userKey };
  }
  if (/bye|baibai|tạm biệt|88|bb/.test(lower)) {
    const reply = quickReplies.bye;
    history.push({ role: "user", content: input }, { role: "assistant", content: reply });
    chatHistoryCache.set(userKey, history.slice(-50));
    return { greeting: reply, books: [], userKey };
  }
  if (/cảm ơn|thanks|ok|okie/.test(lower)) {
    const reply = quickReplies.thanks;
    history.push({ role: "user", content: input }, { role: "assistant", content: reply });
    chatHistoryCache.set(userKey, history.slice(-50));
    return { greeting: reply, books: [], userKey };
  }
  if (/logout|đăng xuất/.test(lower)) {
    const reply = quickReplies.logout;
    history.push({ role: "user", content: input }, { role: "assistant", content: reply });
    chatHistoryCache.set(userKey, history.slice(-50));
    return { greeting: reply, books: [], userKey };
  }
  if (lower.includes("bé sam") || lower.includes("be sam") || lower.includes("bésam")) {
    const reply = "Bé Sam là đệ tử của anh Long và anh Trường";
    history.push({ role: "user", content: input });
    history.push({ role: "assistant", content: reply });
    chatHistoryCache.set(userKey, history.slice(-50));
    return { greeting: reply, books: [], userKey };
  }
    if (lower.includes("anh long là ai") || lower.includes("anh long")) {
    return { greeting: "Anh Long là sư phụ của Bé Sam, người dạy Bé Sam rất nhiều điều hay ho!", books: [] };
  }
  if (lower.includes("anh trường là ai") || lower.includes("anh trường")) {
    return { greeting: "Anh Trường cũng là sư phụ của Bé Sam, hai anh em cùng dạy Bé Sam lớn khôn!", books: [] };
  }

  // ================== TÌM SÁCH TRONG DB ==================
  let dbBooks = [];
  let isAuthorQuery = false;
  let authorName = "";

  const authorMatch = input.match(/(tác giả|tác giả của|ai viết|viết bởi)\s+["']?([^"']+?)["']?\??$/i);
  if (authorMatch) {
    isAuthorQuery = true;
    authorName = authorMatch[2].trim();
  }

  try {
    const keyword = input.replace(/[^a-zA-Zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ\s]/g, " ").trim();
    const res = await axios.post(`${PRODUCT_API}/api/products/get-suggest-books`, { request: keyword || input }, { timeout: 7000 });
    if (res.data?.data?.length > 0) {
      dbBooks = res.data.data.map(book => ({
        _id: book._id,
        title: book.title,
        author: book.author || "Không rõ",
        price: book.price,
        discount: book.discount || 0,
        image: book.assets?.[0]?.path || book.image || "https://via.placeholder.com/300x400",
        slug: book.slug,
      }));
    }
  } catch (err) {
    console.log("DB lỗi:", err.message);
  }

  // ================== TRẢ KẾT QUẢ ==================
  let greeting = "";
  if (dbBooks.length > 0) {
    greeting = isAuthorQuery
      ? `Tác giả ${authorName} rất nổi tiếng! Shop mình đang có ${dbBooks.length} cuốn sách của tác giả này đây:`
      : "Mình tìm thấy vài cuốn sách phù hợp với bạn đây!";
  } else {
    try {
      const prompt = createSmartPrompt(input, dbBooks, isAuthorQuery, authorName);
      const result = await model.generateContent(prompt);
      greeting = (await result.response)?.text()?.trim() || "Mình chưa tìm được sách phù hợp. Bạn thử nói rõ hơn nhé!";
    } catch {
      greeting = "Mình đang hơi mệt xíu, bạn thử lại sau vài giây nha!";
    }
  }

  // Lưu lịch sử
  history.push({ role: "user", content: input });
  history.push({ role: "assistant", content: greeting, books: dbBooks.length > 0 ? dbBooks : undefined });
  chatHistoryCache.set(userKey, history.slice(-50));

  return {
    greeting,
    books: dbBooks.slice(0, 6),
    userKey, // Trả về để frontend lưu
  };
};