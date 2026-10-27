// 2026 rates from CRA T4127 (January 2026, 122nd edition) and Revenu Québec.

export type Bracket = { min: number; max: number; rate: number };

export type Province = {
  name: string;
  abbr: string;
  slug: string;
  brackets: Bracket[];
  basicPersonal: number;
  color: string;
  surtax?: boolean;
  qpip?: boolean;
};

// Federal lowest rate is 14% for 2026 (cut from 15% effective July 1, 2025).
export const FEDERAL_BRACKETS: Bracket[] = [
  { min: 0,       max: 58523,   rate: 0.14  },
  { min: 58523,   max: 117045,  rate: 0.205 },
  { min: 117045,  max: 181440,  rate: 0.26  },
  { min: 181440,  max: 258482,  rate: 0.29  },
  { min: 258482,  max: Infinity,rate: 0.33  },
];
export const FEDERAL_CREDIT_RATE = 0.14;
export const FEDERAL_BPA = { max: 16452, min: 14829, phaseStart: 181440, phaseEnd: 258482 };
export const CANADA_EMPLOYMENT_AMOUNT = 1501;
export const QUEBEC_ABATEMENT = 0.165;
export const RRSP_DOLLAR_LIMIT = 33810;

export const PROVINCES: Record<string, Province> = {
  ON: {
    name: "Ontario",
    abbr: "ON",
    slug: "income tax calculator ontario",
    brackets: [
      { min: 0,       max: 53891,  rate: 0.0505 },
      { min: 53891,   max: 107785, rate: 0.0915 },
      { min: 107785,  max: 150000, rate: 0.1116 },
      { min: 150000,  max: 220000, rate: 0.1216 },
      { min: 220000,  max: Infinity,rate: 0.1316 },
    ],
    basicPersonal: 12989,
    surtax: true,
    color: "#c0392b",
  },
  BC: {
    name: "British Columbia",
    abbr: "BC",
    slug: "income tax calculator bc",
    brackets: [
      { min: 0,       max: 50363,  rate: 0.0506 },
      { min: 50363,   max: 100728, rate: 0.077  },
      { min: 100728,  max: 115648, rate: 0.105  },
      { min: 115648,  max: 140430, rate: 0.1229 },
      { min: 140430,  max: 190405, rate: 0.147  },
      { min: 190405,  max: 265545, rate: 0.168  },
      { min: 265545,  max: Infinity,rate: 0.205 },
    ],
    basicPersonal: 13216,
    color: "#2980b9",
  },
  AB: {
    name: "Alberta",
    abbr: "AB",
    slug: "income tax calculator alberta",
    brackets: [
      { min: 0,       max: 61200,  rate: 0.08   },
      { min: 61200,   max: 154259, rate: 0.10   },
      { min: 154259,  max: 185111, rate: 0.12   },
      { min: 185111,  max: 246813, rate: 0.13   },
      { min: 246813,  max: 370220, rate: 0.14   },
      { min: 370220,  max: Infinity,rate: 0.15  },
    ],
    basicPersonal: 22769,
    color: "#8e44ad",
  },
  QC: {
    name: "Quebec",
    abbr: "QC",
    slug: "income tax calculator quebec",
    brackets: [
      { min: 0,       max: 54345,  rate: 0.14   },
      { min: 54345,   max: 108680, rate: 0.19   },
      { min: 108680,  max: 132245, rate: 0.24   },
      { min: 132245,  max: Infinity,rate: 0.2575},
    ],
    basicPersonal: 18952,
    color: "#16a085",
    qpip: true,
  },
  MB: {
    name: "Manitoba",
    abbr: "MB",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 47000,  rate: 0.108  },
      { min: 47000,   max: 100000, rate: 0.1275 },
      { min: 100000,  max: Infinity,rate: 0.174 },
    ],
    basicPersonal: 15780,
    color: "#e67e22",
  },
  SK: {
    name: "Saskatchewan",
    abbr: "SK",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 54532,  rate: 0.105  },
      { min: 54532,   max: 155805, rate: 0.125  },
      { min: 155805,  max: Infinity,rate: 0.145 },
    ],
    basicPersonal: 20381,
    color: "#d35400",
  },
  NS: {
    name: "Nova Scotia",
    abbr: "NS",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 30995,  rate: 0.0879 },
      { min: 30995,   max: 61991,  rate: 0.1495 },
      { min: 61991,   max: 97417,  rate: 0.1667 },
      { min: 97417,   max: 157124, rate: 0.175  },
      { min: 157124,  max: Infinity,rate: 0.21  },
    ],
    basicPersonal: 11932,
    color: "#1abc9c",
  },
  NB: {
    name: "New Brunswick",
    abbr: "NB",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 52333,  rate: 0.094  },
      { min: 52333,   max: 104666, rate: 0.14   },
      { min: 104666,  max: 193861, rate: 0.16   },
      { min: 193861,  max: Infinity,rate: 0.195 },
    ],
    basicPersonal: 13664,
    color: "#f39c12",
  },
  NL: {
    name: "Newfoundland & Labrador",
    abbr: "NL",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 44678,   rate: 0.087  },
      { min: 44678,   max: 89354,   rate: 0.145  },
      { min: 89354,   max: 159528,  rate: 0.158  },
      { min: 159528,  max: 223340,  rate: 0.178  },
      { min: 223340,  max: 285319,  rate: 0.198  },
      { min: 285319,  max: 570638,  rate: 0.208  },
      { min: 570638,  max: 1141275, rate: 0.213  },
      { min: 1141275, max: Infinity,rate: 0.218  },
    ],
    basicPersonal: 11188,
    color: "#3498db",
  },
  PE: {
    name: "Prince Edward Island",
    abbr: "PE",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 33928,  rate: 0.095  },
      { min: 33928,   max: 65820,  rate: 0.1347 },
      { min: 65820,   max: 106890, rate: 0.166  },
      { min: 106890,  max: 142520, rate: 0.1762 },
      { min: 142520,  max: Infinity,rate: 0.19  },
    ],
    basicPersonal: 15000,
    color: "#e74c3c",
  },
  NT: {
    name: "Northwest Territories",
    abbr: "NT",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 53003,  rate: 0.059  },
      { min: 53003,   max: 106009, rate: 0.086  },
      { min: 106009,  max: 172346, rate: 0.122  },
      { min: 172346,  max: Infinity,rate: 0.1405},
    ],
    basicPersonal: 18198,
    color: "#2c3e50",
  },
  YT: {
    name: "Yukon",
    abbr: "YT",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 58523,  rate: 0.064  },
      { min: 58523,   max: 117045, rate: 0.09   },
      { min: 117045,  max: 181440, rate: 0.109  },
      { min: 181440,  max: 500000, rate: 0.128  },
      { min: 500000,  max: Infinity,rate: 0.15  },
    ],
    basicPersonal: 16452,
    color: "#27ae60",
  },
  NU: {
    name: "Nunavut",
    abbr: "NU",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 55801,  rate: 0.04   },
      { min: 55801,   max: 111602, rate: 0.07   },
      { min: 111602,  max: 181439, rate: 0.09   },
      { min: 181439,  max: Infinity,rate: 0.115 },
    ],
    basicPersonal: 19659,
    color: "#8e44ad",
  },
};

// Quebec residents contribute to QPP (6.30%) instead of CPP (5.95%); the second tier is 4% for both.
export const CPP = {
  exemption: 3500,
  ympe: 74600,
  yampe: 85000,
  rate: 0.0595,
  baseRate: 0.0495,
  qppRate: 0.063,
  qppBaseRate: 0.053,
  rate2: 0.04,
};

export const EI = {
  rate: 0.0163,
  qcRate: 0.013,
  maxInsurableEarnings: 68900,
};

export const QPIP = { rate: 0.0043, maxInsurableEarnings: 103000 };

export const ONTARIO_SURTAX = [
  { threshold: 5818, rate: 0.20 },
  { threshold: 7446, rate: 0.36 },
];

export const bracketTax = (income: number, brackets: Bracket[]) => {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
};

const marginalRate = (income: number, brackets: Bracket[]) => {
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (income > brackets[i].min) return brackets[i].rate;
  }
  return 0;
};

export const federalBasicPersonal = (netIncome: number) => {
  const { max, min, phaseStart, phaseEnd } = FEDERAL_BPA;
  if (netIncome <= phaseStart) return max;
  if (netIncome >= phaseEnd) return min;
  return max - ((netIncome - phaseStart) * (max - min)) / (phaseEnd - phaseStart);
};

const provincialBasicPersonal = (key: string, netIncome: number) => {
  if (key === "YT") return federalBasicPersonal(netIncome);
  // Manitoba phases its BPA out between $200,000 and $400,000 of net income.
  if (key === "MB") return PROVINCES.MB.basicPersonal * Math.min(1, Math.max(0, (400000 - netIncome) / 200000));
  return PROVINCES[key].basicPersonal;
};

// Ontario Health Premium schedule (unchanged since 2004, not indexed).
const ontarioHealthPremium = (taxable: number) => {
  if (taxable <= 20000) return 0;
  if (taxable <= 36000) return Math.min(300, (taxable - 20000) * 0.06);
  if (taxable <= 48000) return Math.min(450, 300 + (taxable - 36000) * 0.06);
  if (taxable <= 72000) return Math.min(600, 450 + (taxable - 48000) * 0.25);
  if (taxable <= 200000) return Math.min(750, 600 + (taxable - 72000) * 0.25);
  return Math.min(900, 750 + (taxable - 200000) * 0.25);
};

export function calculateCanadaTax(gross: number, rrsp: number, provinceKey: string, selfEmployed: boolean) {
  const province = PROVINCES[provinceKey];
  const isQC = !!province.qpip;
  const rrspDeduction = Math.max(0, Math.min(rrsp, gross * 0.18, RRSP_DOLLAR_LIMIT));

  // CPP/QPP and EI are based on gross earnings; RRSP contributions don't reduce them.
  const pensionable = Math.min(Math.max(0, gross - CPP.exemption), CPP.ympe - CPP.exemption);
  const tier1 = pensionable * (isQC ? CPP.qppRate : CPP.rate);
  const tier1Base = pensionable * (isQC ? CPP.qppBaseRate : CPP.baseRate);
  const tier2 = Math.min(Math.max(0, gross - CPP.ympe), CPP.yampe - CPP.ympe) * CPP.rate2;
  const cppTotal = selfEmployed ? (tier1 + tier2) * 2 : tier1 + tier2;
  // Base contributions earn a credit; enhanced contributions (and the employer half for self-employed) are deducted.
  const cppDeduction = (tier1 - tier1Base) + tier2 + (selfEmployed ? tier1 + tier2 : 0);

  const eiPremium = selfEmployed ? 0 : Math.min(gross, EI.maxInsurableEarnings) * (isQC ? EI.qcRate : EI.rate);
  const qpipPremium = selfEmployed || !isQC ? 0 : Math.min(gross, QPIP.maxInsurableEarnings) * QPIP.rate;

  const taxableIncome = Math.max(0, gross - rrspDeduction - cppDeduction);

  const employmentAmount = selfEmployed ? 0 : Math.min(gross, CANADA_EMPLOYMENT_AMOUNT);
  const federalCredits = FEDERAL_CREDIT_RATE * (federalBasicPersonal(taxableIncome) + tier1Base + eiPremium + qpipPremium + employmentAmount);
  const federalBasic = Math.max(0, bracketTax(taxableIncome, FEDERAL_BRACKETS) - federalCredits);
  const federalTax = isQC ? federalBasic * (1 - QUEBEC_ABATEMENT) : federalBasic;

  const provLowRate = province.brackets[0].rate;
  const provCreditBase = isQC
    ? province.basicPersonal
    : provincialBasicPersonal(provinceKey, taxableIncome) + tier1Base + eiPremium + (provinceKey === "YT" ? employmentAmount : 0);
  const provBasic = Math.max(0, bracketTax(taxableIncome, province.brackets) - provLowRate * provCreditBase);

  let provSurtax = 0;
  let surtaxFactor = 1;
  if (province.surtax) {
    for (const s of ONTARIO_SURTAX) {
      if (provBasic > s.threshold) {
        provSurtax += (provBasic - s.threshold) * s.rate;
        surtaxFactor += s.rate;
      }
    }
  }
  const healthPremium = provinceKey === "ON" ? ontarioHealthPremium(taxableIncome) : 0;
  const provTax = provBasic + provSurtax + healthPremium;

  const payroll = eiPremium + qpipPremium;
  const totalTax = federalTax + provTax;
  const totalDeductions = totalTax + cppTotal + payroll;
  const takeHome = Math.max(0, gross - totalDeductions);

  const marginalFederal = marginalRate(taxableIncome, FEDERAL_BRACKETS) * (isQC ? 1 - QUEBEC_ABATEMENT : 1) * 100;
  const marginalProvincial = marginalRate(taxableIncome, province.brackets) * surtaxFactor * 100;

  return {
    gross, taxableIncome, rrspDeduction,
    federalTax, provTax, cppTotal, eiPremium: payroll,
    totalTax, totalDeductions, takeHome,
    effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
    marginalFederal, marginalProvincial,
    marginalTotal: marginalFederal + marginalProvincial,
  };
}
