"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Bot, Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatState } from "@/lib/chatbot/useChatWidget";

type Props = Pick<
  ChatState,
  | "messages"
  | "input"
  | "isLoading"
  | "quickReplies"
  | "showQuickReplies"
  | "messagesEndRef"
  | "inputRef"
  | "close"
  | "setInput"
  | "sendMessage"
>;

export function ChatPanel({
  messages,
  input,
  isLoading,
  quickReplies,
  showQuickReplies,
  messagesEndRef,
  inputRef,
  close,
  setInput,
  sendMessage,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 26, stiffness: 320 }}
      role="dialog"
      aria-label="Go Kids chat assistant"
      style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        height: 520,
        maxHeight: "calc(100vh - 120px)",
        background: "#FFFFFF",
        borderRadius: 20,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9998,
        border: "1px solid #F3F4F6",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: "#F5C518",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bot size={20} color="#F5C518" />
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "var(--font-nunito, Nunito, sans-serif)",
              fontWeight: 700,
              fontSize: 14,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Go Kids Assistant
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#433600",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#16a34a",
                display: "inline-block",
              }}
            />
            Online — replies instantly
          </p>
        </div>

        <button
          onClick={close}
          aria-label="Close chat"
          style={{
            background: "rgba(0,0,0,0.10)",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <X size={14} color="#1A1A1A" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "#FAFAF8",
        }}
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

        {showQuickReplies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}
          >
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                style={{
                  background: "#FFF8DC",
                  border: "1px solid #F5C518",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 12,
                  color: "#7A5800",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter, Inter, sans-serif)",
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#F5C518")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#FFF8DC")
                }
              >
                {qr}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Contact strip ── */}
      <div
        style={{
          background: "#F9FAFB",
          borderTop: "1px solid #F3F4F6",
          padding: "6px 16px",
          fontSize: 11,
          color: "#6B7280",
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <a
          href="tel:+919876524155"
          style={{ color: "#2BBCB0", textDecoration: "none", fontWeight: 600 }}
        >
          📞 +91-98765-24155
        </a>
        <a
          href="https://wa.me/919876524155"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2BBCB0", textDecoration: "none", fontWeight: 600 }}
        >
          💬 WhatsApp
        </a>
      </div>

      {/* ── Input ── */}
      <div
        style={{
          padding: "10px 12px",
          background: "#FFFFFF",
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about Go Kids..."
          disabled={isLoading}
          aria-label="Chat message input"
          style={{
            flex: 1,
            border: "1px solid #E5E7EB",
            borderRadius: 20,
            padding: "9px 14px",
            fontSize: 13,
            outline: "none",
            fontFamily: "var(--font-inter, Inter, sans-serif)",
            color: "#1A1A1A",
            background: "#F9FAFB",
            transition: "border 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#F5C518")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
        />

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: input.trim() && !isLoading ? "#F5C518" : "#F3F4F6",
            border: "none",
            cursor: input.trim() && !isLoading ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <Send
            size={15}
            color={input.trim() && !isLoading ? "#1A1A1A" : "#9CA3AF"}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
