import { useState, useEffect, useCallback } from 'react';
import {
  fetchComplianceEvents,
  fetchPendingEvents,
  fetchUpcomingEvents,
  startEventResearch,
  getEventResearchResults,
  approveEvent,
  rejectEvent,
  bulkApproveEvents,
  createComplianceEvent,
  updateComplianceEvent,
  deleteComplianceEvent,
} from '@/lib/compliance-events-api';
import type {
  ComplianceEvent,
  PendingComplianceEvent,
  ComplianceEventsFilters,
  EventResearchRequest,
  EventResearchResult,
  ComplianceEventCreate,
  ComplianceEventUpdate,
  EventApprovalRequest,
  EventRejectionRequest,
  BulkEventApprovalRequest,
} from '@/types/compliance-events';

export function useComplianceEvents(filters: ComplianceEventsFilters = {}) {
  const [events, setEvents] = useState<ComplianceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComplianceEvents(filters);
      setEvents(data.results);
      setPagination({
        count: data.count,
        next: data.next || null,
        previous: data.previous || null,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: loadEvents,
  };
}

export function usePendingEvents(aiGeneratedOnly: boolean = false) {
  const [pendingEvents, setPendingEvents] = useState<PendingComplianceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPendingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPendingEvents(aiGeneratedOnly);
      setPendingEvents(data.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending events');
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  }, [aiGeneratedOnly]);

  useEffect(() => {
    loadPendingEvents();
  }, [loadPendingEvents]);

  return {
    pendingEvents,
    loading,
    error,
    refetch: loadPendingEvents,
  };
}

export function useUpcomingEvents(days: number = 30) {
  const [upcomingEvents, setUpcomingEvents] = useState<ComplianceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUpcomingEvents(days);
      setUpcomingEvents(data.results);
    } catch (err: any) {
      setError(err.message || 'Failed to load upcoming events');
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadUpcomingEvents();
  }, [loadUpcomingEvents]);

  return {
    upcomingEvents,
    loading,
    error,
    refetch: loadUpcomingEvents,
  };
}

export function useEventResearch() {
  const [isResearching, setIsResearching] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [results, setResults] = useState<EventResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startResearch = useCallback(async (request: EventResearchRequest) => {
    try {
      setIsResearching(true);
      setError(null);
      setResults(null);
      
      const session = await startEventResearch(request);
      setCurrentSession(session.session_id);
      
      // Poll for results (in a real app, you might want to use WebSocket or SSE)
      const pollForResults = async () => {
        try {
          const results = await getEventResearchResults(session.session_id);
          setResults(results);
          setIsResearching(false);
        } catch (err: any) {
          // If still running, poll again in 2 seconds
          if (err.status === 404 || err.message.includes('not found')) {
            setTimeout(pollForResults, 2000);
          } else {
            setError(err.message || 'Failed to get research results');
            setIsResearching(false);
          }
        }
      };
      
      // Start polling after a short delay
      setTimeout(pollForResults, 2000);
      
      return session;
    } catch (err: any) {
      setError(err.message || 'Failed to start research');
      setIsResearching(false);
      throw err;
    }
  }, []);

  const resetResearch = useCallback(() => {
    setIsResearching(false);
    setCurrentSession(null);
    setResults(null);
    setError(null);
  }, []);

  return {
    isResearching,
    currentSession,
    results,
    error,
    startResearch,
    resetResearch,
  };
}

export function useEventActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = useCallback(async (eventId: number, request?: EventApprovalRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await approveEvent(eventId, request);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to approve event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReject = useCallback(async (eventId: number, request: EventRejectionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await rejectEvent(eventId, request);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to reject event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBulkApprove = useCallback(async (request: BulkEventApprovalRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bulkApproveEvents(request);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to bulk approve events');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = useCallback(async (eventData: ComplianceEventCreate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createComplianceEvent(eventData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(async (eventId: number, eventData: ComplianceEventUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateComplianceEvent(eventId, eventData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (eventId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComplianceEvent(eventId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    approve: handleApprove,
    reject: handleReject,
    bulkApprove: handleBulkApprove,
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
  };
}