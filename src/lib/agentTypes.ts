// lib/agentTypes.ts

export interface AgentStreamEvent {
  id?: string;
  type: 'status' | 'progress' | 'agent_start' | 'agent_complete' | 'search' | 'generation' | 'validation' | 'error' | 'complete';
  timestamp: string;
  message: string;
  agent: string;
  progress?: number;
  data?: Record<string, any>;
}

export interface AgentSessionResponse {
  session_id: string;
  status: 'running' | 'completed' | 'failed';
  query: string;
  stream_url: string;
  started_at: string;
}

export interface TaxPayload {
  tax_id: string;
  name: string;
  category: string;
  authority?: string;
  description?: string;
  rate?: number;
  wage_base?: number;
  jurisdiction: {
    id: string;
    name: string;
    code: string;
  };
}

export interface PendingTaxConfig {
  id: string;
  tax_id: string;
  name: string;
  category: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  validation_status: 'valid' | 'warning' | 'error';
  validation_messages?: string[];
  created_at: string;
  jurisdiction: {
    id: string;
    name: string;
    code: string;
  };
  tax_payload?: TaxPayload;
}

export interface AgentResearchResult {
  session_id: string;
  status: 'completed' | 'failed';
  success: boolean;
  agent_category: string;
  query: string;
  started_at: string;
  completed_at: string;
  error?: string;
  taxes_found: number;
  taxes_converted: number;
  converted_taxes: TaxPayload[];
  pending_configs: PendingTaxConfig[];
  validation_summary?: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  };
}

export interface AgentResearchRequest {
  query: string;
  effective_date?: string;
  auto_approve?: boolean;
  jurisdiction_id?: string;
}