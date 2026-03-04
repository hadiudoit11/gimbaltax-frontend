import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut } from '@/lib/apiRequest';

// TypeScript interfaces matching the Django backend
export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  jurisdiction_type: 'federal' | 'state' | 'territory' | 'local';
  locality_type?: 'city' | 'county' | 'school_district' | 'special_district' | 'other' | null;
  parent?: string | null;
  is_active: boolean;
  tax_configs_count: number;
  research_sources: string[];
  all_research_sources: string[];
  created_at: string;
  updated_at: string;
}

export interface JurisdictionCreate {
  code: string;
  name: string;
  jurisdiction_type: 'federal' | 'state' | 'territory' | 'local';
  locality_type?: 'city' | 'county' | 'school_district' | 'special_district' | 'other';
  parent?: string;
  is_active?: boolean;
}

export interface JurisdictionUpdate {
  name?: string;
  locality_type?: 'city' | 'county' | 'school_district' | 'special_district' | 'other';
  parent?: string;
  is_active?: boolean;
  research_sources?: string[];
}

export type JurisdictionType = 'federal' | 'state' | 'territory' | 'local';

// Query Keys
export const jurisdictionKeys = {
  all: ['jurisdictions'] as const,
  lists: () => [...jurisdictionKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...jurisdictionKeys.lists(), filters] as const,
  details: () => [...jurisdictionKeys.all, 'detail'] as const,
  detail: (id: string) => [...jurisdictionKeys.details(), id] as const,
};

interface JurisdictionFilters {
  page?: number;
  pageSize?: number;
  jurisdictionType?: JurisdictionType;
  isActive?: boolean;
  parent?: string;
  search?: string;
}

// Hooks
export const useJurisdictions = (filters?: JurisdictionFilters) => {
  return useQuery({
    queryKey: jurisdictionKeys.list(filters || {}),
    queryFn: async () => {
      const params: Record<string, any> = {};
      
      if (filters?.page) params.page = filters.page;
      if (filters?.pageSize) params.page_size = filters.pageSize;
      if (filters?.jurisdictionType) params.jurisdiction_type = filters.jurisdictionType;
      if (filters?.isActive !== undefined) params.is_active = filters.isActive;
      if (filters?.parent) params.parent = filters.parent;
      if (filters?.search) params.search = filters.search;

      return await apiGet('api/v1/jurisdictions/', { params });
    },
  });
};

export const useJurisdiction = (id: string) => {
  return useQuery({
    queryKey: jurisdictionKeys.detail(id),
    queryFn: async () => {
      return await apiGet(`api/v1/jurisdictions/${id}/`);
    },
    enabled: !!id,
  });
};

export const useCreateJurisdiction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: JurisdictionCreate) => {
      return await apiPost('api/v1/jurisdictions/', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jurisdictionKeys.lists() });
    },
  });
};

export const useUpdateJurisdiction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JurisdictionUpdate }) => {
      return await apiPut(`api/v1/jurisdictions/${id}/`, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: jurisdictionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jurisdictionKeys.detail(variables.id) });
    },
  });
};

export const useUpdateJurisdictionSources = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, sources }: { id: string; sources: string[] }) => {
      console.log('[useUpdateJurisdictionSources] Starting update for jurisdiction:', id);
      console.log('[useUpdateJurisdictionSources] New sources:', sources);
      
      // First, get the current jurisdiction data
      console.log('[useUpdateJurisdictionSources] Fetching current jurisdiction data...');
      const currentData = await apiGet(`api/v1/jurisdictions/${id}/`);
      console.log('[useUpdateJurisdictionSources] Current data:', currentData);
      
      // Prepare the update payload with all required fields
      const updatePayload = {
        code: currentData.code,
        name: currentData.name,
        jurisdiction_type: currentData.jurisdiction_type,
        locality_type: currentData.locality_type,
        parent: currentData.parent,
        is_active: currentData.is_active,
        research_sources: sources
      };
      
      console.log('[useUpdateJurisdictionSources] Update payload:', updatePayload);
      console.log('[useUpdateJurisdictionSources] API URL:', `api/v1/jurisdictions/${id}/`);
      
      const result = await apiPut(`api/v1/jurisdictions/${id}/`, updatePayload);
      console.log('[useUpdateJurisdictionSources] API call successful:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      console.log('[useUpdateJurisdictionSources] Mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: jurisdictionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jurisdictionKeys.detail(variables.id) });
    },
    onError: (error, variables) => {
      console.error('[useUpdateJurisdictionSources] Mutation failed:', error);
      console.error('[useUpdateJurisdictionSources] Failed variables:', variables);
    },
  });
};