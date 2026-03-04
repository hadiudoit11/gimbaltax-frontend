import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiRequest';

// TypeScript interfaces for research results API
export interface ResearchResultMetadata {
  title: string;
  query: string;
  word_count: number;
  reading_time: number;
  processing_time: number;
  created_at: string;
  updated_at?: string;
  jurisdiction: {
    id: string;
    name: string;
  };
  tags: string[];
}

export interface ResearchResult {
  id: string;
  session_id: string;
  title: string;
  query: string;
  content_markdown: string;
  content_html?: string;
  summary?: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  word_count: number;
  reading_time: number;
  processing_time: number;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  jurisdiction: {
    id: string;
    name: string;
  };
  tags: string[];
  related_configs: RelatedConfig[];
  related_configs_count: number;
}

export interface RelatedConfig {
  id: string;
  name: string;
  code: string;
  tax_category: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  validation_status: 'valid' | 'warning' | 'error';
  validation_errors: string[];
}

export interface ResearchResultsListResponse {
  results: ResearchResult[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
    next_url?: string;
    prev_url?: string;
  };
}

export interface ResearchResultsFilters {
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  jurisdiction_id?: string;
  tags?: string[];
  created_after?: string;
  created_before?: string;
  page?: number;
  per_page?: number;
}

// Query Keys
export const researchResultsKeys = {
  all: ['research-results'] as const,
  lists: () => [...researchResultsKeys.all, 'list'] as const,
  list: (filters: ResearchResultsFilters) => [...researchResultsKeys.lists(), filters] as const,
  details: () => [...researchResultsKeys.all, 'detail'] as const,
  detail: (id: string) => [...researchResultsKeys.details(), id] as const,
  bySession: (sessionId: string) => [...researchResultsKeys.all, 'session', sessionId] as const,
};

// Hooks
export const useResearchResultsList = (filters: ResearchResultsFilters = {}) => {
  return useQuery({
    queryKey: researchResultsKeys.list(filters),
    queryFn: async (): Promise<ResearchResultsListResponse> => {
      const searchParams = new URLSearchParams();
      
      // Add filters to search params
      if (filters.search) searchParams.append('search', filters.search);
      if (filters.status) searchParams.append('status', filters.status);
      if (filters.jurisdiction_id) searchParams.append('jurisdiction_id', filters.jurisdiction_id);
      if (filters.tags) filters.tags.forEach(tag => searchParams.append('tags', tag));
      if (filters.created_after) searchParams.append('created_after', filters.created_after);
      if (filters.created_before) searchParams.append('created_before', filters.created_before);
      if (filters.page) searchParams.append('page', filters.page.toString());
      if (filters.per_page) searchParams.append('per_page', filters.per_page.toString());
      
      const queryString = searchParams.toString();
      const endpoint = queryString ? `api/v1/research-results/?${queryString}` : 'api/v1/research-results/';
      
      return await apiGet(endpoint);
    },
  });
};

export const useResearchResultDetail = (id: string) => {
  return useQuery({
    queryKey: researchResultsKeys.detail(id),
    queryFn: async (): Promise<ResearchResult> => {
      return await apiGet(`api/v1/research-results/${id}/`);
    },
    enabled: !!id,
  });
};

export const useResearchResultBySession = (sessionId: string) => {
  return useQuery({
    queryKey: researchResultsKeys.bySession(sessionId),
    queryFn: async (): Promise<ResearchResult> => {
      return await apiGet(`api/v1/research-results/${sessionId}/by-session/`);
    },
    enabled: !!sessionId,
  });
};

export const usePublishResearchResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<ResearchResult> => {
      console.debug('[usePublishResearchResult] Publishing research result', { id });
      
      const response = await apiPost(`api/v1/research-results/${id}/publish/`, {});
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch research results
      queryClient.invalidateQueries({ queryKey: researchResultsKeys.all });
      queryClient.setQueryData(researchResultsKeys.detail(data.id), data);
    },
  });
};

export const useArchiveResearchResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<ResearchResult> => {
      console.debug('[useArchiveResearchResult] Archiving research result', { id });
      
      const response = await apiPost(`api/v1/research-results/${id}/archive/`, {});
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch research results
      queryClient.invalidateQueries({ queryKey: researchResultsKeys.all });
      queryClient.setQueryData(researchResultsKeys.detail(data.id), data);
    },
  });
};

export const useDeleteResearchResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.debug('[useDeleteResearchResult] Deleting research result', { id });
      
      await apiPost(`api/v1/research-results/${id}/delete/`, {});
    },
    onSuccess: (_, id) => {
      // Invalidate lists and remove from cache
      queryClient.invalidateQueries({ queryKey: researchResultsKeys.lists() });
      queryClient.removeQueries({ queryKey: researchResultsKeys.detail(id) });
    },
  });
};