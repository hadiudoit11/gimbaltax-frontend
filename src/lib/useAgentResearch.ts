// lib/useAgentResearch.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AgentStreamEvent,
  AgentResearchResult,
  AgentResearchRequest,
} from './agentTypes';

type AgentStatus = 'idle' | 'starting' | 'streaming' | 'completed' | 'error';

export function useAgentResearch() {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [events, setEvents] = useState<AgentStreamEvent[]>([]);
  const [result, setResult] = useState<AgentResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Clean up EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const startResearch = useCallback(
    async (payload: AgentResearchRequest) => {
      setStatus('starting');
      setProgress(0);
      setEvents([]);
      setResult(null);
      setError(null);
      setSessionId(null);

      try {
        // 1. Call our proxy POST /api/backend/agents/research
        console.log('Starting research with payload:', payload);
        const res = await fetch('/api/backend/agents/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log('Research response status:', res.status);

        if (!res.ok) {
          const text = await res.text();
          let errorMessage = `Failed to start research: ${res.status}`;
          
          // Try to parse the error response to show validation errors
          try {
            const errorData = JSON.parse(text);
            if (errorData.pending_configs && Array.isArray(errorData.pending_configs)) {
              // This is a validation error response
              errorMessage += '\n\nValidation Errors:\n';
              errorData.pending_configs.forEach((config: any, index: number) => {
                errorMessage += `\nConfig ${index + 1}:\n`;
                Object.entries(config).forEach(([field, errors]: [string, any]) => {
                  if (Array.isArray(errors)) {
                    errorMessage += `  ${field}: ${errors.join(', ')}\n`;
                  }
                });
              });
            } else {
              errorMessage += `: ${text}`;
            }
          } catch {
            // If not JSON, just append the text
            errorMessage += `: ${text}`;
          }
          
          setStatus('error');
          setError(errorMessage);
          return;
        }

        const data = await res.json(); // AgentSessionResponse
        const newSessionId: string = data.session_id;
        setSessionId(newSessionId);

        // 2. Open SSE stream via our proxy
        const es = new EventSource(
          `/api/backend/agents/stream/${encodeURIComponent(newSessionId)}`
        );
        eventSourceRef.current = es;
        setStatus('streaming');

        es.onmessage = (ev: MessageEvent) => {
          try {
            const parsed: AgentStreamEvent = JSON.parse(ev.data);
            setEvents((prev) => [...prev, parsed]);

            if (typeof parsed.progress === 'number') {
              setProgress(parsed.progress);
            }

            if (parsed.type === 'error') {
              setStatus('error');
              setError(parsed.message || 'Agent error');
              es.close();
            }

            if (parsed.type === 'complete') {
              es.close();
              fetchResults(newSessionId);
            }
          } catch (err: any) {
            console.warn('Failed to parse SSE message', err);
          }
        };

        es.onerror = (ev) => {
          console.error('SSE error', ev);
          setStatus('error');
          setError('Streaming connection error');
          es.close();
        };
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Unknown error');
      }
    },
    []
  );

  const fetchResults = useCallback(async (sid: string | null) => {
    const id = sid ?? sessionId;
    if (!id) return;

    try {
      const res = await fetch(
        `/api/backend/agents/results/${encodeURIComponent(id)}`
      );

      if (!res.ok) {
        setStatus('error');
        setError(`Failed to fetch results: ${res.status}`);
        return;
      }

      const json = (await res.json()) as AgentResearchResult;
      setResult(json);
      setStatus(json.success ? 'completed' : 'error');
      if (!json.success && json.error) {
        setError(json.error);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to fetch results');
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setStatus('idle');
    setSessionId(null);
    setProgress(0);
    setEvents([]);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    sessionId,
    progress,
    events,
    result,
    error,
    startResearch,
    fetchResults,
    reset,
  };
}