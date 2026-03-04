import { Configuration } from '@/api-client'
import { 
  JurisdictionsApi,
  TaxConfigurationsApi,
  AgentResearchApi,
  ReviewApprovalApi,
  TaxCalculationsApi,
  ValidationApi,
  ComplianceEventsApi
} from '@/api-client/api'
import { getBackendUrl } from '@/lib/backendUrl'

// Create API configuration
const createApiConfiguration = () => new Configuration({
  basePath: `${getBackendUrl()}/api/v1`,
  accessToken: () => {
    // Use mock token for development - replace with real auth in production
    return 'mock-token';
  },
  middleware: [
    {
      pre: async (context) => {
        // Add request logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`API Request: ${context.init.method} ${context.url}`);
        }
        return Promise.resolve(context);
      },
      post: async (context) => {
        // Handle response errors
        if (context.response.status === 401) {
          // TODO: Handle token refresh or redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
          }
        }
        return Promise.resolve(context.response);
      }
    }
  ]
});

// Create API instances
const apiConfig = createApiConfiguration();

console.log('[API Client] Creating API instances with config:', {
  basePath: apiConfig.basePath,
  hasAccessToken: !!apiConfig.accessToken,
});

export const jurisdictionsApi = new JurisdictionsApi(apiConfig);
export const taxConfigsApi = new TaxConfigurationsApi(apiConfig);
export const agentResearchApi = new AgentResearchApi(apiConfig);
export const reviewApprovalApi = new ReviewApprovalApi(apiConfig);
export const taxCalculationsApi = new TaxCalculationsApi(apiConfig);
export const validationApi = new ValidationApi(apiConfig);
export const complianceEventsApi = new ComplianceEventsApi(apiConfig);

// Debug log to verify API client initialization
console.log('[API Client] taxConfigsApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(taxConfigsApi)));
console.log('[API Client] taxConfigsApi.taxConfigsPendingGet type:', typeof taxConfigsApi.taxConfigsPendingGet);

// Error handling utility
export const handleApiError = (error: any) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  
  switch (status) {
    case 400:
      // Validation errors
      const validationErrors = error.response.data.field_errors;
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, errors]) => {
          console.error(`Validation error - ${field}: ${(errors as string[]).join(', ')}`);
        });
      } else {
        console.error('Bad Request:', message);
      }
      break;
    case 401:
      console.error('Unauthorized - check authentication token');
      break;
    case 403:
      console.error('Forbidden - insufficient permissions');
      break;
    case 404:
      console.error('Not Found:', message);
      break;
    case 500:
      console.error('Server Error - the backend may be misconfigured or down:', message);
      break;
    default:
      console.error(`API Error (${status}):`, message);
  }
  
  throw error;
};