import { FilingRequirement, ComplianceEvent, NexusThreshold, TechnicalBulletin } from '@/types/sales-tax';

export const NY_FILING_REQUIREMENTS: FilingRequirement[] = [
  {
    id: 'monthly',
    frequency: 'monthly',
    threshold: {
      min: 300000,
    },
    form: 'ST-809',
    dueDay: 20,
    electronicRequired: true,
    description: 'Vendors with annual taxable sales over $300,000 must file monthly using Form ST-809.',
  },
  {
    id: 'quarterly',
    frequency: 'quarterly',
    threshold: {
      min: 3000,
      max: 300000,
    },
    form: 'ST-100',
    dueDay: 20,
    electronicRequired: false,
    description: 'Vendors with annual taxable sales between $3,000 and $300,000 file quarterly using Form ST-100.',
  },
  {
    id: 'annual',
    frequency: 'annual',
    threshold: {
      min: 0,
      max: 3000,
    },
    form: 'ST-101',
    dueDay: 20,
    electronicRequired: false,
    description: 'Vendors with annual taxable sales under $3,000 may file annually using Form ST-101.',
  },
];

export const NY_NEXUS: NexusThreshold = {
  type: 'economic',
  salesThreshold: 500000,
  transactionThreshold: 100,
  logic: 'AND',
  lookbackPeriod: 'Previous four quarters',
  description: 'Remote sellers must collect NY sales tax if they have more than $500,000 in NY sales AND more than 100 transactions to NY customers in the previous four quarters.',
};

// Generate compliance events for the current year
export function generateComplianceCalendar(year: number): ComplianceEvent[] {
  const events: ComplianceEvent[] = [];

  // Quarterly filing due dates (20th of month following quarter end)
  const quarterlyDates = [
    { quarter: 'Q1', dueDate: `${year}-04-20`, period: 'Mar 1 - May 31' },
    { quarter: 'Q2', dueDate: `${year}-06-20`, period: 'Jun 1 - Aug 31' },
    { quarter: 'Q3', dueDate: `${year}-09-20`, period: 'Sep 1 - Nov 30' },
    { quarter: 'Q4', dueDate: `${year + 1}-03-20`, period: 'Dec 1 - Feb 28/29' },
  ];

  quarterlyDates.forEach((q, index) => {
    events.push({
      id: `quarterly-filing-${year}-${index + 1}`,
      title: `${q.quarter} ${year} Sales Tax Return Due`,
      type: 'filing',
      dueDate: q.dueDate,
      jurisdiction: 'NY',
      form: 'ST-100',
      description: `Quarterly sales tax return for ${q.period}. File Form ST-100 or ST-101.`,
      priority: 'high',
    });
  });

  // Monthly filing due dates for larger vendors
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
      title: `${month} ${year} Monthly Sales Tax Due`,
      type: 'filing',
      dueDate: dueDate,
      jurisdiction: 'NY',
      form: 'ST-809',
      description: `Monthly sales tax return for ${month} ${year}. Required for vendors with annual sales over $300,000.`,
      priority: 'medium',
    });
  });

  // Annual filing
  events.push({
    id: `annual-filing-${year}`,
    title: `${year} Annual Sales Tax Return Due`,
    type: 'filing',
    dueDate: `${year + 1}-03-20`,
    jurisdiction: 'NY',
    form: 'ST-101',
    description: `Annual sales tax return for calendar year ${year}. For vendors with annual sales under $3,000.`,
    priority: 'high',
  });

  // Registration deadlines
  events.push({
    id: `registration-reminder-${year}`,
    title: 'Certificate of Authority Renewal Check',
    type: 'registration',
    dueDate: `${year}-01-01`,
    jurisdiction: 'NY',
    description: 'Verify your Certificate of Authority is current and update business information if needed.',
    priority: 'medium',
  });

  return events.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export const NY_TECHNICAL_BULLETINS: TechnicalBulletin[] = [
  {
    id: 'tb-st-530',
    number: 'TB-ST-530',
    title: 'Clothing and Footwear Exemption',
    category: 'Exemptions',
    publishedDate: '2011-03-17',
    lastUpdated: '2023-09-15',
    summary: 'Explains the exemption for clothing and footwear items sold for less than $110 per item.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/clothing_and_footwear.htm',
    relatedTopics: ['Clothing', 'Footwear', 'Exemptions', '$110 threshold'],
  },
  {
    id: 'tb-st-283',
    number: 'TB-ST-283',
    title: 'Food Sold by Food Stores',
    category: 'Food & Beverages',
    publishedDate: '2010-06-09',
    lastUpdated: '2022-11-01',
    summary: 'Describes the exemption for food and food products sold for human consumption.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/food_sold_by_food_stores.htm',
    relatedTopics: ['Food', 'Groceries', 'Exemptions', 'Prepared food'],
  },
  {
    id: 'tb-st-806',
    number: 'TB-ST-806',
    title: 'Food Sold by Restaurants, Taverns, and Similar Establishments',
    category: 'Food & Beverages',
    publishedDate: '2010-06-09',
    lastUpdated: '2023-03-20',
    summary: 'Explains sales tax on food and beverages sold at restaurants and similar establishments.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/food_sold_by_restaurants.htm',
    relatedTopics: ['Restaurants', 'Prepared food', 'Catering'],
  },
  {
    id: 'tb-st-128',
    number: 'TB-ST-128',
    title: 'Computer Software',
    category: 'Digital Products',
    publishedDate: '2008-12-15',
    lastUpdated: '2024-01-10',
    summary: 'Describes the taxability of pre-written and custom computer software.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/computer_software.htm',
    relatedTopics: ['Software', 'SaaS', 'Digital downloads', 'Custom software'],
  },
  {
    id: 'tb-st-193',
    number: 'TB-ST-193',
    title: 'Drugs and Medicines',
    category: 'Medical & Health',
    publishedDate: '2010-09-17',
    lastUpdated: '2023-06-01',
    summary: 'Explains exemptions for prescription and over-the-counter drugs and medicines.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/drugs_and_medicines.htm',
    relatedTopics: ['Prescription drugs', 'OTC medications', 'Medical equipment'],
  },
  {
    id: 'tb-st-875',
    number: 'TB-ST-875',
    title: 'Taxable and Exempt Services',
    category: 'Services',
    publishedDate: '2013-03-25',
    lastUpdated: '2024-02-15',
    summary: 'Overview of services that are taxable versus those that are exempt in NY.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/taxable_and_exempt_services.htm',
    relatedTopics: ['Services', 'Repair services', 'Professional services'],
  },
  {
    id: 'tb-st-765',
    number: 'TB-ST-765',
    title: 'Soft Drinks',
    category: 'Food & Beverages',
    publishedDate: '2010-12-09',
    lastUpdated: '2022-08-10',
    summary: 'Defines soft drinks and explains their taxable status.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/soft_drinks.htm',
    relatedTopics: ['Soft drinks', 'Beverages', 'Juice'],
  },
  {
    id: 'tb-st-103',
    number: 'TB-ST-103',
    title: 'Candy and Confectionery',
    category: 'Food & Beverages',
    publishedDate: '2010-09-01',
    lastUpdated: '2021-05-15',
    summary: 'Explains the definition and taxability of candy and confectionery items.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/candy_and_confectionery.htm',
    relatedTopics: ['Candy', 'Confectionery', 'Snacks'],
  },
  {
    id: 'tb-st-740',
    number: 'TB-ST-740',
    title: 'Resale Exemption',
    category: 'Exemptions',
    publishedDate: '2011-06-17',
    lastUpdated: '2023-12-01',
    summary: 'Explains exemption certificates and purchases for resale.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/resale_exemption.htm',
    relatedTopics: ['Resale', 'Exemption certificates', 'ST-120'],
  },
  {
    id: 'tb-st-176',
    number: 'TB-ST-176',
    title: 'Manufacturing Equipment Exemption',
    category: 'Manufacturing',
    publishedDate: '2010-03-01',
    lastUpdated: '2024-01-20',
    summary: 'Explains the exemption for machinery and equipment used in manufacturing.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/manufacturing_equipment.htm',
    relatedTopics: ['Manufacturing', 'Equipment', 'Production'],
  },
  {
    id: 'tb-st-860',
    number: 'TB-ST-860',
    title: 'Sales and Use Tax Rates',
    category: 'Rates',
    publishedDate: '2008-06-01',
    lastUpdated: '2024-03-01',
    summary: 'Overview of NY state and local sales tax rates including MCTD.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/sales_tax_rates.htm',
    relatedTopics: ['Tax rates', 'Local taxes', 'MCTD'],
  },
  {
    id: 'tb-st-220',
    number: 'TB-ST-220',
    title: 'Economic Nexus',
    category: 'Nexus',
    publishedDate: '2019-06-01',
    lastUpdated: '2024-01-15',
    summary: 'Explains economic nexus thresholds for remote sellers in NY.',
    url: 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/economic_nexus.htm',
    relatedTopics: ['Nexus', 'Remote sellers', 'Economic presence'],
  },
];

export function searchBulletins(query: string): TechnicalBulletin[] {
  const lowerQuery = query.toLowerCase();
  return NY_TECHNICAL_BULLETINS.filter(tb =>
    tb.title.toLowerCase().includes(lowerQuery) ||
    tb.summary.toLowerCase().includes(lowerQuery) ||
    tb.category.toLowerCase().includes(lowerQuery) ||
    tb.relatedTopics.some(t => t.toLowerCase().includes(lowerQuery)) ||
    tb.number.toLowerCase().includes(lowerQuery)
  );
}

export function getBulletinsByCategory(category: string): TechnicalBulletin[] {
  return NY_TECHNICAL_BULLETINS.filter(tb => tb.category === category);
}
