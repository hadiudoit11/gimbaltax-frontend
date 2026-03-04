"use client";

import { GimbalAvatar } from "./gimbal-avatar";

interface TypingIndicatorProps {
  message?: string;
}

export function TypingIndicator({ message }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3.5 animate-message-slide">
      <GimbalAvatar size="md" className="mt-0.5" />
      <div className="flex flex-col gap-2">
        <div className="chat-bubble-assistant rounded-[1.25rem] rounded-bl-md px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot w-2 h-2 rounded-full animate-typing-wave" style={{ animationDelay: "0ms" }} />
            <span className="typing-dot w-2 h-2 rounded-full animate-typing-wave" style={{ animationDelay: "150ms" }} />
            <span className="typing-dot w-2 h-2 rounded-full animate-typing-wave" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
        {message && (
          <span className="text-xs text-muted-foreground ml-1 font-medium">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

export default TypingIndicator;
