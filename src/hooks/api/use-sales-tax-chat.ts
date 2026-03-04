import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiRequest';
import { getBackendUrl } from '@/lib/backendUrl';

// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Source[];
  isStreaming?: boolean;
  toolsUsed?: string[];
}

export interface Source {
  url: string;
  title: string;
  snippet?: string;
}

export interface StateInfo {
  code: string;
  name: string;
  document_count: number;
  has_sales_tax: boolean;
}

export interface StatesResponse {
  total_documents: number;
  states_researched: number;
  states: StateInfo[];
  states_not_researched: { code: string; name: string }[];
}

export interface AgentStatus {
  status: string;
  vector_store: {
    type: string;
    document_count: number;
  };
  agent: {
    llm_provider: string;
    vector_store_type: string;
    available_providers: string[];
    conversation_length: number;
  };
}

// Playful loading messages
const THINKING_MESSAGES = [
  "Digging through the tax code... the fun part of my job!",
  "Checking the fine print so you don't have to...",
  "Consulting my 51-state brain...",
  "Almost there — tax law is a maze but I know shortcuts!",
  "Searching the knowledge base...",
];

// Hook to fetch researched states
export const useLangchainStates = () => {
  return useQuery<StatesResponse>({
    queryKey: ['langchain-states'],
    queryFn: async () => {
      const response = await apiGet('api/v1/langchain/states/');
      return response as StatesResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to fetch agent status
export const useLangchainStatus = () => {
  return useQuery<AgentStatus>({
    queryKey: ['langchain-status'],
    queryFn: async () => {
      const response = await apiGet('api/v1/langchain/status/');
      return response as AgentStatus;
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
};

// Main chat hook with SSE streaming
export const useSalesTaxChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate unique ID
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get random thinking message
  const getRandomThinkingMessage = () => {
    return THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)];
  };

  // Send message with SSE streaming
  const sendMessage = useCallback(async (query: string, stateCode?: string) => {
    if (!query.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    setThinkingMessage(getRandomThinkingMessage());

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Create placeholder for assistant message
    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, assistantMessage]);

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const backendUrl = getBackendUrl();
      const streamUrl = `${backendUrl}/api/v1/langchain/chat/stream/`;

      // Use fetch with POST for SSE (EventSource only supports GET)
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          query: query.trim(),
          state_code: stateCode || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let sources: Source[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));

              switch (eventData.type) {
                case 'thinking':
                  setThinkingMessage(eventData.message);
                  break;

                case 'token':
                  fullContent += eventData.content;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                  setThinkingMessage(null);
                  break;

                case 'sources':
                  sources = eventData.sources || [];
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, sources }
                        : msg
                    )
                  );
                  break;

                case 'complete':
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: eventData.full_response || fullContent,
                            isStreaming: false,
                            sources,
                          }
                        : msg
                    )
                  );
                  break;

                case 'error':
                  setError(eventData.message);
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: eventData.message,
                            isStreaming: false,
                          }
                        : msg
                    )
                  );
                  break;
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', parseError);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.debug('Request aborted');
        return;
      }

      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      // Update assistant message with error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `Oops! Even tax experts need a coffee break sometimes. Error: ${errorMessage}`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setThinkingMessage(null);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  // Clear conversation history
  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setThinkingMessage(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setThinkingMessage(null);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    thinkingMessage,
    error,
    sendMessage,
    clearHistory,
    cancelRequest,
  };
};

export default useSalesTaxChat;
