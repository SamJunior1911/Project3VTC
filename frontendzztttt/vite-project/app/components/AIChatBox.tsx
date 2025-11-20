
// // components/AIChatBox.tsx – MỖI USER CÓ LỊCH SỬ RIÊNG, KHÔNG DÙNG LOCALSTORAGE
// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { X, Send, Bot } from "lucide-react";

// interface Book {
//   _id: string;
//   title: string;
//   price: number;
//   image: string;
//   slug?: string;
// }

// interface Message {
//   from: "user" | "bot";
//   text?: string;
//   books?: Book[];
//   timestamp: number;
// }

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const AIChatBox: React.FC<Props> = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userKey, setUserKey] = useState<string>(""); // Lưu key từ backend
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Lấy userId từ JWT hoặc tạo guest
//   // Lấy userId từ JWT hoặc tạo guest
//   const getUserId = () => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           return payload.id || payload._id || "guest";
//         } catch {
//           return "guest";
//         }
//       }
//     }
//     return "guest";
//   };
//   // const getUserId = () => {
//   //   const token = localStorage.getItem("token");
//   //   if (token) {
//   //     try {
//   //       const payload = JSON.parse(atob(token.split(".")[1]));
//   //       return payload.id || payload._id || "guest";
//   //     } catch {
//   //       return "guest";
//   //     }
//   //   }
//   //   return "guest";
//   // };

//   const currentUserId = getUserId();

//   // Load lịch sử khi mở chat
//   useEffect(() => {
//     if (!isOpen) return;

//     const loadHistory = async () => {
//       try {
//         const res = await fetch(`http://localhost:5009/api/gemini/history?userId=${currentUserId}`);
//         const data = await res.json();
//         if (data.history && data.history.length > 0) {
//           const formatted = data.history.map((h: any) => ({
//             from: h.role === "user" ? "user" : "bot",
//             text: h.content,
//             books: h.books,
//             timestamp: Date.now(),
//           }));
//           setMessages(formatted);
//           setUserKey(data.userKey || "");
//         } else {
//           setMessages([
//             { from: "bot", text: "Chào bạn! Mình là trợ lý tìm sách\nBạn đang tìm gì hôm nay?", timestamp: Date.now() }
//           ]);
//         }
//       } catch {
//         setMessages([
//           { from: "bot", text: "Chào bạn! Mình là trợ lý tìm sách\nBạn đang tìm gì hôm nay?", timestamp: Date.now() }
//         ]);
//       }
//     };

//     loadHistory();
//   }, [isOpen, currentUserId]);

//   // Cuộn xuống
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = input.trim();
//     setMessages(prev => [...prev, { from: "user", text: userMsg, timestamp: Date.now() }]);
//     setInput("");
//     setLoading(true);
//     setMessages(prev => [...prev, { from: "bot", text: "typing", timestamp: Date.now() }]);

//     try {
//       const res = await fetch("http://localhost:5009/api/gemini/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ request: userMsg, userId: currentUserId }),
//       });
//       const data = await res.json();

//       setMessages(prev => prev.filter(m => m.text !== "typing"));

//       if (data.success) {
//         const { greeting, books, userKey: newKey } = data.data;
//         if (newKey) setUserKey(newKey);

//         const newMsgs: Message[] = [];
//         if (greeting) newMsgs.push({ from: "bot", text: greeting, timestamp: Date.now() });
//         if (books?.length) newMsgs.push({ from: "bot", books, timestamp: Date.now() });
//         setMessages(prev => [...prev, ...newMsgs]);
//       }
//     } catch {
//       setMessages(prev => prev.filter(m => m.text !== "typing"));
//       setMessages(prev => [...prev, { from: "bot", text: "Mạng hơi chập, bạn thử lại nhé!", timestamp: Date.now() }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   if (!isOpen) return null;

//   // Phần render giữ nguyên 100% như cũ (đẹp lung linh)
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9, y: 20 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.9, y: 20 }}
//       className="fixed bottom-20 right-4 z-50 w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col font-sans"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
//               <Bot size={22} strokeWidth={2.5} />
//             </div>
//             <div className="absolute -inset-1 bg-emerald-400/30 rounded-full animate-ping"></div>
//           </div>
//           <div className="leading-tight">
//             <h3 className="font-bold text-sm">Trợ lý AI</h3>
//             <p className="text-xs opacity-90">Tìm sách siêu nhanh</p>
//           </div>
//         </div>
//         <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-all duration-200">
//           <X size={18} />
//         </button>
//       </div>

//       {/* Tin nhắn */}
//       <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2 space-y-3 bg-gray-50">
//         {messages.map((msg, i) => (
//           <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
//             <div className="max-w-[80%]">
//               {msg.text && msg.text !== "typing" && (
//                 <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
//                   ${msg.from === "user" ? "bg-emerald-500 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
//                   {msg.text}
//                 </div>
//               )}
//               {msg.text === "typing" && (
//                 <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-none">
//                   <div className="flex gap-1">
//                     {[0, 1, 2].map(i => (
//                       <motion.div key={i} className="w-2 h-2 bg-emerald-500 rounded-full"
//                         animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {msg.books?.map(book => (
//                 <a key={book._id} href={`/product/${book.slug || book._id}`} className="block mt-2 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition">
//                   <img src={book.image} alt={book.title} className="w-full h-32 object-cover" />
//                   <div className="p-2.5">
//                     <h4 className="text-xs font-medium text-gray-800 line-clamp-2">{book.title}</h4>
//                     <p className="text-emerald-600 font-bold text-sm mt-1">{book.price.toLocaleString("vi-VN")}₫</p>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </motion.div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3 bg-white border-t border-gray-200">
//         <div className="flex gap-2">
//           <textarea
//             className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 resize-none"
//             placeholder="Hỏi mình nhé..."
//             rows={1}
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={loading}
//           />
//           <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage} disabled={loading || !input.trim()}
//             className="bg-emerald-500 disabled:bg-gray-300 text-white p-2.5 rounded-full shadow-md">
//             <Send size={18} />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default AIChatBox;

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, Bot } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  price: number;
  image: string;
  slug?: string;
}

interface Message {
  from: "user" | "bot";
  text?: string;
  books?: Book[];
  timestamp: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatBox: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userKey, setUserKey] = useState<string>(""); // Lưu key từ backend
  const bottomRef = useRef<HTMLDivElement>(null);

  // Lấy userId từ JWT hoặc tạo guest - phiên bản đã sửa lỗi
  const getUserId = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Kiểm tra định dạng JWT
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            console.warn("Token không phải là JWT hợp lệ");
            return "guest";
          }

          // Giải mã payload
          const payload = JSON.parse(atob(tokenParts[1]));

          // Kiểm tra các trường có thể chứa userId
          const userId = payload.id || payload._id || payload.userId || payload.sub;

          if (!userId) {
            console.warn("Không tìm thấy trường id trong payload JWT");
            return "guest";
          }

          // Kiểm tra định dạng của userId
          if (typeof userId !== 'string' || userId.trim() === '') {
            console.warn("UserId không hợp lệ trong payload JWT");
            return "guest";
          }

          return userId;
        } catch (error) {
          console.error("Lỗi khi giải mã JWT token:", error);
          return "guest";
        }
      }
    }
    return "guest";
  };

  const currentUserId = getUserId();

  // Load lịch sử khi mở chat
  useEffect(() => {
    if (!isOpen) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5009/api/gemini/history?userId=${currentUserId}`);
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          const formatted = data.history.map((h: any) => ({
            from: h.role === "user" ? "user" : "bot",
            text: h.content,
            books: h.books,
            timestamp: Date.now(),
          }));
          setMessages(formatted);
          setUserKey(data.userKey || "");
        } else {
          setMessages([
            { from: "bot", text: "Chào bạn! Mình là trợ lý tìm sách\nBạn đang tìm gì hôm nay?", timestamp: Date.now() }
          ]);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử chat:", error);
        setMessages([
          { from: "bot", text: "Chào bạn! Mình là trợ lý tìm sách\nBạn đang tìm gì hôm nay?", timestamp: Date.now() }
        ]);
      }
    };

    loadHistory();
  }, [isOpen, currentUserId]);

  // Cuộn xuống
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: "user", text: userMsg, timestamp: Date.now() }]);
    setInput("");
    setLoading(true);
    setMessages(prev => [...prev, { from: "bot", text: "typing", timestamp: Date.now() }]);

    try {
      const res = await fetch("http://localhost:5009/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: userMsg, userId: currentUserId }),
      });
      const data = await res.json();

      setMessages(prev => prev.filter(m => m.text !== "typing"));

      if (data.success) {
        const { greeting, books, userKey: newKey } = data.data;
        if (newKey) setUserKey(newKey);

        const newMsgs: Message[] = [];
        if (greeting) newMsgs.push({ from: "bot", text: greeting, timestamp: Date.now() });
        if (books?.length) newMsgs.push({ from: "bot", books, timestamp: Date.now() });
        setMessages(prev => [...prev, ...newMsgs]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "Mình đang hơi mệt, thử lại sau nha", timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setMessages(prev => prev.filter(m => m.text !== "typing"));
      setMessages(prev => [...prev, { from: "bot", text: "Mạng hơi chập, bạn thử lại nhé!", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  // Phần render giữ nguyên 100% như cũ (đẹp lung linh)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-20 right-4 z-50 w-[340px] h-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Bot size={22} strokeWidth={2.5} />
            </div>
            <div className="absolute -inset-1 bg-emerald-400/30 rounded-full animate-ping"></div>
          </div>
          <div className="leading-tight">
            <h3 className="font-bold text-sm">Trợ lý AI</h3>
            <p className="text-xs opacity-90">Tìm sách siêu nhanh</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-all duration-200">
          <X size={18} />
        </button>
      </div>

      {/* Tin nhắn */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[80%]">
              {msg.text && msg.text !== "typing" && (
                <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.from === "user" ? "bg-emerald-500 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                  {msg.text}
                </div>
              )}
              {msg.text === "typing" && (
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-2 h-2 bg-emerald-500 rounded-full"
                        animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} />
                    ))}
                  </div>
                </div>
              )}
              {msg.books?.map(book => (
                <a
                  key={book._id}
                  href={`/product/${book._id}`} // Sửa lỗi: luôn dùng _id thay vì slug
                  className="block mt-2 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-book.jpg"; // Ảnh dự phòng nếu không load được
                    }}
                  />
                  <div className="p-2.5">
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2">{book.title}</h4>
                    <p className="text-emerald-600 font-bold text-sm mt-1">{book.price.toLocaleString("vi-VN")}₫</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="Hỏi mình nhé..."
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-emerald-500 disabled:bg-gray-300 text-white p-2.5 rounded-full shadow-md"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatBox;