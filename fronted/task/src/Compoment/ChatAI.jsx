import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import axios from "axios";

const STORAGE_KEY = "taskhub_chat_history";
const API_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/chat`
  : "http://localhost:3000/api/chat";

function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowLabel(false);
      return;
    }

    const showTimer = setTimeout(() => setShowLabel(true), 3000);
    const hideTimer = setTimeout(() => setShowLabel(false), 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const geminiHistory = updatedMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text || "" }],
      }));

      const res = await axios.post(API_URL, {
        message: trimmed,
        history: geminiHistory,
      });

      const aiReply = res.data?.reply || "Sorry, kuch masla ho gaya. Dobara try karein.";
      setMessages((prev) => [...prev, { role: "model", text: aiReply }]);
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message || "Sorry, kuch masla ho gaya. Dobara try karein.";
      setMessages((prev) => [...prev, { role: "model", text: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const labelVisible = showLabel || isHovering;

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3 w-[92vw] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-sm font-semibold">Ask AI</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearChat}
                  className="text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50"
            >
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <p className="text-sm text-slate-400">
                    Assalam-o-Alaikum! 👋 Kuch bhi pooch sakte ho.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-br-sm"
                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-200 bg-white flex-shrink-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Apna sawal likhein..."
                rows={1}
                className="flex-1 resize-none text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 max-h-24"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence>
          {!isOpen && labelVisible && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-slate-900 text-white text-sm font-medium px-3.5 py-2 rounded-full shadow-lg whitespace-nowrap"
            >
              Ask AI 👋
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full bg-slate-900 shadow-xl flex items-center justify-center flex-shrink-0"
        >
          {!isOpen && (
            <motion.span
              className="absolute inset-0 rounded-full bg-blue-500"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 5.94 2 10.8C2 13.44 3.36 15.8 5.5 17.36V22L9.72 19.6C10.44 19.73 11.2 19.8 12 19.8C17.52 19.8 22 15.86 22 10.8C22 5.94 17.52 2 12 2Z"
                    fill="white"
                  />
                  <circle cx="8.5" cy="10.8" r="1.2" fill="#0f172a" />
                  <circle cx="12" cy="10.8" r="1.2" fill="#0f172a" />
                  <circle cx="15.5" cy="10.8" r="1.2" fill="#0f172a" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

export default ChatAI;
