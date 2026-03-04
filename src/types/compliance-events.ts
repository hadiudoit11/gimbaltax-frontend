export interface ComplianceEvent {
  id: number;
  title: string;
  description: string;
  event_type: 'tax_filing' | 'payment_due' | 'registration' | 'renewal' | 'audit' | 'rate_change' | 'law_change' | 'deadline' | 'report' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  jurisdiction: {
    id: number;
    code: string;
    name: string;
  };
  jurisdiction_id?: number;
  due_date: string; // ISO datetime
  reminder_date?: string; // ISO datetime
  status: 'draft' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  source: 'manual' | 'ai_generated' | 'imported';
  ai_session_id?: string;
  ai_research_query?: string;
  event_data?: Record<string, any>;
  related_tax_configs?: Array<any>;
  created_by_name?: string;
  updated_by_name?: string;
  approved_by_name?: string;
  approved_at?: string;
  rejection_reason?: string;
  days_until_due: number;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface PendingComplianceEvent {
  id: number;
  title: string;
  description: string;
  event_type: ComplianceEvent['event_type'];
  priority: ComplianceEvent['priority'];
  jurisdiction: ComplianceEvent['jurisdiction'];
  due_date: string;
  source: ComplianceEvent['source'];
  ai_session_id?: string;
  created_by_name?: string;
  created_at: string;
  days_until_due: number;
  is_overdue: boolean;
}

export interface ComplianceEventCreate {
  title: string;
  description: string;
  event_type: ComplianceEvent['event_type'];
  priority: ComplianceEvent['priority'];
  jurisdiction_id: number;
  due_date: string;
  reminder_date?: string;
  event_data?: Record<string, any>;
  related_tax_config_ids?: number[];
  notes?: string;
}

export interface ComplianceEventUpdate {
  title?: string;
  description?: string;
  event_type?: ComplianceEvent['event_type'];
  priority?: ComplianceEvent['priority'];
  due_date?: string;
  reminder_date?: string;
  event_data?: Record<string, any>;
  related_tax_config_ids?: number[];
  notes?: string;
}

export interface EventResearchRequest {
  query: string;
  jurisdiction_code?: string;
  event_type?: ComplianceEvent['event_type'];
  date_range_start?: string; // YYYY-MM-DD
  date_range_end?: string; // YYYY-MM-DD
}

export interface EventResearchSession {
  session_id: string;
  status: 'running' | 'completed' | 'failed';
  query: string;
  started_at: string;
}

export interface EventResearchResult {
  session_id: string;
  query: string;
  success: boolean;
  events_found: number;
  events_converted: number;
  converted_events: Array<Record<string, any>>;
  validation_errors: string[];
  pending_events: PendingComplianceEvent[];
  raw_agent_response?: Record<string, any>;
  started_at: string;
  completed_at?: string;
}

export interface EventApprovalRequest {
  effective_date?: string;
  notes?: string;
}

export interface EventRejectionRequest {
  reason: string;
}

export interface BulkEventApprovalRequest {
  event_ids: number[];
  notes?: string;
}

export interface BulkEventApprovalResponse {
  approved_count: number;
  error_count: number;
  approved_events: Array<{
    id: number;
    title: string;
    status: string;
  }>;
  errors: Array<{
    event_id: number;
    error: string;
  }>;
}

export interface PaginatedComplianceEvents {
  results: ComplianceEvent[];
  count: number;
  next?: string;
  previous?: string;
}

export interface PaginatedPendingComplianceEvents {
  results: PendingComplianceEvent[];
  count: number;
  next?: string;
  previous?: string;
}

export interface ComplianceEventsFilters {
  event_type?: string;
  priority?: string;
  status?: string;
  jurisdiction?: number;
  source?: string;
  search?: string;
  page?: number;
  page_size?: number;
}