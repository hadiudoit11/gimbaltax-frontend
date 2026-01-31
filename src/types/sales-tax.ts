// NY Sales Tax Types

export interface Jurisdiction {
  code: string;
  name: string;
  level: 'state' | 'county' | 'city' | 'district';
  parentCode?: string;
  stateRate: number;
  localRate: number;
  mctdRate: number;
  combinedRate: number;
  inMCTD: boolean;
  effectiveDate: string;
  zipCodes?: string[];
  /** Whether this jurisdiction provides the clothing/footwear exemption (under $110).
   * State 4% is always exempt, but local taxes depend on locality election. */
  clothingExemption?: boolean;
}

export interface TaxabilityRule {
  id: string;
  category: string;
  subcategory?: string;
  description: string;
  taxable: boolean;
  exemptionType?: 'full' | 'partial' | 'threshold' | 'conditional';
  threshold?: number;
  conditions?: string[];
  tbReference: string;
  tbUrl: string;
  notes?: string;
}

export interface TaxCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  rules: TaxabilityRule[];
}

export interface FilingRequirement {
  id: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  threshold: {
    min: number;
    max?: number;
  };
  form: string;
  dueDay: number;
  electronicRequired: boolean;
  description: string;
}

export interface ComplianceEvent {
  id: string;
  title: string;
  type: 'filing' | 'payment' | 'registration' | 'rate_change';
  dueDate: string;
  jurisdiction: string;
  form?: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface TechnicalBulletin {
  id: string;
  number: string;
  title: string;
  category: string;
  publishedDate: string;
  lastUpdated: string;
  summary: string;
  url: string;
  relatedTopics: string[];
}

export interface NexusThreshold {
  type: 'economic' | 'physical';
  salesThreshold: number;
  transactionThreshold: number;
  logic: 'AND' | 'OR';
  lookbackPeriod: string;
  description: string;
}

export interface RateCalculation {
  jurisdiction: Jurisdiction;
  subtotal: number;
  stateAmount: number;
  localAmount: number;
  mctdAmount: number;
  totalTax: number;
  effectiveRate: number;
}
