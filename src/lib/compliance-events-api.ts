import { backendFetch } from './backendClient';
import type {
  ComplianceEvent,
  PendingComplianceEvent,
  ComplianceEventCreate,
  ComplianceEventUpdate,
  EventResearchRequest,
  EventResearchSession,
  EventResearchResult,
  EventApprovalRequest,
  EventRejectionRequest,
  BulkEventApprovalRequest,
  BulkEventApprovalResponse,
  PaginatedComplianceEvents,
  PaginatedPendingComplianceEvents,
  ComplianceEventsFilters,
} from '@/types/compliance-events';

class ComplianceEventError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ComplianceEventError';
  }
}

// Core Event Operations
export async function fetchComplianceEvents(filters: ComplianceEventsFilters = {}): Promise<PaginatedComplianceEvents> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await backendFetch(`/compliance-events/?${params}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
  
  return await response.json();
}

export async function fetchComplianceEvent(id: number): Promise<ComplianceEvent> {
  const response = await backendFetch(`/compliance-events/${id}/`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || `Event not found`,
      response.status
    );
  }
  
  return await response.json();
}

export async function createComplianceEvent(eventData: ComplianceEventCreate): Promise<ComplianceEvent> {
  const response = await backendFetch('/compliance-events/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to create event',
      response.status
    );
  }
  
  return await response.json();
}

export async function updateComplianceEvent(id: number, eventData: ComplianceEventUpdate): Promise<ComplianceEvent> {
  const response = await backendFetch(`/compliance-events/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to update event',
      response.status
    );
  }
  
  return await response.json();
}

export async function deleteComplianceEvent(id: number): Promise<void> {
  const response = await backendFetch(`/compliance-events/${id}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to delete event',
      response.status
    );
  }
}

// Pending Events
export async function fetchPendingEvents(aiGeneratedOnly: boolean = false): Promise<PaginatedPendingComplianceEvents> {
  const params = new URLSearchParams();
  if (aiGeneratedOnly) {
    params.append('ai_generated', 'true');
  }
  
  const response = await backendFetch(`/compliance-events/pending/?${params}`);
  
  if (!response.ok) {
    throw new ComplianceEventError('Failed to fetch pending events', response.status);
  }
  
  return await response.json();
}

// Upcoming Events
export async function fetchUpcomingEvents(days: number = 30): Promise<PaginatedComplianceEvents> {
  const response = await backendFetch(`/compliance-events/upcoming/?days=${days}`);
  
  if (!response.ok) {
    throw new ComplianceEventError('Failed to fetch upcoming events', response.status);
  }
  
  return await response.json();
}

// AI Research
export async function startEventResearch(request: EventResearchRequest): Promise<EventResearchSession> {
  const response = await backendFetch('/events/research/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to start event research',
      response.status
    );
  }
  
  return await response.json();
}

export async function getEventResearchResults(sessionId: string): Promise<EventResearchResult> {
  const response = await backendFetch(`/events/research-results/${sessionId}/`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to fetch research results',
      response.status
    );
  }
  
  return await response.json();
}

// Event Approval
export async function approveEvent(eventId: number, request?: EventApprovalRequest): Promise<ComplianceEvent> {
  const response = await backendFetch(`/events/approve/${eventId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request || {}),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to approve event',
      response.status
    );
  }
  
  return await response.json();
}

export async function rejectEvent(eventId: number, request: EventRejectionRequest): Promise<ComplianceEvent> {
  const response = await backendFetch(`/events/reject/${eventId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to reject event',
      response.status
    );
  }
  
  return await response.json();
}

export async function bulkApproveEvents(request: BulkEventApprovalRequest): Promise<BulkEventApprovalResponse> {
  const response = await backendFetch('/events/approve-batch/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ComplianceEventError(
      errorData.error || 'Failed to bulk approve events',
      response.status
    );
  }
  
  return await response.json();
}