import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiRequest';
import { getBackendUrl } from '@/lib/backendUrl';

// TypeScript interfaces for agent research
export interface AgentStreamEvent {
  id: string;
  type: 'status' | 'agent_start' | 'search' | 'generation' | 'validation' | 'complete' | 'error';
  timestamp: string;
  message: string;
  agent: string;
  progress?: number;
  data?: any;
}

export interface AgentResearchRequest {
  query: string;
  jurisdiction_id?: string;
  research_type?: string;
}

export interface AgentResearchSession {
  id: string;
  query: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  results_count?: number;
  error_message?: string;
  progress?: number;
}

export interface TaxConfigurationResult {
  id: string;
  name: string;
  code: string;
  tax_category: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  validation_status: 'valid' | 'warning' | 'error';
  validation_errors: string[];
  rate?: number;
  wage_base?: number;
  description?: string;
}

// Query Keys
export const agentResearchKeys = {
  all: ['agentResearch'] as const,
  sessions: () => [...agentResearchKeys.all, 'sessions'] as const,
  session: (id: string) => [...agentResearchKeys.sessions(), id] as const,
  results: (sessionId: string) => [...agentResearchKeys.all, 'results', sessionId] as const,
  stream: (sessionId: string) => [...agentResearchKeys.all, 'stream', sessionId] as const,
};

// Hooks
export const useAgentSessions = () => {
  return useQuery({
    queryKey: agentResearchKeys.sessions(),
    queryFn: async () => {
      return await apiGet('api/v1/agents/sessions/');
    },
    refetchInterval: (query) => {
      // Poll every 2 seconds if there's a running session
      const data = query.state.data as any;
      const results = data?.results || [];
      const hasRunningSession = Array.isArray(results) && results.some((s: any) => s.status === 'running');
      return hasRunningSession ? 2000 : false;
    },
  });
};

export const useAgentSession = (sessionId: string) => {
  return useQuery({
    queryKey: agentResearchKeys.session(sessionId),
    queryFn: async () => {
      // Backend exposes a sessions list at `agents/sessions/` (no detail endpoint).
      // Fetch the list and return the matching session if present to stay compatible
      // with backend URL patterns.
      const list = await apiGet('api/v1/agents/sessions/');
      const paginated = (list && (list as { results?: AgentResearchSession[] })) || { results: [] };
      const results = Array.isArray(paginated.results) ? paginated.results : [];
  return results.find((s: AgentResearchSession) => s.id === sessionId) || null;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if session is running
      const data = query.state.data as AgentResearchSession | null;
      return data?.status === 'running' ? 2000 : false;
    },
  });
};

export const useAgentResults = (sessionId: string) => {
  return useQuery({
    queryKey: agentResearchKeys.results(sessionId),
    queryFn: async () => {
      // Use Next.js API route proxy
      const response = await fetch(`/api/backend/agents/results/${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`);
      }
      return await response.json();
    },
    enabled: !!sessionId,
  });
};

export const useStartAgentResearch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AgentResearchRequest) => {
      console.debug('[useStartAgentResearch] mutationFn called', { data });
      
      // Use Next.js API route proxy instead of direct backend call
      const response = await fetch('/api/backend/agents/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Research request failed: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Research request failed: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    },
    onSuccess: (response) => {
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: agentResearchKeys.sessions() });
      // Invalidate the specific session if we have an ID
      if (response?.session_id) {
        queryClient.invalidateQueries({ queryKey: agentResearchKeys.session(response.session_id) });
      }
    },
  });
};

// Hook for real-time streaming
export const useAgentStream = (sessionId: string | null) => {
  const [events, setEvents] = useState<AgentStreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsConnected(false);
      setEvents([]);
      return;
    }

    let abortController: AbortController | null = null;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    const connectStream = async () => {
      try {
        abortController = new AbortController();
        
        // Use Next.js API route proxy for streaming
        const streamUrl = `/api/backend/agents/stream/${sessionId}`;
        
        console.log('Connecting to agent stream via proxy:', streamUrl);
        
        // Create headers
        const headers: HeadersInit = {
          'Accept': 'text/event-stream',
        };

        // Fetch the SSE stream through Next.js proxy
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        setIsConnected(true);
        setError(null);
        console.log('Agent stream connected for session:', sessionId);

        // Read the stream
        reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            setIsConnected(false);
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix
                console.log('Agent stream event received:', data);
                setEvents(prev => [...prev, data]);
              } catch (err) {
                console.error('Failed to parse SSE data:', err, line);
              }
            } else if (line.trim() && !line.startsWith('event:') && !line.startsWith('id:')) {
              // Log non-data lines for debugging
              console.debug('SSE line (not data):', line);
            }
          }
        }
      } catch (err: unknown) {
        const maybe = err as { name?: string; message?: string };
        if (maybe.name === 'AbortError') {
          // Expected when component unmounts or sessionId changes
          return;
        }
        console.error('Stream error:', err);
        setIsConnected(false);
        setError(maybe.message || 'Connection to agent stream failed');
      }
    };

    connectStream();

    return () => {
      if (abortController) {
        abortController.abort();
      }
      if (reader) {
        reader.cancel();
      }
      setIsConnected(false);
    };
  }, [sessionId]);

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    isConnected,
    error,
    clearEvents,
  };
};

export const useApproveConfigurations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ configIds }: { configIds: string[] }) => {
      console.debug('[useApproveConfigurations] mutationFn called', { configIds });
      return await apiPost('api/v1/agents/approve-batch/', { config_ids: configIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentResearchKeys.all });
    },
  });
};

export const useRejectConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ configId, reason }: { configId: string; reason: string }) => {
      console.debug('[useRejectConfiguration] mutationFn called', { configId, reason });
      return await apiPost(`api/v1/agents/reject/${configId}/`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentResearchKeys.all });
    },
  });
};