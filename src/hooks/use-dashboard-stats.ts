"use client";

import { useState, useEffect } from 'react';
import { TaxConfigurationsApi } from '@/api-client/api/tax-configurations-api';
import { JurisdictionsApi } from '@/api-client/api/jurisdictions-api';
import { ComplianceEventsApi } from '@/api-client/api/compliance-events-api';
import { Configuration } from '@/api-client/configuration';
import { getBackendUrl } from '@/lib/backendUrl';

export interface DashboardStats {
  activeTaxConfigs: number;
  jurisdictions: number;
  pendingReviews: number;
  calculationsToday: number;
  taxCategories: {
    income_tax: number;
    social_insurance: number;
    unemployment: number;
    other: number;
  };
  loading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    activeTaxConfigs: 0,
    jurisdictions: 0,
    pendingReviews: 0,
    calculationsToday: 0,
    taxCategories: {
      income_tax: 0,
      social_insurance: 0,
      unemployment: 0,
      other: 0,
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const configuration = new Configuration({
          basePath: getBackendUrl(),
          accessToken: 'mock-token'
        });

        const taxConfigsApi = new TaxConfigurationsApi(configuration);
        const jurisdictionsApi = new JurisdictionsApi(configuration);
        const complianceEventsApi = new ComplianceEventsApi(configuration);

        // Fetch data in parallel
        const [
          activeTaxConfigsResponse,
          pendingTaxConfigsResponse,
          jurisdictionsResponse,
          complianceEventsResponse
        ] = await Promise.allSettled([
          taxConfigsApi.taxConfigsGet(1, 1000),
          taxConfigsApi.taxConfigsPendingGet(1, 1000),
          jurisdictionsApi.jurisdictionsGet(1, 1000),
          complianceEventsApi.complianceEventsGet(1, 100)
        ]);

        // Process results
        let activeTaxConfigs = 0;
        let pendingReviews = 0;
        let jurisdictions = 0;
        let calculationsToday = 0;
        let taxCategories = {
          income_tax: 0,
          social_insurance: 0,
          unemployment: 0,
          other: 0,
        };

        // Active tax configurations
        if (activeTaxConfigsResponse.status === 'fulfilled') {
          const configs = activeTaxConfigsResponse.value.data.results || [];
          activeTaxConfigs = configs.length;
          
          // Count by categories (Note: config type may not have category field)
          configs.forEach(config => {
            const configAny = config as any;
            const category = configAny.category?.toLowerCase().replace(/\s+/g, '_') as keyof typeof taxCategories;
            if (category && taxCategories.hasOwnProperty(category)) {
              taxCategories[category]++;
            } else {
              taxCategories.other++;
            }
          });
        }

        // Pending reviews
        if (pendingTaxConfigsResponse.status === 'fulfilled') {
          pendingReviews = pendingTaxConfigsResponse.value.data.results?.length || 0;
        }

        // Jurisdictions
        if (jurisdictionsResponse.status === 'fulfilled') {
          jurisdictions = jurisdictionsResponse.value.data.results?.length || 0;
        }

        // Calculations today (estimate from compliance events)
        if (complianceEventsResponse.status === 'fulfilled') {
          const events = complianceEventsResponse.value.data.results || [];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          calculationsToday = events.filter(event => {
            const eventAny = event as any;
            if (!eventAny.created_at) return false;
            const eventDate = new Date(eventAny.created_at);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === today.getTime();
          }).length;
        }

        setStats({
          activeTaxConfigs,
          jurisdictions,
          pendingReviews,
          calculationsToday,
          taxCategories,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        
        // Fallback to reasonable mock data on error
        setStats({
          activeTaxConfigs: 156,
          jurisdictions: 51,
          pendingReviews: 3,
          calculationsToday: 47,
          taxCategories: {
            income_tax: 89,
            social_insurance: 42,
            unemployment: 18,
            other: 7,
          },
          loading: false,
          error: 'Using fallback data - API connection issues',
        });
      }
    };

    loadDashboardStats();
  }, []);

  return stats;
}