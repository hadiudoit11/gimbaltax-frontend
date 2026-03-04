import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxConfigsApi, complianceEventsApi, handleApiError } from '@/lib/api-client';
import { getBackendUrl } from '@/lib/backendUrl';
import { 
  TaxCategory, 
  TaxConfigStatus, 
  TaxConfigCreate, 
  TaxConfigUpdate 
} from '@/api-client/types';
import { extractComplianceEventsFromTaxConfig } from '@/lib/compliance-event-extractor';

// Query Keys
export const taxConfigKeys = {
  all: ['taxConfigs'] as const,
  lists: () => [...taxConfigKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...taxConfigKeys.lists(), filters] as const,
  pending: () => [...taxConfigKeys.all, 'pending'] as const,
  details: () => [...taxConfigKeys.all, 'detail'] as const,
  detail: (id: string) => [...taxConfigKeys.details(), id] as const,
};

interface TaxConfigFilters {
  page?: number;
  pageSize?: number;
  jurisdiction?: string;
  category?: TaxCategory;
  status?: TaxConfigStatus;
  effectiveFrom?: string;
  search?: string;
}

interface PendingTaxConfigFilters {
  page?: number;
  pageSize?: number;
  createdBy?: string;
}

// Hooks
export const useTaxConfigs = (filters?: TaxConfigFilters) => {
  return useQuery({
    queryKey: taxConfigKeys.list(filters || {}),
    queryFn: async () => {
      try {
        const response = await taxConfigsApi.taxConfigsGet(
          filters?.page,
          filters?.pageSize,
          filters?.jurisdiction,
          filters?.category,
          filters?.status,
          filters?.effectiveFrom,
          filters?.search
        );
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
  });
};

// Fallback function using direct fetch
const fetchPendingConfigsDirectly = async (filters?: PendingTaxConfigFilters) => {
  const baseUrl = getBackendUrl();
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.pageSize) params.append('page_size', filters.pageSize.toString());
  if (filters?.createdBy) params.append('created_by', filters.createdBy);
  
  const url = `${baseUrl}/api/v1/tax-configs/pending/?${params.toString()}`;
  
  console.log('[usePendingTaxConfigs] Fallback direct fetch to:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer mock-token',
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export const usePendingTaxConfigs = (filters?: PendingTaxConfigFilters) => {
  return useQuery({
    queryKey: [...taxConfigKeys.pending(), filters || {}],
    queryFn: async () => {
      const emptyResult = {
        results: [],
        count: 0,
        next: null,
        previous: null
      };

      try {
        console.log('[usePendingTaxConfigs] Fetching pending configs with filters:', filters);
        console.log('[usePendingTaxConfigs] Backend URL:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`);
        
        // Check if taxConfigsApi is properly initialized
        if (!taxConfigsApi || typeof taxConfigsApi.taxConfigsPendingGet !== 'function') {
          console.error('[usePendingTaxConfigs] taxConfigsApi not properly initialized, trying direct fetch');
          return await fetchPendingConfigsDirectly(filters);
        }
        
        const response = await taxConfigsApi.taxConfigsPendingGet(
          filters?.page || 1,
          filters?.pageSize || 50,
          filters?.createdBy
        );
        console.log('[usePendingTaxConfigs] Response received:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('[usePendingTaxConfigs] API client failed, trying direct fetch. Error was:', error);
        
        // Try fallback direct fetch
        try {
          const directResult = await fetchPendingConfigsDirectly(filters);
          console.log('[usePendingTaxConfigs] Direct fetch succeeded:', directResult);
          return directResult;
        } catch (directError: any) {
          console.error('[usePendingTaxConfigs] Direct fetch also failed:', {
            message: directError?.message,
            status: directError?.status,
            name: directError?.name,
          });
          
          // Return empty results as final fallback
          console.warn('[usePendingTaxConfigs] Both API client and direct fetch failed. Returning empty results.');
          return emptyResult;
        }
      }
    },
    // Disable automatic refetching to reduce server load
    refetchInterval: false,
    refetchIntervalInBackground: false,
    // Don't retry any errors initially to prevent spam
    retry: false,
    // Set a reasonable stale time to prevent excessive calls
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTaxConfig = (id: string) => {
  return useQuery({
    queryKey: taxConfigKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await taxConfigsApi.taxConfigsIdGet(id);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    enabled: !!id,
  });
};

export const useCreateTaxConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TaxConfigCreate) => {
      try {
        // Create the tax config first
        const response = await taxConfigsApi.taxConfigsPost(data);
        const savedTaxConfig = response.data;

        // Extract jurisdiction ID for compliance events
        let jurisdictionId: number | undefined;
        if (typeof data.jurisdiction === 'string') {
          // If jurisdiction is a string (ID), parse it
          jurisdictionId = parseInt(data.jurisdiction, 10);
        } else if (typeof data.jurisdiction === 'number') {
          jurisdictionId = data.jurisdiction;
        }

        // Generate compliance events from the saved tax config
        if (jurisdictionId && savedTaxConfig) {
          try {
            const dataWithId = { ...data, id: savedTaxConfig.id };
            console.log('[useCreateTaxConfig] Extracting compliance events from tax config:', {
              taxConfigId: savedTaxConfig.id,
              jurisdictionId,
              payload: dataWithId.payload,
              hasRemittance: !!dataWithId.payload?.remittance,
              filingFrequency: dataWithId.payload?.remittance?.filing_frequency
            });
            
            const complianceEvents = extractComplianceEventsFromTaxConfig(dataWithId, jurisdictionId);
            console.log('[useCreateTaxConfig] Generated compliance events:', complianceEvents);
            
            // Create each compliance event
            const eventPromises = complianceEvents.map(async (event) => {
              try {
                await complianceEventsApi.complianceEventsPost(event);
                console.log(`Created compliance event: ${event.title}`);
              } catch (eventError) {
                console.warn('Failed to create compliance event:', event.title, eventError);
                // Don't fail the whole operation if compliance events fail
              }
            });

            await Promise.allSettled(eventPromises);
            console.log(`Generated ${complianceEvents.length} compliance events for tax config: ${savedTaxConfig.name}`);
          } catch (complianceError) {
            console.warn('Failed to generate compliance events:', complianceError);
            // Don't fail the tax config creation if compliance events fail
          }
        }

        return savedTaxConfig;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.lists() });
      // Invalidate compliance events to refresh the calendar
      queryClient.invalidateQueries({ queryKey: ['complianceEvents'] });
    },
  });
};

export const useUpdateTaxConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data, originalTaxConfig }: { 
      id: string; 
      data: TaxConfigUpdate; 
      originalTaxConfig?: any 
    }) => {
      try {
        // Update the tax config first
        const response = await taxConfigsApi.taxConfigsIdPut(id, data);
        const updatedTaxConfig = response.data;

        // Generate new compliance events if remittance/filing info changed
        if (originalTaxConfig?.jurisdiction && (
          data.payload?.remittance || 
          data.payload?.wage_base?.reset_frequency
        )) {
          try {
            let jurisdictionId: number | undefined;
            
            // Extract jurisdiction ID from the original config
            if (typeof originalTaxConfig.jurisdiction === 'string') {
              jurisdictionId = parseInt(originalTaxConfig.jurisdiction, 10);
            } else if (typeof originalTaxConfig.jurisdiction === 'number') {
              jurisdictionId = originalTaxConfig.jurisdiction;
            } else if (originalTaxConfig.jurisdiction?.id) {
              jurisdictionId = originalTaxConfig.jurisdiction.id;
            }

            if (jurisdictionId) {
              const dataWithId = { ...data, id: parseInt(id, 10) };
              const complianceEvents = extractComplianceEventsFromTaxConfig(dataWithId, jurisdictionId);
              
              // Create new compliance events
              const eventPromises = complianceEvents.map(async (event) => {
                try {
                  await complianceEventsApi.complianceEventsPost(event);
                  console.log(`Created compliance event from update: ${event.title}`);
                } catch (eventError) {
                  console.warn('Failed to create compliance event from update:', event.title, eventError);
                }
              });

              await Promise.allSettled(eventPromises);
              console.log(`Generated ${complianceEvents.length} compliance events for updated tax config: ${updatedTaxConfig.name}`);
            }
          } catch (complianceError) {
            console.warn('Failed to generate compliance events from update:', complianceError);
          }
        }

        return updatedTaxConfig;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.detail(variables.id) });
      // Invalidate compliance events to refresh the calendar
      queryClient.invalidateQueries({ queryKey: ['complianceEvents'] });
    },
  });
};

export const useDeleteTaxConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await taxConfigsApi.taxConfigsIdDelete(id);
        return { id };
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.lists() });
    },
  });
};