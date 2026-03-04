"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage } from "@/hooks/api/use-sales-tax-chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  thinkingMessage?: string | null;
}

export function MessageList({ messages, isLoading, thinkingMessage }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto chat-scroll px-5 py-6 space-y-5"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Show typing indicator when loading and no streaming content yet */}
      {isLoading && messages[messages.length - 1]?.role === "assistant" &&
       messages[messages.length - 1]?.content === "" && (
        <TypingIndicator message={thinkingMessage || undefined} />
      )}

      {/* Invisible element for auto-scrolling */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

export default MessageList;
