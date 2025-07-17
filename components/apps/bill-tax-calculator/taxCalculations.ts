// Enhanced Tax calculation logic based on "The One Big Beautiful Bill Act of 2025"
// Federal income tax calculations with updated rates and provisions

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface FilingStatus {
  single: TaxBracket[];
  marriedJoint: TaxBracket[];
  marriedSeparate: TaxBracket[];
  headOfHousehold: TaxBracket[];
}

export interface StandardDeductions {
  single: number;
  marriedJoint: number;
  marriedSeparate: number;
  headOfHousehold: number;
  seniorSingle?: number;
  seniorMarriedJoint?: number;
}

export interface StateInfo {
  name: string;
  code: string;
  hasIncomeTax: boolean;
  taxType: 'none' | 'flat' | 'progressive';
  flatRate?: number;
  brackets?: TaxBracket[];
  standardDeduction?: number;
  noTaxUpTo?: number;
  additionalInfo?: string;
}

// 2025 Federal Tax Brackets (7 brackets with 37% top rate)
export const FEDERAL_TAX_BRACKETS: FilingStatus = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  marriedJoint: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ],
  marriedSeparate: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 }
  ]
};

// Standard Deductions for 2025 (One Big Beautiful Bill increases)
export const STANDARD_DEDUCTIONS: StandardDeductions = {
  single: 15750,
  marriedJoint: 31500,
  marriedSeparate: 15750,
  headOfHousehold: 23625,
  // Temporary increases for 2025-2028
  seniorSingle: 19750, // Base + $4000 senior deduction
  seniorMarriedJoint: 43500 // Base + $12000 ($6000 each spouse if both 65+)
};

// SALT Deduction Cap (increased under One Big Beautiful Bill)
export const SALT_CAP_2025 = 40000; // Increased from $10,000

// QBI Deduction Rate (made permanent at 20%)
export const QBI_DEDUCTION_RATE = 0.20;

// Child Tax Credit (increased to $2,200)
export const CHILD_TAX_CREDIT = 2200;
export const REFUNDABLE_CHILD_TAX_CREDIT = 1400;

// Comprehensive State tax information for all 50 states + DC
export const STATE_TAX_INFO: StateInfo[] = [
  {
    name: "Alabama",
    code: "AL",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 500, rate: 0.02 },
      { min: 500, max: 3000, rate: 0.04 },
      { min: 3000, max: Infinity, rate: 0.05 }
    ],
    standardDeduction: 2500,
    additionalInfo: "Progressive tax with 3 brackets"
  },
  {
    name: "Alaska",
    code: "AK",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Alaska Permanent Fund Dividend available to residents"
  },
  {
    name: "Arizona",
    code: "AZ",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.025,
    standardDeduction: 13850,
    additionalInfo: "Flat tax rate of 2.5% (effective 2021)"
  },
  {
    name: "Arkansas",
    code: "AR",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 4300, rate: 0.02 },
      { min: 4300, max: 8500, rate: 0.04 },
      { min: 8500, max: 12900, rate: 0.059 }
    ],
    standardDeduction: 2340,
    additionalInfo: "Progressive tax with rates from 2% to 5.9%"
  },
  {
    name: "California",
    code: "CA",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10099, max: 23942, rate: 0.02 },
      { min: 23942, max: 37788, rate: 0.04 },
      { min: 37788, max: 52455, rate: 0.06 },
      { min: 52455, max: 66295, rate: 0.08 },
      { min: 66295, max: 338639, rate: 0.093 },
      { min: 338639, max: 406364, rate: 0.103 },
      { min: 406364, max: 677278, rate: 0.113 },
      { min: 677278, max: Infinity, rate: 0.133 }
    ],
    standardDeduction: 5202,
    additionalInfo: "Highest state income tax rates in US, up to 13.3%"
  },
  {
    name: "Colorado",
    code: "CO",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.044,
    standardDeduction: 13850,
    additionalInfo: "Flat tax rate of 4.4%"
  },
  {
    name: "Connecticut",
    code: "CT",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 10000, rate: 0.03 },
      { min: 10000, max: 50000, rate: 0.05 },
      { min: 50000, max: 100000, rate: 0.055 },
      { min: 100000, max: 200000, rate: 0.06 },
      { min: 200000, max: 250000, rate: 0.065 },
      { min: 250000, max: 500000, rate: 0.069 },
      { min: 500000, max: Infinity, rate: 0.0699 }
    ],
    standardDeduction: 15000,
    additionalInfo: "Progressive tax with top rate of 6.99%"
  },
  {
    name: "Delaware",
    code: "DE",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 2000, rate: 0.0 },
      { min: 2000, max: 5000, rate: 0.022 },
      { min: 5000, max: 10000, rate: 0.039 },
      { min: 10000, max: 20000, rate: 0.048 },
      { min: 20000, max: 25000, rate: 0.052 },
      { min: 25000, max: 60000, rate: 0.0555 },
      { min: 60000, max: Infinity, rate: 0.066 }
    ],
    standardDeduction: 3250,
    additionalInfo: "Progressive tax with rates from 0% to 6.6%"
  },
  {
    name: "Florida",
    code: "FL",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Primary revenue from sales tax and tourism"
  },
  {
    name: "Georgia",
    code: "GA",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 750, rate: 0.01 },
      { min: 750, max: 2250, rate: 0.02 },
      { min: 2250, max: 3750, rate: 0.03 },
      { min: 3750, max: 5250, rate: 0.04 },
      { min: 5250, max: 7000, rate: 0.05 },
      { min: 7000, max: Infinity, rate: 0.0575 }
    ],
    standardDeduction: 4600,
    additionalInfo: "Progressive tax with top rate of 5.75%"
  },
  {
    name: "Hawaii",
    code: "HI",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.10 },
      { min: 200000, max: Infinity, rate: 0.11 }
    ],
    standardDeduction: 2200,
    additionalInfo: "Most tax brackets in US, up to 11%"
  },
  {
    name: "Idaho",
    code: "ID",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 1568, rate: 0.01 },
      { min: 1568, max: 3136, rate: 0.03 },
      { min: 3136, max: 4704, rate: 0.045 },
      { min: 4704, max: 6272, rate: 0.055 },
      { min: 6272, max: Infinity, rate: 0.058 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 5.8%"
  },
  {
    name: "Illinois",
    code: "IL",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0495,
    standardDeduction: 2775,
    additionalInfo: "Flat tax rate of 4.95%"
  },
  {
    name: "Indiana",
    code: "IN",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0323,
    standardDeduction: 1000,
    additionalInfo: "Flat tax rate of 3.23%"
  },
  {
    name: "Iowa",
    code: "IA",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 1743, rate: 0.0033 },
      { min: 1743, max: 4358, rate: 0.0067 },
      { min: 4358, max: 8716, rate: 0.0225 },
      { min: 8716, max: 19346, rate: 0.0414 },
      { min: 19346, max: 32308, rate: 0.0563 },
      { min: 32308, max: 48461, rate: 0.0596 },
      { min: 48461, max: 72693, rate: 0.0625 },
      { min: 72693, max: Infinity, rate: 0.084 }
    ],
    standardDeduction: 2130,
    additionalInfo: "Progressive tax with top rate of 8.4%"
  },
  {
    name: "Kansas",
    code: "KS",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 }
    ],
    standardDeduction: 3500,
    additionalInfo: "Progressive tax with top rate of 5.7%"
  },
  {
    name: "Kentucky",
    code: "KY",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.05,
    standardDeduction: 2950,
    additionalInfo: "Flat tax rate of 5.0%"
  },
  {
    name: "Louisiana",
    code: "LA",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 12500, rate: 0.02 },
      { min: 12500, max: 50000, rate: 0.04 },
      { min: 50000, max: Infinity, rate: 0.06 }
    ],
    standardDeduction: 4500,
    additionalInfo: "Progressive tax with top rate of 6.0%"
  },
  {
    name: "Maine",
    code: "ME",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 24500, rate: 0.058 },
      { min: 24500, max: 58050, rate: 0.0675 },
      { min: 58050, max: Infinity, rate: 0.0715 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 7.15%"
  },
  {
    name: "Maryland",
    code: "MD",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 }
    ],
    standardDeduction: 2400,
    additionalInfo: "Progressive tax with top rate of 5.75%"
  },
  {
    name: "Massachusetts",
    code: "MA",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.05,
    standardDeduction: 4400,
    additionalInfo: "Flat tax rate of 5.0%"
  },
  {
    name: "Michigan",
    code: "MI",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0425,
    standardDeduction: 5100,
    additionalInfo: "Flat tax rate of 4.25%"
  },
  {
    name: "Minnesota",
    code: "MN",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 29458, rate: 0.0535 },
      { min: 29458, max: 97069, rate: 0.068 },
      { min: 97069, max: 177120, rate: 0.0785 },
      { min: 177120, max: Infinity, rate: 0.0985 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 9.85%"
  },
  {
    name: "Mississippi",
    code: "MS",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 5000, rate: 0.0 },
      { min: 5000, max: 10000, rate: 0.04 },
      { min: 10000, max: Infinity, rate: 0.05 }
    ],
    standardDeduction: 2300,
    additionalInfo: "Progressive tax with top rate of 5.0%"
  },
  {
    name: "Missouri",
    code: "MO",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 1121, rate: 0.015 },
      { min: 1121, max: 2242, rate: 0.02 },
      { min: 2242, max: 3363, rate: 0.025 },
      { min: 3363, max: 4484, rate: 0.03 },
      { min: 4484, max: 5605, rate: 0.035 },
      { min: 5605, max: 6726, rate: 0.04 },
      { min: 6726, max: 7847, rate: 0.045 },
      { min: 7847, max: 8968, rate: 0.05 },
      { min: 8968, max: Infinity, rate: 0.054 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 5.4%"
  },
  {
    name: "Montana",
    code: "MT",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 3100, rate: 0.01 },
      { min: 3100, max: 5500, rate: 0.02 },
      { min: 5500, max: 8400, rate: 0.03 },
      { min: 8400, max: 11300, rate: 0.04 },
      { min: 11300, max: 14500, rate: 0.05 },
      { min: 14500, max: 18700, rate: 0.06 },
      { min: 18700, max: Infinity, rate: 0.0675 }
    ],
    standardDeduction: 5040,
    additionalInfo: "Progressive tax with top rate of 6.75%"
  },
  {
    name: "Nebraska",
    code: "NE",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 3700, rate: 0.0246 },
      { min: 3700, max: 22170, rate: 0.0351 },
      { min: 22170, max: 35730, rate: 0.0501 },
      { min: 35730, max: Infinity, rate: 0.0684 }
    ],
    standardDeduction: 7550,
    additionalInfo: "Progressive tax with top rate of 6.84%"
  },
  {
    name: "Nevada",
    code: "NV",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Revenue primarily from gaming and tourism"
  },
  {
    name: "New Hampshire",
    code: "NH",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No income tax on wages/salaries. 5% tax on dividends and interest over $2,400"
  },
  {
    name: "New Jersey",
    code: "NJ",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.0553 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 }
    ],
    standardDeduction: 1000,
    additionalInfo: "Progressive tax with top rate of 10.75%"
  },
  {
    name: "New Mexico",
    code: "NM",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 5500, rate: 0.017 },
      { min: 5500, max: 11000, rate: 0.032 },
      { min: 11000, max: 16000, rate: 0.047 },
      { min: 16000, max: 210000, rate: 0.049 },
      { min: 210000, max: Infinity, rate: 0.059 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 5.9%"
  },
  {
    name: "New York",
    code: "NY",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.055 },
      { min: 80650, max: 215400, rate: 0.06 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 }
    ],
    standardDeduction: 8000,
    additionalInfo: "Progressive tax with top rate of 10.9%"
  },
  {
    name: "North Carolina",
    code: "NC",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0499,
    standardDeduction: 12750,
    additionalInfo: "Flat tax rate of 4.99%"
  },
  {
    name: "North Dakota",
    code: "ND",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.029,
    standardDeduction: 13850,
    additionalInfo: "Flat tax rate of 2.9%"
  },
  {
    name: "Ohio",
    code: "OH",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 26050, rate: 0.0 },
      { min: 26050, max: 46100, rate: 0.02765 },
      { min: 46100, max: 92150, rate: 0.03226 },
      { min: 92150, max: 115300, rate: 0.03688 },
      { min: 115300, max: Infinity, rate: 0.0399 }
    ],
    standardDeduction: 2400,
    additionalInfo: "Progressive tax with top rate of 3.99%"
  },
  {
    name: "Oklahoma",
    code: "OK",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 1000, rate: 0.0025 },
      { min: 1000, max: 2500, rate: 0.0075 },
      { min: 2500, max: 3750, rate: 0.0175 },
      { min: 3750, max: 4900, rate: 0.0275 },
      { min: 4900, max: 7200, rate: 0.0375 },
      { min: 7200, max: Infinity, rate: 0.05 }
    ],
    standardDeduction: 6350,
    additionalInfo: "Progressive tax with top rate of 5.0%"
  },
  {
    name: "Oregon",
    code: "OR",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 4050, rate: 0.0475 },
      { min: 4050, max: 10200, rate: 0.0675 },
      { min: 10200, max: 25500, rate: 0.0875 },
      { min: 25500, max: 63900, rate: 0.099 },
      { min: 63900, max: Infinity, rate: 0.099 }
    ],
    standardDeduction: 2605,
    additionalInfo: "Progressive tax with top rate of 9.9%"
  },
  {
    name: "Pennsylvania",
    code: "PA",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0307,
    standardDeduction: 0,
    additionalInfo: "Flat tax rate of 3.07%"
  },
  {
    name: "Rhode Island",
    code: "RI",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 73450, rate: 0.0375 },
      { min: 73450, max: 166950, rate: 0.0475 },
      { min: 166950, max: Infinity, rate: 0.0599 }
    ],
    standardDeduction: 9750,
    additionalInfo: "Progressive tax with top rate of 5.99%"
  },
  {
    name: "South Carolina",
    code: "SC",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 3200, rate: 0.0 },
      { min: 3200, max: 6400, rate: 0.03 },
      { min: 6400, max: 9600, rate: 0.04 },
      { min: 9600, max: 12800, rate: 0.05 },
      { min: 12800, max: 16000, rate: 0.06 },
      { min: 16000, max: Infinity, rate: 0.07 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 7.0%"
  },
  {
    name: "South Dakota",
    code: "SD",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Revenue from sales tax and tourism"
  },
  {
    name: "Tennessee",
    code: "TN",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No income tax on wages/salaries. Previously taxed dividends and interest (repealed)"
  },
  {
    name: "Texas",
    code: "TX",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Revenue from sales tax, property tax, and business taxes"
  },
  {
    name: "Utah",
    code: "UT",
    hasIncomeTax: true,
    taxType: "flat",
    flatRate: 0.0485,
    standardDeduction: 13850,
    additionalInfo: "Flat tax rate of 4.85%"
  },
  {
    name: "Vermont",
    code: "VT",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 45400, rate: 0.0335 },
      { min: 45400, max: 110050, rate: 0.066 },
      { min: 110050, max: 229550, rate: 0.076 },
      { min: 229550, max: Infinity, rate: 0.0875 }
    ],
    standardDeduction: 7100,
    additionalInfo: "Progressive tax with top rate of 8.75%"
  },
  {
    name: "Virginia",
    code: "VA",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 }
    ],
    standardDeduction: 4500,
    additionalInfo: "Progressive tax with top rate of 5.75%"
  },
  {
    name: "Washington",
    code: "WA",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. 7% capital gains tax on high earners (>$250k)"
  },
  {
    name: "West Virginia",
    code: "WV",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 10000, rate: 0.03 },
      { min: 10000, max: 25000, rate: 0.04 },
      { min: 25000, max: 40000, rate: 0.045 },
      { min: 40000, max: 60000, rate: 0.06 },
      { min: 60000, max: Infinity, rate: 0.065 }
    ],
    standardDeduction: 2000,
    additionalInfo: "Progressive tax with top rate of 6.5%"
  },
  {
    name: "Wisconsin",
    code: "WI",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 13810, rate: 0.0354 },
      { min: 13810, max: 27630, rate: 0.0465 },
      { min: 27630, max: 304170, rate: 0.0627 },
      { min: 304170, max: Infinity, rate: 0.0765 }
    ],
    standardDeduction: 12760,
    additionalInfo: "Progressive tax with top rate of 7.65%"
  },
  {
    name: "Wyoming",
    code: "WY",
    hasIncomeTax: false,
    taxType: "none",
    additionalInfo: "No state income tax. Revenue from mineral extraction and tourism"
  },
  {
    name: "District of Columbia",
    code: "DC",
    hasIncomeTax: true,
    taxType: "progressive",
    brackets: [
      { min: 0, max: 10000, rate: 0.04 },
      { min: 10000, max: 40000, rate: 0.06 },
      { min: 40000, max: 60000, rate: 0.065 },
      { min: 60000, max: 350000, rate: 0.085 },
      { min: 350000, max: 1000000, rate: 0.0925 },
      { min: 1000000, max: Infinity, rate: 0.1075 }
    ],
    standardDeduction: 13850,
    additionalInfo: "Progressive tax with top rate of 10.75%"
  }
];

export interface TaxInputs {
  grossIncome: number;
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';
  state: string;
  age: number;
  spouseAge?: number;
  children: number;
  itemizedDeductions: number;
  saltDeductions: number;
  businessIncome: number; // For QBI deduction
  tips: number; // For tips deduction (2025-2028)
  overtime: number; // For overtime deduction (2025-2028)
}

export interface TaxResults {
  grossIncome: number;
  adjustedGrossIncome: number;
  standardDeduction: number;
  itemizedDeductions: number;
  deductionUsed: number;
  taxableIncome: number;
  federalIncomeTax: number;
  stateIncomeTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  afterTaxIncome: number;
  childTaxCredit: number;
  qbiDeduction: number;
  tipsDeduction: number;
  overtimeDeduction: number;
  saltDeduction: number;
  stateInfo: StateInfo;
}

export function calculateFederalTax(income: number, filingStatus: keyof FilingStatus): number {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let tax = 0;
  
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    
    const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min;
    tax += taxableInThisBracket * bracket.rate;
  }
  
  return Math.max(0, tax);
}

export function calculateStateIncomeTax(income: number, stateCode: string): number {
  const state = STATE_TAX_INFO.find(s => s.code === stateCode);
  
  if (!state || !state.hasIncomeTax) {
    return 0;
  }
  
  if (state.taxType === 'flat' && state.flatRate) {
    const deduction = state.standardDeduction || 0;
    const taxableIncome = Math.max(0, income - deduction);
    return taxableIncome * state.flatRate;
  }
  
  if (state.taxType === 'progressive' && state.brackets) {
    const deduction = state.standardDeduction || 0;
    const taxableIncome = Math.max(0, income - deduction);
    let tax = 0;
    
    for (const bracket of state.brackets) {
      if (taxableIncome <= bracket.min) break;
      
      const taxableInThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInThisBracket * bracket.rate;
    }
    
    return Math.max(0, tax);
  }
  
  return 0;
}

export function getStandardDeduction(
  filingStatus: keyof FilingStatus, 
  age: number, 
  spouseAge?: number
): number {
  const baseDeduction = STANDARD_DEDUCTIONS[filingStatus];
  
  // Add senior deduction if 65 or older (temporary 2025-2028)
  if (age >= 65) {
    if (filingStatus === 'marriedJoint' && spouseAge && spouseAge >= 65) {
      return STANDARD_DEDUCTIONS.seniorMarriedJoint || baseDeduction;
    } else if (filingStatus === 'single') {
      return STANDARD_DEDUCTIONS.seniorSingle || baseDeduction;
    }
  }
  
  return baseDeduction;
}

export function calculateQBIDeduction(businessIncome: number, taxableIncome: number): number {
  // Simplified QBI calculation - 20% of qualified business income
  // Subject to limitations based on taxable income
  const qbiAmount = businessIncome * QBI_DEDUCTION_RATE;
  const incomeLimit = taxableIncome * 0.2; // 20% of taxable income limit
  
  return Math.min(qbiAmount, incomeLimit);
}

export function calculateTipsDeduction(tips: number, income: number): number {
  // Tips deduction for 2025-2028, income under $160,000
  if (income > 160000) return 0;
  return tips; // Full deduction for qualifying tips
}

export function calculateOvertimeDeduction(overtime: number, income: number, filingStatus: keyof FilingStatus): number {
  // Overtime deduction for 2025-2028
  const cap = filingStatus === 'marriedJoint' ? 25000 : 12500;
  const phaseoutStart = filingStatus === 'marriedJoint' ? 300000 : 150000;
  
  if (income > phaseoutStart) return 0;
  
  return Math.min(overtime, cap);
}

export function calculateChildTaxCredit(children: number, income: number): number {
  // $2,200 per child, with phase-out at higher incomes
  // Simplified - actual phase-out is more complex
  const creditPerChild = CHILD_TAX_CREDIT;
  const totalCredit = children * creditPerChild;
  
  // Phase-out starts at higher incomes
  const phaseoutStart = 400000; // Simplified threshold
  if (income > phaseoutStart) {
    const reduction = Math.floor((income - phaseoutStart) / 1000) * 50;
    return Math.max(0, totalCredit - reduction);
  }
  
  return totalCredit;
}

export function calculateTaxes(inputs: TaxInputs): TaxResults {
  const {
    grossIncome,
    filingStatus,
    state,
    age,
    spouseAge,
    children,
    itemizedDeductions,
    saltDeductions,
    businessIncome,
    tips,
    overtime
  } = inputs;

  // Find state information
  const stateInfo = STATE_TAX_INFO.find(s => s.code === state) || STATE_TAX_INFO[0];

  // Calculate above-the-line deductions
  const tipsDeduction = calculateTipsDeduction(tips, grossIncome);
  const overtimeDeduction = calculateOvertimeDeduction(overtime, grossIncome, filingStatus);
  const qbiDeduction = calculateQBIDeduction(businessIncome, grossIncome);
  
  // Adjusted Gross Income
  const adjustedGrossIncome = Math.max(0, grossIncome - tipsDeduction - overtimeDeduction);
  
  // Standard vs Itemized Deductions
  const standardDeduction = getStandardDeduction(filingStatus, age, spouseAge);
  const saltDeduction = Math.min(saltDeductions, SALT_CAP_2025); // Apply SALT cap
  const totalItemized = itemizedDeductions + saltDeduction;
  const deductionUsed = Math.max(standardDeduction, totalItemized);
  
  // Taxable Income
  const taxableIncomeBeforeQBI = Math.max(0, adjustedGrossIncome - deductionUsed);
  const taxableIncome = Math.max(0, taxableIncomeBeforeQBI - qbiDeduction);
  
  // Calculate taxes
  const federalIncomeTax = calculateFederalTax(taxableIncome, filingStatus);
  const stateIncomeTax = calculateStateIncomeTax(adjustedGrossIncome, state);
  
  // Credits
  const childTaxCredit = calculateChildTaxCredit(children, adjustedGrossIncome);
  const netFederalTax = Math.max(0, federalIncomeTax - childTaxCredit);
  
  const totalTax = netFederalTax + stateIncomeTax;
  const afterTaxIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  
  // Calculate marginal rate
  const marginalRate = calculateMarginalRate(taxableIncome, filingStatus, state);
  
  return {
    grossIncome,
    adjustedGrossIncome,
    standardDeduction,
    itemizedDeductions: totalItemized,
    deductionUsed,
    taxableIncome,
    federalIncomeTax: netFederalTax,
    stateIncomeTax,
    totalTax,
    effectiveRate,
    marginalRate,
    afterTaxIncome,
    childTaxCredit,
    qbiDeduction,
    tipsDeduction,
    overtimeDeduction,
    saltDeduction,
    stateInfo
  };
}

function calculateMarginalRate(income: number, filingStatus: keyof FilingStatus, stateCode: string): number {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let federalMarginalRate = 0;
  
  for (const bracket of brackets) {
    if (income > bracket.min && income <= bracket.max) {
      federalMarginalRate = bracket.rate;
      break;
    }
  }
  
  const state = STATE_TAX_INFO.find(s => s.code === stateCode);
  let stateMarginalRate = 0;
  
  if (state?.hasIncomeTax) {
    if (state.taxType === 'flat' && state.flatRate) {
      stateMarginalRate = state.flatRate;
    } else if (state.taxType === 'progressive' && state.brackets) {
      for (const bracket of state.brackets) {
        if (income > bracket.min && income <= bracket.max) {
          stateMarginalRate = bracket.rate;
          break;
        }
      }
    }
  }
  
  return (federalMarginalRate + stateMarginalRate) * 100;
}