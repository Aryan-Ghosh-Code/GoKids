"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { detectAdSource, QUICK_REPLIES } from "./detectTopic";
import type { AdSource } from "./systemPrompts";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type ChatState = {
  isOpen: boolean;
  messages: Message[];
  input: string;
  isLoading: boolean;
  hasUnread: boolean;
  adSource: AdSource;
  quickReplies: string[];
  showQuickReplies: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setInput: (v: string) => void;
  sendMessage: (text: string) => Promise<void>;
};

const GREETING: Message = {
  role: "assistant",
  content: "Hi! 👋 I'm the Go Kids assistant. How can I help your child today?",
  timestamp: new Date(),
};

export function useChatWidget(): ChatState {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [adSource, setAdSource] = useState<AdSource>("general");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Ref mirror of messages so sendMessage doesn't need it as a dep ──────
  const messagesRef = useRef<Message[]>([GREETING]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ── Ref mirror of isOpen so sendMessage reads latest value ───────────────
  const isOpenRef = useRef(false);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input on open (setHasUnread moved to open() — avoids setState-in-effect) ──
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 280);
    return () => clearTimeout(t);
  }, [isOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false); // clear badge synchronously when user opens
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // ── sendMessage — stable reference, reads state via refs ─────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      // Read current messages from ref — not from closure
      const currentMessages = [...messagesRef.current, userMsg];
      setMessages(currentMessages);
      setInput("");
      setIsLoading(true);

      // Detect topic; keep existing if still general
      const detected = detectAdSource(trimmed);
      setAdSource((prev) => {
        const next = detected !== "general" ? detected : prev;
        return next;
      });

      // Build API payload — strip the greeting from history
      const apiMessages = currentMessages
        .filter((m) => m.content !== GREETING.content)
        .map((m) => ({ role: m.role, content: m.content }));

      // Read latest adSource (state update above may not have flushed yet)
      const currentSource = detected !== "general" ? detected : adSource;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            adSource: currentSource,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const reply: string =
          data?.content?.[0]?.text ??
          "Sorry, something went wrong. Please call us at +91-9876524155!";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, timestamp: new Date() },
        ]);

        // Show unread dot only if widget is closed
        if (!isOpenRef.current) setHasUnread(true);
      } catch (err) {
        console.error("[useChatWidget] sendMessage error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Oops! Something went wrong. Reach us at +91-9876524155 😊",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, adSource],
  ); // messages intentionally excluded — read via ref

  const showQuickReplies = messages.length <= 2 && !isLoading;
  const quickReplies = QUICK_REPLIES[adSource];

  return {
    isOpen,
    messages,
    input,
    isLoading,
    hasUnread,
    adSource,
    quickReplies,
    showQuickReplies,
    messagesEndRef,
    inputRef,
    open,
    close,
    toggle,
    setInput,
    sendMessage,
  };
}
