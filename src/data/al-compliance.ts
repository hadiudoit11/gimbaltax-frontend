import { FilingRequirement, ComplianceEvent, NexusThreshold, TechnicalBulletin } from '@/types/sales-tax';

export const AL_FILING_REQUIREMENTS: FilingRequirement[] = [
  {
    id: 'monthly',
    frequency: 'monthly',
    threshold: {
      min: 2400,
    },
    form: 'My Alabama Taxes (MAT)',
    dueDay: 20,
    electronicRequired: true,
    description: 'Default filing frequency. Returns due by 20th of month following the reporting period.',
  },
  {
    id: 'quarterly',
    frequency: 'quarterly',
    threshold: {
      min: 200,
      max: 2400,
    },
    form: 'My Alabama Taxes (MAT)',
    dueDay: 20,
    electronicRequired: true,
    description: 'Vendors with less than $2,400 annual state tax liability may elect quarterly filing. Must request by February 20.',
  },
  {
    id: 'annual',
    frequency: 'annual',
    threshold: {
      min: 0,
      max: 10,
    },
    form: 'My Alabama Taxes (MAT)',
    dueDay: 20,
    electronicRequired: true,
    description: 'Vendors with less than $10 annual tax liability may file annually. Return due January 20.',
  },
];

export const AL_NEXUS: NexusThreshold = {
  type: 'economic',
  salesThreshold: 250000,
  transactionThreshold: 0, // Alabama only uses sales threshold
  logic: 'OR', // Only sales threshold applies
  lookbackPeriod: 'Current or previous calendar year',
  description: 'Remote sellers with more than $250,000 in retail sales into Alabama must collect sales/use tax. No transaction count threshold - only gross revenue matters.',
};

// Simplified Sellers Use Tax (SSUT) Program Details
export const AL_SSUT_PROGRAM = {
  rate: 8.0, // Flat 8% rate
  discount: {
    percentage: 2.0,
    maxMonthly: 8000,
    description: '2% discount on SSUT properly collected and remitted timely, up to $400,000 in taxes (max $8,000/month)',
  },
  eligibility: [
    'Seller has no physical presence in Alabama',
    'Sells tangible personal property or services into Alabama',
    'Must register through My Alabama Taxes before collecting',
  ],
  benefits: [
    'Single flat rate of 8% covers all state and local taxes',
    'No need to track individual local rates',
    'Purchaser relieved of use tax obligation',
    'Purchaser can request refund if 8% exceeds local rate',
  ],
  effectiveDate: '2015-10-01',
  legislativeReference: 'Act 2015-448',
};

// Filing discounts for timely filers
export const AL_FILING_DISCOUNT = {
  firstTier: {
    amount: 100,
    rate: 5.0,
    description: '5% discount on first $100 of tax',
  },
  secondTier: {
    rate: 2.0,
    description: '2% discount on all tax over $100',
  },
  maxMonthly: 400,
  notes: 'Discount available for timely filed and paid returns',
};

// Generate compliance events for Alabama
export function generateALComplianceCalendar(year: number): ComplianceEvent[] {
  const events: ComplianceEvent[] = [];

  // Monthly filing due dates (20th of each month)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  months.forEach((month, index) => {
    const dueMonth = index === 11 ? 1 : index + 2;
    const dueYear = index === 11 ? year + 1 : year;
    const dueDate = `${dueYear}-${String(dueMonth).padStart(2, '0')}-20`;

    events.push({
      id: `monthly-filing-${year}-${index + 1}`,
      title: `${month} ${year} Sales Tax Due`,
      type: 'filing',
      dueDate: dueDate,
      jurisdiction: 'AL',
      form: 'My Alabama Taxes',
      description: `Monthly sales tax return for ${month} ${year}. File and pay via My Alabama Taxes portal.`,
      priority: 'high',
    });
  });

  // Quarterly filing due dates
  const quarterlyDates = [
    { quarter: 'Q1', dueDate: `${year}-04-20`, period: 'Jan - Mar' },
    { quarter: 'Q2', dueDate: `${year}-07-20`, period: 'Apr - Jun' },
    { quarter: 'Q3', dueDate: `${year}-10-20`, period: 'Jul - Sep' },
    { quarter: 'Q4', dueDate: `${year + 1}-01-20`, period: 'Oct - Dec' },
  ];

  quarterlyDates.forEach((q, index) => {
    events.push({
      id: `quarterly-filing-${year}-${index + 1}`,
      title: `${q.quarter} ${year} Quarterly Sales Tax Due`,
      type: 'filing',
      dueDate: q.dueDate,
      jurisdiction: 'AL',
      form: 'My Alabama Taxes',
      description: `Quarterly sales tax return for ${q.period} ${year}. For vendors with <$2,400 annual liability who elected quarterly filing.`,
      priority: 'medium',
    });
  });

  // Annual filing
  events.push({
    id: `annual-filing-${year}`,
    title: `${year} Annual Sales Tax Due`,
    type: 'filing',
    dueDate: `${year + 1}-01-20`,
    jurisdiction: 'AL',
    form: 'My Alabama Taxes',
    description: `Annual sales tax return for ${year}. For vendors with <$10 annual liability who elected annual filing.`,
    priority: 'medium',
  });

  // Back-to-School Tax-Free Weekend (typically late July)
  events.push({
    id: `tax-holiday-${year}`,
    title: `Back-to-School Tax-Free Weekend`,
    type: 'rate_change',
    dueDate: `${year}-07-19`, // Typically third full weekend in July
    jurisdiction: 'AL',
    description: `Annual tax-free weekend for school supplies, clothing (<$156), and computers (<$750). Check ADOR for exact dates.`,
    priority: 'medium',
  });

  // Food tax rate change reminder (if applicable)
  events.push({
    id: `food-rate-${year}`,
    title: `Food Tax Rate: 2% State Rate in Effect`,
    type: 'rate_change',
    dueDate: `${year}-09-01`,
    jurisdiction: 'AL',
    description: `Reminder: Reduced 2% state rate applies to SNAP-eligible food items. Local rates still apply.`,
    priority: 'low',
  });

  // Filing frequency election deadline
  events.push({
    id: `filing-election-${year}`,
    title: `Filing Frequency Election Deadline`,
    type: 'registration',
    dueDate: `${year}-02-20`,
    jurisdiction: 'AL',
    description: `Deadline to request change to quarterly, semi-annual, or annual filing frequency for the year.`,
    priority: 'medium',
  });

  return events.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

// Alabama-specific guidance and resources
export const AL_RESOURCES: TechnicalBulletin[] = [
  {
    id: 'al-sales-tax-overview',
    number: 'ADOR-ST-001',
    title: 'Sales Tax Overview',
    category: 'General',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Overview of Alabama sales tax including rates, taxable items, and exemptions.',
    url: 'https://www.revenue.alabama.gov/sales-use/sales-tax/',
    relatedTopics: ['Sales tax', 'Overview', 'Rates'],
  },
  {
    id: 'al-tax-rates',
    number: 'ADOR-ST-002',
    title: 'Sales and Use Tax Rates',
    category: 'Rates',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Complete listing of state and local sales tax rates including special rates for food, auto, and manufacturing.',
    url: 'https://www.revenue.alabama.gov/sales-use/tax-rates/',
    relatedTopics: ['Tax rates', 'Local taxes', 'Special rates'],
  },
  {
    id: 'al-ssut',
    number: 'ADOR-ST-003',
    title: 'Simplified Sellers Use Tax (SSUT)',
    category: 'Remote Sellers',
    publishedDate: '2015-10-01',
    lastUpdated: '2024-01-01',
    summary: 'Information about the SSUT program allowing remote sellers to collect a flat 8% rate.',
    url: 'https://www.revenue.alabama.gov/sales-use/simplified-sellers-use-tax-ssut/',
    relatedTopics: ['SSUT', 'Remote sellers', 'Economic nexus', 'Marketplace'],
  },
  {
    id: 'al-economic-nexus',
    number: 'ADOR-ST-004',
    title: 'Economic Nexus for Remote Sellers',
    category: 'Nexus',
    publishedDate: '2019-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Rules for remote sellers regarding $250,000 sales threshold and collection requirements.',
    url: 'https://www.revenue.alabama.gov/ador-announces-sales-and-use-tax-guidance-for-online-sellers/',
    relatedTopics: ['Economic nexus', 'Remote sellers', '$250,000 threshold'],
  },
  {
    id: 'al-food-tax',
    number: 'ADOR-ST-005',
    title: 'Food Sales Tax Rate',
    category: 'Food & Groceries',
    publishedDate: '2023-09-01',
    lastUpdated: '2025-09-01',
    summary: 'Information about the reduced state sales tax rate on SNAP-eligible food items (2% as of Sept 2025).',
    url: 'https://www.revenue.alabama.gov/notice-state-sales-and-use-tax-rate-reduced-on-food-beginning-september-1-2025/',
    relatedTopics: ['Food tax', 'Grocery', 'SNAP', 'Reduced rate'],
  },
  {
    id: 'al-software',
    number: 'ADOR-ST-006',
    title: 'Taxability of Computer Software',
    category: 'Digital Products',
    publishedDate: '2019-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Guidance on taxability of software including SaaS, downloaded software, and custom software.',
    url: 'https://www.revenue.alabama.gov/ador-issues-guidance-on-taxability-of-computer-software/',
    relatedTopics: ['Software', 'SaaS', 'Digital products', 'Downloads'],
  },
  {
    id: 'al-labor-services',
    number: 'ADOR-ST-007',
    title: 'Labor and Service Charges',
    category: 'Services',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Rules for taxability of labor, installation, repair, and fabrication charges.',
    url: 'https://www.law.cornell.edu/regulations/alabama/Ala-Admin-Code-r-810-6-1-.84',
    relatedTopics: ['Labor', 'Services', 'Repair', 'Installation', 'Fabrication'],
  },
  {
    id: 'al-exemptions',
    number: 'ADOR-ST-008',
    title: 'Sales Tax Exemptions',
    category: 'Exemptions',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Overview of Alabama sales tax exemptions including prescription drugs, agricultural items, and government sales.',
    url: 'https://www.revenue.alabama.gov/tax-incentives/sales-use-tax/',
    relatedTopics: ['Exemptions', 'Tax-exempt', 'Agriculture', 'Government'],
  },
  {
    id: 'al-one-spot',
    number: 'ADOR-ST-009',
    title: 'ONE SPOT Filing System',
    category: 'Filing',
    publishedDate: '2013-10-01',
    lastUpdated: '2024-01-01',
    summary: 'Information about filing state and local taxes through the ONE SPOT system in My Alabama Taxes.',
    url: 'https://www.revenue.alabama.gov/sales-use/one-spot/',
    relatedTopics: ['ONE SPOT', 'Filing', 'Local taxes', 'My Alabama Taxes'],
  },
  {
    id: 'al-local-taxes',
    number: 'ADOR-ST-010',
    title: 'Non-State Administered Local Taxes',
    category: 'Local Taxes',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Information about self-administered localities and how to file/pay their taxes.',
    url: 'https://www.revenue.alabama.gov/sales-use/non-state-administered-localities/',
    relatedTopics: ['Local taxes', 'Self-administered', 'Cities', 'Counties'],
  },
  {
    id: 'al-tax-holiday',
    number: 'ADOR-ST-011',
    title: 'Back-to-School Sales Tax Holiday',
    category: 'Tax Holidays',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Annual tax-free weekend for clothing, school supplies, and computers.',
    url: 'https://www.revenue.alabama.gov/',
    relatedTopics: ['Tax holiday', 'Back-to-school', 'Clothing', 'School supplies'],
  },
  {
    id: 'al-auto-tax',
    number: 'ADOR-ST-012',
    title: 'Automobile Sales Tax',
    category: 'Automotive',
    publishedDate: '2024-01-01',
    lastUpdated: '2024-01-01',
    summary: 'Special 2% state rate on automobile sales plus local taxes and registration fees.',
    url: 'https://www.revenue.alabama.gov/sales-use/tax-rates/',
    relatedTopics: ['Automobile', 'Vehicle', 'Motor vehicle', '2% rate'],
  },
];

export function searchALResources(query: string): TechnicalBulletin[] {
  const lowerQuery = query.toLowerCase();
  return AL_RESOURCES.filter(tb =>
    tb.title.toLowerCase().includes(lowerQuery) ||
    tb.summary.toLowerCase().includes(lowerQuery) ||
    tb.category.toLowerCase().includes(lowerQuery) ||
    tb.relatedTopics.some(t => t.toLowerCase().includes(lowerQuery)) ||
    tb.number.toLowerCase().includes(lowerQuery)
  );
}

export function getALResourcesByCategory(category: string): TechnicalBulletin[] {
  return AL_RESOURCES.filter(tb => tb.category === category);
}
