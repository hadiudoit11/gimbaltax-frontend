"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User } from "lucide-react";
import { GimbalAvatar } from "./gimbal-avatar";
import { SourceCitation } from "./source-citation";
import type { ChatMessage } from "@/hooks/api/use-sales-tax-chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end animate-message-slide">
        <div className="max-w-[75%] chat-bubble-user rounded-[1.25rem] rounded-br-md text-white px-5 py-3.5">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
            {message.content}
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white/50 dark:ring-slate-600/50">
          <User size={17} className="text-slate-600 dark:text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3.5 animate-message-slide">
      <GimbalAvatar size="md" className="flex-shrink-0 mt-0.5" />
      <div className="max-w-[80%] chat-bubble-assistant rounded-[1.25rem] rounded-bl-md px-5 py-4">
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-[15px] prose-p:leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className="mb-3 last:mb-0 text-foreground/90">{children}</p>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-semibold mt-4 mb-2 text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-3 mb-1.5 text-foreground">{children}</h3>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 ml-1 space-y-1.5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 ml-1 space-y-1.5 list-decimal list-inside">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[15px] leading-relaxed text-foreground/85 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="bg-muted/70 px-1.5 py-0.5 rounded-md text-[13px] font-mono text-primary/90">
                  {children}
                </code>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-3 border-primary/30 pl-4 italic text-muted-foreground my-3">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Streaming cursor */}
        {message.isStreaming && (
          <span className="inline-block w-0.5 h-5 bg-primary animate-cursor-pulse ml-0.5 rounded-full" />
        )}

        {/* Source citations */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <SourceCitation sources={message.sources} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;
