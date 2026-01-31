import { Jurisdiction } from '@/types/sales-tax';

// Alabama Sales Tax Jurisdictions - Rate Table
// State rate: 4.0% (general), 2.0% (food/grocery as of Sept 1, 2025), 2.0% (auto), 1.5% (farm equip/mfg machinery)
// Local rates vary by city/county - over 200 different localities

export const AL_JURISDICTIONS: Jurisdiction[] = [
  // State Level
  {
    code: 'AL',
    name: 'Alabama State',
    level: 'state',
    stateRate: 4.0,
    localRate: 0,
    mctdRate: 0, // Alabama doesn't have MCTD equivalent
    combinedRate: 4.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Major Cities - Jefferson County
  {
    code: 'AL-BIRMINGHAM',
    name: 'Birmingham',
    level: 'city',
    parentCode: 'AL-JEFFERSON',
    stateRate: 4.0,
    localRate: 6.0, // 4% city + 2% county (general fund) + additional
    mctdRate: 0,
    combinedRate: 10.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35201', '35202', '35203', '35204', '35205', '35206', '35207', '35208', '35209', '35210', '35211', '35212', '35213', '35214', '35215', '35216', '35217', '35218', '35219', '35220', '35221', '35222', '35223', '35224', '35226', '35228', '35229', '35231', '35232', '35233', '35234', '35235', '35236', '35237', '35238', '35242', '35243', '35244', '35246', '35249', '35253', '35254', '35255', '35259', '35260', '35261', '35266', '35270', '35282', '35283', '35285', '35287', '35288', '35290', '35291', '35292', '35293', '35294', '35295', '35296', '35297', '35298'],
  },
  {
    code: 'AL-HOOVER',
    name: 'Hoover',
    level: 'city',
    parentCode: 'AL-JEFFERSON',
    stateRate: 4.0,
    localRate: 6.0,
    mctdRate: 0,
    combinedRate: 10.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35226', '35244'],
  },

  // Jefferson County (outside cities)
  {
    code: 'AL-JEFFERSON',
    name: 'Jefferson County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 3.0,
    mctdRate: 0,
    combinedRate: 7.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Montgomery
  {
    code: 'AL-MONTGOMERY-CITY',
    name: 'Montgomery',
    level: 'city',
    parentCode: 'AL-MONTGOMERY',
    stateRate: 4.0,
    localRate: 6.0, // 3.5% city + 2.5% county
    mctdRate: 0,
    combinedRate: 10.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36101', '36102', '36103', '36104', '36105', '36106', '36107', '36108', '36109', '36110', '36111', '36112', '36113', '36114', '36115', '36116', '36117', '36118', '36119', '36120', '36121', '36123', '36124', '36125', '36130', '36131', '36132', '36133', '36134', '36135', '36140', '36141', '36142'],
  },
  {
    code: 'AL-MONTGOMERY',
    name: 'Montgomery County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.5,
    mctdRate: 0,
    combinedRate: 6.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Huntsville / Madison County
  {
    code: 'AL-HUNTSVILLE',
    name: 'Huntsville',
    level: 'city',
    parentCode: 'AL-MADISON',
    stateRate: 4.0,
    localRate: 5.0, // 4.5% city + 0.5% county
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35801', '35802', '35803', '35804', '35805', '35806', '35807', '35808', '35809', '35810', '35811', '35812', '35813', '35814', '35815', '35816', '35824', '35893', '35894', '35895', '35896', '35897', '35898', '35899'],
  },
  {
    code: 'AL-MADISON',
    name: 'Madison County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 0.5,
    mctdRate: 0,
    combinedRate: 4.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Mobile
  {
    code: 'AL-MOBILE-CITY',
    name: 'Mobile',
    level: 'city',
    parentCode: 'AL-MOBILE',
    stateRate: 4.0,
    localRate: 5.0, // 4% city + 1% county
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36601', '36602', '36603', '36604', '36605', '36606', '36607', '36608', '36609', '36610', '36611', '36612', '36613', '36615', '36616', '36617', '36618', '36619', '36628', '36630', '36633', '36640', '36641', '36644', '36652', '36660', '36663', '36670', '36671', '36675', '36685', '36688', '36689', '36690', '36691', '36693', '36695'],
  },
  {
    code: 'AL-MOBILE',
    name: 'Mobile County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 1.0,
    mctdRate: 0,
    combinedRate: 5.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Tuscaloosa
  {
    code: 'AL-TUSCALOOSA-CITY',
    name: 'Tuscaloosa',
    level: 'city',
    parentCode: 'AL-TUSCALOOSA',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35401', '35402', '35403', '35404', '35405', '35406', '35407', '35485', '35486', '35487'],
  },
  {
    code: 'AL-TUSCALOOSA',
    name: 'Tuscaloosa County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Auburn / Lee County
  {
    code: 'AL-AUBURN',
    name: 'Auburn',
    level: 'city',
    parentCode: 'AL-LEE',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36830', '36831', '36832', '36849'],
  },
  {
    code: 'AL-LEE',
    name: 'Lee County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Dothan / Houston County
  {
    code: 'AL-DOTHAN',
    name: 'Dothan',
    level: 'city',
    parentCode: 'AL-HOUSTON',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36301', '36302', '36303', '36304', '36305'],
  },
  {
    code: 'AL-HOUSTON',
    name: 'Houston County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 1.5,
    mctdRate: 0,
    combinedRate: 5.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Decatur / Morgan County
  {
    code: 'AL-DECATUR',
    name: 'Decatur',
    level: 'city',
    parentCode: 'AL-MORGAN',
    stateRate: 4.0,
    localRate: 5.5,
    mctdRate: 0,
    combinedRate: 9.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35601', '35602', '35603', '35609'],
  },
  {
    code: 'AL-MORGAN',
    name: 'Morgan County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Florence / Lauderdale County
  {
    code: 'AL-FLORENCE',
    name: 'Florence',
    level: 'city',
    parentCode: 'AL-LAUDERDALE',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35630', '35631', '35632', '35633', '35634'],
  },
  {
    code: 'AL-LAUDERDALE',
    name: 'Lauderdale County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Gadsden / Etowah County
  {
    code: 'AL-GADSDEN',
    name: 'Gadsden',
    level: 'city',
    parentCode: 'AL-ETOWAH',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35901', '35902', '35903', '35904', '35905', '35906', '35907'],
  },
  {
    code: 'AL-ETOWAH',
    name: 'Etowah County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Arab - Highest combined rate in Alabama
  {
    code: 'AL-ARAB',
    name: 'Arab',
    level: 'city',
    parentCode: 'AL-MARSHALL',
    stateRate: 4.0,
    localRate: 8.5, // One of highest in the state
    mctdRate: 0,
    combinedRate: 12.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35016'],
  },
  {
    code: 'AL-MARSHALL',
    name: 'Marshall County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 3.0,
    mctdRate: 0,
    combinedRate: 7.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Baldwin County (Gulf Shores area)
  {
    code: 'AL-GULF-SHORES',
    name: 'Gulf Shores',
    level: 'city',
    parentCode: 'AL-BALDWIN',
    stateRate: 4.0,
    localRate: 6.0,
    mctdRate: 0,
    combinedRate: 10.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36542', '36547'],
  },
  {
    code: 'AL-BALDWIN',
    name: 'Baldwin County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.0,
    mctdRate: 0,
    combinedRate: 6.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Shelby County (fast-growing suburban county)
  {
    code: 'AL-ALABASTER',
    name: 'Alabaster',
    level: 'city',
    parentCode: 'AL-SHELBY',
    stateRate: 4.0,
    localRate: 5.0,
    mctdRate: 0,
    combinedRate: 9.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['35007', '35114', '35144'],
  },
  {
    code: 'AL-SHELBY',
    name: 'Shelby County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 1.0,
    mctdRate: 0,
    combinedRate: 5.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },

  // Calhoun County (Anniston area)
  {
    code: 'AL-ANNISTON',
    name: 'Anniston',
    level: 'city',
    parentCode: 'AL-CALHOUN',
    stateRate: 4.0,
    localRate: 6.0,
    mctdRate: 0,
    combinedRate: 10.0,
    inMCTD: false,
    effectiveDate: '2024-01-01',
    zipCodes: ['36201', '36202', '36203', '36204', '36205', '36206', '36207'],
  },
  {
    code: 'AL-CALHOUN',
    name: 'Calhoun County',
    level: 'county',
    parentCode: 'AL',
    stateRate: 4.0,
    localRate: 2.5,
    mctdRate: 0,
    combinedRate: 6.5,
    inMCTD: false,
    effectiveDate: '2024-01-01',
  },
];

// Special Alabama rates for different product categories
export const AL_SPECIAL_RATES = {
  general: 4.0,
  food: 2.0, // Reduced rate effective September 1, 2025
  automobile: 2.0,
  farmEquipment: 1.5,
  manufacturingMachinery: 1.5,
  vendingFood: 3.0,
  vendingOther: 4.0,
  ssut: 8.0, // Simplified Sellers Use Tax flat rate
};

// ZIP code to jurisdiction mapping
export const AL_ZIP_TO_JURISDICTION: Record<string, string> = {};

// Build the ZIP to jurisdiction map
AL_JURISDICTIONS.forEach(j => {
  if (j.zipCodes) {
    j.zipCodes.forEach(zip => {
      AL_ZIP_TO_JURISDICTION[zip] = j.code;
    });
  }
});

export function getALJurisdictionByZip(zipCode: string): Jurisdiction | null {
  const code = AL_ZIP_TO_JURISDICTION[zipCode];
  if (code) {
    return AL_JURISDICTIONS.find(j => j.code === code) || null;
  }
  // Default to state level if ZIP not found
  return AL_JURISDICTIONS.find(j => j.code === 'AL') || null;
}

export function getALJurisdictionByCode(code: string): Jurisdiction | null {
  return AL_JURISDICTIONS.find(j => j.code === code) || null;
}

export function getAllALCounties(): Jurisdiction[] {
  return AL_JURISDICTIONS.filter(j => j.level === 'county');
}

export function getAllALCities(): Jurisdiction[] {
  return AL_JURISDICTIONS.filter(j => j.level === 'city');
}
