"use client";

import { motion } from "framer-motion";
import type { Message } from "@/lib/chatbot/useChatWidget";

function formatText(text: string) {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/\*([^*]+)\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
        )}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 3,
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          padding: "9px 13px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isUser ? "#F5C518" : "#FFFFFF",
          color: "#1A1A1A",
          fontSize: 13,
          lineHeight: 1.55,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          border: isUser ? "none" : "1px solid #F3F4F6",
          fontFamily: "var(--font-inter, Inter, sans-serif)",
          wordBreak: "break-word",
        }}
      >
        {formatText(message.content)}
      </div>
      <span style={{ fontSize: 10, color: "#9CA3AF" }}>
        {message.timestamp.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </motion.div>
  );
}
