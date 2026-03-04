"use client";

import { useState, useEffect } from 'react';
import { TaxConfigurationsApi } from '@/api-client/api/tax-configurations-api';
import { Configuration } from '@/api-client/configuration';
import { getBackendUrl } from '@/lib/backendUrl';

interface TaxConfigSummary {
  count: number;
  categories: {
    [key: string]: number;
  };
  pending: number;
}

interface StateTaxData {
  [stateCode: string]: TaxConfigSummary;
}

export function useTaxConfigsByState() {
  const [data, setData] = useState<StateTaxData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Initialize API client
        const configuration = new Configuration({
          basePath: getBackendUrl(),
          // Note: In a real app, you'd get the token from your auth system
          accessToken: 'mock-token'
        });
        
        const api = new TaxConfigurationsApi(configuration);
        
        // For now, we'll use mock data since the backend might not be available
        // In production, you would make actual API calls here
        
        // Mock data generation for demonstration
        const US_STATE_CODES = [
          'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
          'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
          'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
          'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
          'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];
        
        const mockData: StateTaxData = {};
        
        // Generate realistic looking data for each state
        US_STATE_CODES.forEach(stateCode => {
          const baseCount = Math.floor(Math.random() * 50) + 10;
          const categories = {
            'income_tax': Math.floor(baseCount * (0.2 + Math.random() * 0.3)),
            'social_insurance': Math.floor(baseCount * (0.15 + Math.random() * 0.25)),
            'unemployment': Math.floor(baseCount * (0.1 + Math.random() * 0.2)),
            'disability': Math.floor(baseCount * (0.05 + Math.random() * 0.15)),
            'other': 0
          };
          
          // Calculate 'other' category
          const totalCategorized = Object.values(categories).reduce((sum, val) => sum + val, 0);
          categories.other = Math.max(0, baseCount - totalCategorized);
          
          mockData[stateCode] = {
            count: baseCount,
            categories,
            pending: Math.floor(Math.random() * 8) // 0-7 pending items
          };
          
          // Add some variation to certain states
          if (['CA', 'NY', 'TX', 'FL'].includes(stateCode)) {
            mockData[stateCode].count = Math.floor(baseCount * 1.5);
            Object.keys(mockData[stateCode].categories).forEach(key => {
              mockData[stateCode].categories[key] = Math.floor(
                mockData[stateCode].categories[key] * 1.5
              );
            });
          }
        });
        
        setData(mockData);
        
        /* 
        // Real API implementation would look like this:
        const statePromises = US_STATE_CODES.map(async (stateCode) => {
          try {
            // Get all tax configs for this state
            const allConfigs = await api.taxConfigsGet(1, 100, `US-${stateCode}`);
            
            // Get pending configs for this state  
            const pendingConfigs = await api.taxConfigsPendingGet(1, 100);
            const statePending = pendingConfigs.data.results?.filter(
              config => config.jurisdiction?.code?.includes(stateCode)
            ) || [];
            
            // Count by category
            const categories: {[key: string]: number} = {};
            allConfigs.data.results?.forEach(config => {
              const category = config.category || 'other';
              categories[category] = (categories[category] || 0) + 1;
            });
            
            return {
              stateCode,
              data: {
                count: allConfigs.data.results?.length || 0,
                categories,
                pending: statePending.length
              }
            };
          } catch (err) {
            console.warn(`Failed to load data for ${stateCode}:`, err);
            return {
              stateCode,
              data: {
                count: 0,
                categories: {},
                pending: 0
              }
            };
          }
        });
        
        const results = await Promise.all(statePromises);
        const stateData: StateTaxData = {};
        results.forEach(({ stateCode, data }) => {
          stateData[stateCode] = data;
        });
        
        setData(stateData);
        */
        
      } catch (err) {
        console.error('Error loading state tax data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load state tax data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refetch = () => {
    setLoading(true);
    // Re-trigger the effect
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}