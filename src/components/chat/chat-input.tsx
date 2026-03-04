"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onCancel,
  disabled = false,
  isLoading = false,
  placeholder = "Ask about sales tax...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled && !isLoading) {
      onSend(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="chat-input-wrapper p-4 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div
          className={`
            relative flex items-end gap-3 p-2 pr-2 pl-4
            rounded-[1.5rem] transition-all duration-200
            chat-input
            ${isFocused ? 'ring-2 ring-primary/20 border-primary/40' : ''}
          `}
        >
          {/* Sparkle icon */}
          <div className="flex-shrink-0 pb-2.5">
            <Sparkles
              size={18}
              className={`transition-colors duration-200 ${
                isFocused ? 'text-primary' : 'text-muted-foreground/50'
              }`}
            />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="
              flex-1 bg-transparent resize-none outline-none
              text-[15px] leading-relaxed placeholder:text-muted-foreground/60
              min-h-[28px] max-h-[160px] py-2
              disabled:opacity-50
            "
            rows={1}
          />

          {/* Send/Stop button */}
          {isLoading ? (
            <Button
              onClick={onCancel}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl flex-shrink-0 border-2"
              title="Stop generating"
            >
              <Square size={16} className="fill-current" />
            </Button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!hasValue || disabled}
              className={`
                h-10 w-10 rounded-xl flex-shrink-0
                flex items-center justify-center
                transition-all duration-200
                ${hasValue && !disabled
                  ? 'chat-send-btn text-white'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
              title="Send message"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-center gap-4 mt-2.5 text-[11px] text-muted-foreground/70">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-muted/80 rounded text-[10px] font-medium">↵</kbd>
            <span>send</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-muted/80 rounded text-[10px] font-medium">⇧↵</kbd>
            <span>new line</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
