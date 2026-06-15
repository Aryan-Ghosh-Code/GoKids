"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  hasUnread: boolean;
  toggle: () => void;
};

export function FloatingButton({ isOpen, hasUnread, toggle }: Props) {
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isOpen ? "Close chat" : "Open Go Kids chat assistant"}
      aria-expanded={isOpen}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "#F5C518",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 4px 20px rgba(245, 197, 24, 0.50), 0 2px 8px rgba(0,0,0,0.12)",
        zIndex: 9999,
        outline: "none",
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <X size={24} color="#1A1A1A" />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.14 }}
          >
            <MessageCircle size={24} color="#1A1A1A" />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasUnread && !isOpen && (
          <motion.span
            key="dot"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#F4845F",
              border: "2px solid #fff",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
