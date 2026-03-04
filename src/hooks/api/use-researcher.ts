import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiRequest';

// TypeScript interfaces for researcher endpoints
export interface ResearchRequest {
  query: string;
  model_name?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo';
  temperature?: number;
}

export interface TaxInfo {
  name: string;
  authority: string;
  rate: string;
  wage_base: string;
  form_number: string;
  filing_frequency: string;
  collected_from: string;
}

export interface ResearchResponse {
  success: boolean;
  query: string;
  agent_category?: string;
  taxes_found?: number;
  output_parsed?: {
    taxes?: TaxInfo[];
  };
  agent_type: string;
  session_id?: string;
  timestamp?: string;
  error?: string;
  test_result?: any;
}

export interface ComplianceRequest {
  jurisdiction: string;
  focus_areas?: string[];
  business_type?: string;
  model_name?: string;
  temperature?: number;
}

export interface ComplianceObligation {
  obligation_id: string;
  title: string;
  description: string;
  tax_type: string;
  frequency: string;
  risk_level: string;
  due_dates: string[];
  forms_required: string[];
  penalties: string;
  responsible_party: string;
  estimated_cost: string;
  automation_potential: string;
}

export interface JurisdictionOverview {
  jurisdiction_name: string;
  jurisdiction_type: string;
  business_friendliness: string;
  compliance_complexity: string;
  key_agencies: string[];
  registration_requirements: string[];
}

export interface ComplianceCalendar {
  quarter_1: string[];
  quarter_2: string[];
  quarter_3: string[];
  quarter_4: string[];
  annual_deadlines: string[];
}

export interface ComplianceAnalysis {
  jurisdiction_overview?: JurisdictionOverview;
  compliance_obligations?: ComplianceObligation[];
  compliance_calendar?: ComplianceCalendar;
  total_obligations?: number;
  critical_obligations?: number;
  estimated_annual_cost?: string;
  automation_score?: string;
  key_risks?: string[];
  recommendations?: string[];
  last_updated?: string;
}

export interface ComplianceResponse {
  success: boolean;
  jurisdiction: string;
  business_type?: string;
  focus_areas?: string[];
  analysis?: ComplianceAnalysis;
  agent_type?: string;
  session_id?: string;
  timestamp?: string;
  error?: string;
}

export interface VectorSearchRequest {
  query: string;
  jurisdiction?: string;
  top_k?: number;
}

export interface VectorSearchResult {
  source: string;
  content: string;
  jurisdiction: string;
  document_type: string;
  relevance_score: number;
}

export interface VectorSearchResponse {
  success: boolean;
  query: string;
  jurisdiction?: string;
  results_count: number;
  results: VectorSearchResult[];
  error?: string;
}

export interface SystemStatus {
  available: boolean;
  is_ready?: boolean;
  service_type?: string;
  agent_initialized?: boolean;
  agent_executor_ready?: boolean;
  model_name?: string;
  temperature?: number;
}

// Query Keys
export const researcherKeys = {
  all: ['researcher'] as const,
  langchainStatus: () => [...researcherKeys.all, 'langchain', 'status'] as const,
  complianceStatus: () => [...researcherKeys.all, 'compliance', 'status'] as const,
  vectorStoreStatus: () => [...researcherKeys.all, 'vectorStore', 'status'] as const,
};

// Status Hooks
export const useLangchainStatus = () => {
  return useQuery({
    queryKey: researcherKeys.langchainStatus(),
    queryFn: async () => {
      try {
        const response = await apiGet('api/v1/researcher/langchain/test/', { 
          params: { query: 'test' } 
        });
        return {
          available: !!response?.test_result?.success,
          agent_initialized: true,
          agent_executor_ready: true,
        } as SystemStatus;
      } catch (error) {
        return {
          available: false,
          agent_initialized: false,
          agent_executor_ready: false,
        } as SystemStatus;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useComplianceStatus = () => {
  return useQuery({
    queryKey: researcherKeys.complianceStatus(),
    queryFn: async () => {
      try {
        const response = await apiGet('api/v1/researcher/compliance/status/');
        return response as SystemStatus;
      } catch (error) {
        return {
          available: false,
          agent_initialized: false,
          agent_executor_ready: false,
        } as SystemStatus;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useVectorStoreStatus = () => {
  return useQuery({
    queryKey: researcherKeys.vectorStoreStatus(),
    queryFn: async () => {
      try {
        const response = await apiGet('api/v1/researcher/vector-store/status/');
        return response as SystemStatus;
      } catch (error) {
        return {
          available: false,
          is_ready: false,
        } as SystemStatus;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Enhanced Research Types
export interface ResearchSession {
  id: string;
  query: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  results_count?: number;
  error_message?: string;
  progress?: number;
}

export interface StreamEvent {
  id: string;
  type: 'status' | 'agent_start' | 'search' | 'generation' | 'validation' | 'complete' | 'error';
  timestamp: string;
  message: string;
  agent: string;
  progress?: number;
  data?: any;
}

export interface TaxConfiguration {
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

export interface ResearchResults {
  session_id: string;
  query: string;
  ai_response: string;
  pending_configurations: TaxConfiguration[];
  research_summary: string;
  created_at: string;
  metadata: {
    model_used: string;
    total_tokens: number;
    processing_time: number;
    sources_count: number;
  };
}

// Research Hooks
export const useCreateResearchSession = () => {
  return useMutation({
    mutationFn: async (data: ResearchRequest): Promise<ResearchSession> => {
      console.debug('[useCreateResearchSession] Starting research session', { data });
      
      const response = await apiPost('api/v1/agents/research/', {
        query: data.query,
        model_name: data.model_name || 'gpt-4o',
        temperature: data.temperature || 0.1,
      });
      
      return response as ResearchSession;
    },
  });
};

export const useResearchResults = (sessionId: string) => {
  return useQuery({
    queryKey: ['research-results', sessionId],
    queryFn: async (): Promise<ResearchResults> => {
      console.debug('[useResearchResults] Fetching results for session', { sessionId });
      
      const response = await apiGet(`api/v1/agents/results/${sessionId}/`);
      return response as ResearchResults;
    },
    enabled: !!sessionId,
    retry: false,
  });
};

export const useResearchStream = (sessionId: string, onEvent?: (event: StreamEvent) => void) => {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let eventSource: EventSource;
    let fallbackInterval: NodeJS.Timeout;

    const startSSE = () => {
      try {
        eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/agents/stream/${sessionId}/`);
        
        eventSource.onopen = () => {
          console.debug('[useResearchStream] SSE connection opened');
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          try {
            const streamEvent: StreamEvent = JSON.parse(event.data);
            console.debug('[useResearchStream] Received event', streamEvent);
            
            setEvents(prev => [...prev, streamEvent]);
            onEvent?.(streamEvent);
          } catch (err) {
            console.error('[useResearchStream] Failed to parse event', err);
          }
        };

        eventSource.onerror = (err) => {
          console.error('[useResearchStream] SSE error', err);
          setIsConnected(false);
          setError('Connection error - falling back to polling');
          eventSource.close();
          startPolling();
        };
      } catch (err) {
        console.error('[useResearchStream] Failed to start SSE', err);
        setError('SSE not supported - using polling');
        startPolling();
      }
    };

    const startPolling = () => {
      console.debug('[useResearchStream] Starting polling fallback');
      let lastEventId = '';
      
      fallbackInterval = setInterval(async () => {
        try {
          const response = await apiGet(`api/v1/agents/stream/${sessionId}/`, {
            params: { since: lastEventId }
          });
          
          if (response.events && Array.isArray(response.events)) {
            response.events.forEach((event: StreamEvent) => {
              setEvents(prev => [...prev, event]);
              onEvent?.(event);
              lastEventId = event.id;
            });
          }
        } catch (err) {
          console.error('[useResearchStream] Polling error', err);
        }
      }, 2000);
    };

    // Start with SSE, fallback to polling if needed
    startSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, [sessionId]);

  const clearEvents = () => setEvents([]);

  return {
    events,
    isConnected,
    error,
    clearEvents,
  };
};

// Research approval hooks
export const useApproveConfiguration = () => {
  return useMutation({
    mutationFn: async ({ configId }: { configId: string }): Promise<any> => {
      console.debug('[useApproveConfiguration] Approving config', { configId });
      
      const response = await apiPost(`api/v1/agents/approve/${configId}/`, {});
      return response;
    },
  });
};

export const useRejectConfiguration = () => {
  return useMutation({
    mutationFn: async ({ configId, reason }: { configId: string; reason: string }): Promise<any> => {
      console.debug('[useRejectConfiguration] Rejecting config', { configId, reason });
      
      const response = await apiPost(`api/v1/agents/reject/${configId}/`, { reason });
      return response;
    },
  });
};

export const useBulkApproveConfigurations = () => {
  return useMutation({
    mutationFn: async ({ configIds }: { configIds: string[] }): Promise<any> => {
      console.debug('[useBulkApproveConfigurations] Bulk approving configs', { configIds });
      
      const response = await apiPost('api/v1/agents/approve-batch/', { config_ids: configIds });
      return response;
    },
  });
};

// Legacy hook for backwards compatibility
export const useLangchainResearch = () => {
  return useMutation({
    mutationFn: async (data: ResearchRequest): Promise<ResearchResponse> => {
      console.debug('[useLangchainResearch] mutationFn called', { data });
      
      const response = await apiPost('api/v1/researcher/langchain/research/', {
        query: data.query,
        model_name: data.model_name || 'gpt-4o',
        temperature: data.temperature || 0.1,
      });
      
      return response as ResearchResponse;
    },
  });
};

export const useComplianceAnalysis = () => {
  return useMutation({
    mutationFn: async (data: ComplianceRequest): Promise<ComplianceResponse> => {
      console.debug('[useComplianceAnalysis] mutationFn called', { data });
      
      const response = await apiPost('api/v1/researcher/compliance/analyze/', {
        jurisdiction: data.jurisdiction,
        focus_areas: data.focus_areas || ['payroll'],
        business_type: data.business_type || 'small business',
        model_name: data.model_name || 'gpt-4o',
        temperature: data.temperature || 0.1,
      });
      
      return response as ComplianceResponse;
    },
  });
};

export const useVectorSearch = () => {
  return useMutation({
    mutationFn: async (data: VectorSearchRequest): Promise<VectorSearchResponse> => {
      console.debug('[useVectorSearch] mutationFn called', { data });
      
      const response = await apiPost('api/v1/researcher/vector-store/search/', {
        query: data.query,
        jurisdiction: data.jurisdiction,
        top_k: data.top_k || 5,
      });
      
      return response as VectorSearchResponse;
    },
  });
};

// Test Hook for LangChain
export const useLangchainTest = () => {
  return useMutation({
    mutationFn: async (query: string = 'test'): Promise<ResearchResponse> => {
      console.debug('[useLangchainTest] mutationFn called', { query });
      
      const response = await apiGet('api/v1/researcher/langchain/test/', { 
        params: { query } 
      });
      
      return response as ResearchResponse;
    },
  });
};