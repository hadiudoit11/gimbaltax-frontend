import { Jurisdiction, TaxCategory } from '@/types/sales-tax';

// NY
import { NY_JURISDICTIONS, getAllCounties as getAllNYCounties } from './ny-jurisdictions';
import { NY_TAX_CATEGORIES } from './ny-taxability';

// TX
import { TX_JURISDICTIONS, getAllTXJurisdictions } from './tx-jurisdictions';
import { TX_TAX_CATEGORIES } from './tx-taxability';

// CA
import { CA_JURISDICTIONS, getAllCAJurisdictions } from './ca-jurisdictions';
import { CA_TAX_CATEGORIES } from './ca-taxability';

// FL
import { FL_JURISDICTIONS, getAllFLJurisdictions } from './fl-jurisdictions';
import { FL_TAX_CATEGORIES } from './fl-taxability';

// GA
import { GA_JURISDICTIONS, getAllGAJurisdictions } from './ga-jurisdictions';
import { GA_TAX_CATEGORIES } from './ga-taxability';

export interface StateConfig {
  code: string;
  name: string;
  stateRate: number;
  maxCombinedRate: number;
  jurisdictions: Jurisdiction[];
  categories: TaxCategory[];
  getAllJurisdictions: () => Jurisdiction[];
  highlights: string[];
}

export const STATES: Record<string, StateConfig> = {
  NY: {
    code: 'NY',
    name: 'New York',
    stateRate: 4.0,
    maxCombinedRate: 8.875,
    jurisdictions: NY_JURISDICTIONS,
    categories: NY_TAX_CATEGORIES,
    getAllJurisdictions: getAllNYCounties,
    highlights: [
      'Clothing under $110 exempt (per item)',
      'NYC has highest rate at 8.875%',
      'MCTD surcharge in metro area',
    ],
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    stateRate: 6.25,
    maxCombinedRate: 8.25,
    jurisdictions: TX_JURISDICTIONS,
    categories: TX_TAX_CATEGORIES,
    getAllJurisdictions: getAllTXJurisdictions,
    highlights: [
      'No state income tax - relies on sales tax',
      'Groceries exempt, digital goods taxable',
      'Annual tax-free weekend in August',
    ],
  },
  CA: {
    code: 'CA',
    name: 'California',
    stateRate: 7.25,
    maxCombinedRate: 10.75,
    jurisdictions: CA_JURISDICTIONS,
    categories: CA_TAX_CATEGORIES,
    getAllJurisdictions: getAllCAJurisdictions,
    highlights: [
      'Highest base state rate at 7.25%',
      'District taxes can push to 10%+',
      'Digital goods generally exempt',
    ],
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    stateRate: 6.0,
    maxCombinedRate: 8.5,
    jurisdictions: FL_JURISDICTIONS,
    categories: FL_TAX_CATEGORIES,
    getAllJurisdictions: getAllFLJurisdictions,
    highlights: [
      'No state income tax',
      'Digital products exempt',
      'Multiple tax holidays throughout year',
    ],
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    stateRate: 4.0,
    maxCombinedRate: 8.9,
    jurisdictions: GA_JURISDICTIONS,
    categories: GA_TAX_CATEGORIES,
    getAllJurisdictions: getAllGAJurisdictions,
    highlights: [
      'Groceries exempt from STATE tax only',
      'Local rates vary widely (2-4%)',
      'Digital goods and SaaS taxable',
    ],
  },
};

export const STATE_LIST = Object.values(STATES);

export function getStateByCode(code: string): StateConfig | undefined {
  return STATES[code];
}

export function getAllStates(): StateConfig[] {
  return STATE_LIST;
}
