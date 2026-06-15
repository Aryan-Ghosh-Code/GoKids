"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "flex-start" }}
    >
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #F3F4F6",
          borderRadius: "16px 16px 16px 4px",
          padding: "10px 14px",
          display: "flex",
          gap: 4,
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#F5C518",
              display: "block",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
