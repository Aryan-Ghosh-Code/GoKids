"use client";

import { AnimatePresence } from "framer-motion";
import { useChatWidget } from "@/lib/chatbot/useChatWidget";
import { ChatPanel } from "./ChatPanel";
import { FloatingButton } from "./FloatingButton";

export default function GoKidsChatWidget() {
  const chat = useChatWidget();

  return (
    <>
      <AnimatePresence>
        {chat.isOpen && (
          <ChatPanel
            messages={chat.messages}
            input={chat.input}
            isLoading={chat.isLoading}
            quickReplies={chat.quickReplies}
            showQuickReplies={chat.showQuickReplies}
            messagesEndRef={chat.messagesEndRef}
            inputRef={chat.inputRef}
            close={chat.close}
            setInput={chat.setInput}
            sendMessage={chat.sendMessage}
          />
        )}
      </AnimatePresence>

      <FloatingButton
        isOpen={chat.isOpen}
        hasUnread={chat.hasUnread}
        toggle={chat.toggle}
      />
    </>
  );
}
