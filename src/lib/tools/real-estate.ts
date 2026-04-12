export function calculateRentalYield(input: {
  propertyPrice: number;
  annualRent: number;
  annualExpenses: number;
}) {
  const propertyPrice = Math.max(0, input.propertyPrice);
  const annualRent = Math.max(0, input.annualRent);
  const annualExpenses = Math.max(0, input.annualExpenses);
  const netOperatingIncome = annualRent - annualExpenses;

  return {
    grossYield: propertyPrice > 0 ? (annualRent / propertyPrice) * 100 : 0,
    netYield: propertyPrice > 0 ? (netOperatingIncome / propertyPrice) * 100 : 0,
    netOperatingIncome,
  };
}

function calculateMonthlyLoanPayment(principal: number, annualRate: number, termMonths: number) {
  const safePrincipal = Math.max(0, principal);
  const safeRate = Math.max(0, annualRate);
  const safeTerm = Math.max(0, termMonths);

  if (safePrincipal === 0 || safeTerm === 0) {
    return 0;
  }

  if (safeRate === 0) {
    return safePrincipal / safeTerm;
  }

  const monthlyRate = safeRate / 12 / 100;
  return (
    (safePrincipal * monthlyRate * Math.pow(1 + monthlyRate, safeTerm)) /
    (Math.pow(1 + monthlyRate, safeTerm) - 1)
  );
}

function applyProgressiveBrackets(
  amount: number,
  brackets: Array<{ upTo: number; rate: number }>,
) {
  let remaining = Math.max(0, amount);
  let previousLimit = 0;
  let tax = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) {
      break;
    }

    const taxableAtThisRate = Math.min(remaining, bracket.upTo - previousLimit);
    tax += taxableAtThisRate * (bracket.rate / 100);
    remaining -= taxableAtThisRate;
    previousLimit = bracket.upTo;
  }

  return tax;
}

export function calculateCapRate(input: {
  propertyValue: number;
  annualRent: number;
  annualExpenses: number;
}) {
  const propertyValue = Math.max(0, input.propertyValue);
  const annualRent = Math.max(0, input.annualRent);
  const annualExpenses = Math.max(0, input.annualExpenses);
  const noi = annualRent - annualExpenses;

  return {
    noi,
    capRate: propertyValue > 0 ? (noi / propertyValue) * 100 : 0,
  };
}

export function calculateRentAffordability(input: {
  monthlyIncome: number;
  monthlyDebt: number;
  monthlyUtilities: number;
  housingRatioPercent: number;
}) {
  const monthlyIncome = Math.max(0, input.monthlyIncome);
  const monthlyDebt = Math.max(0, input.monthlyDebt);
  const monthlyUtilities = Math.max(0, input.monthlyUtilities);
  const housingRatioPercent = Math.max(0, input.housingRatioPercent);
  const targetHousingBudget = monthlyIncome * (housingRatioPercent / 100);
  const affordableRent = Math.max(0, targetHousingBudget - monthlyDebt - monthlyUtilities);

  return {
    targetHousingBudget,
    affordableRent,
    conservativeRent: affordableRent * 0.9,
    stretchRent: affordableRent * 1.1,
  };
}

export function calculateClosingCosts(input: {
  purchasePrice: number;
  downPayment: number;
  closingCostPercent: number;
  fixedClosingCosts: number;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);
  const downPayment = Math.max(0, input.downPayment);
  const closingCostPercent = Math.max(0, input.closingCostPercent);
  const fixedClosingCosts = Math.max(0, input.fixedClosingCosts);
  const estimatedClosingCosts = purchasePrice * (closingCostPercent / 100) + fixedClosingCosts;

  return {
    estimatedClosingCosts,
    totalCashNeeded: downPayment + estimatedClosingCosts,
  };
}

export function calculatePricePerArea(input: {
  price: number;
  area: number;
}) {
  const price = Math.max(0, input.price);
  const area = Math.max(0, input.area);
  return {
    pricePerArea: area > 0 ? price / area : 0,
  };
}

export function calculateDownPayment(input: {
  homePrice: number;
  downPaymentPercent: number;
}) {
  const homePrice = Math.max(0, input.homePrice);
  const downPaymentPercent = Math.max(0, input.downPaymentPercent);
  const downPaymentAmount = homePrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);

  return {
    downPaymentAmount,
    loanAmount,
    loanToValue: homePrice > 0 ? (loanAmount / homePrice) * 100 : 0,
    financedShare: homePrice > 0 ? (loanAmount / homePrice) * 100 : 0,
  };
}

export function calculateMortgageRefinance(input: {
  currentBalance: number;
  currentRate: number;
  currentTermMonths: number;
  newRate: number;
  newTermMonths: number;
  refinanceCosts: number;
}) {
  const currentBalance = Math.max(0, input.currentBalance);
  const refinanceCosts = Math.max(0, input.refinanceCosts);
  const currentMonthlyPayment = calculateMonthlyLoanPayment(
    currentBalance,
    input.currentRate,
    input.currentTermMonths,
  );
  const newMonthlyPayment = calculateMonthlyLoanPayment(
    currentBalance,
    input.newRate,
    input.newTermMonths,
  );
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const breakEvenMonths = monthlySavings > 0 ? refinanceCosts / monthlySavings : 0;
  const currentTotalRemaining = currentMonthlyPayment * Math.max(0, input.currentTermMonths);
  const newTotalRemaining = newMonthlyPayment * Math.max(0, input.newTermMonths) + refinanceCosts;

  return {
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlySavings,
    breakEvenMonths,
    currentTotalRemaining,
    newTotalRemaining,
    lifetimeSavings: currentTotalRemaining - newTotalRemaining,
  };
}

export function calculateRentalCashFlow(input: {
  monthlyRent: number;
  vacancyPercent: number;
  monthlyMortgage: number;
  monthlyOperatingCosts: number;
  annualReserveCosts: number;
}) {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const vacancyPercent = Math.max(0, input.vacancyPercent);
  const monthlyMortgage = Math.max(0, input.monthlyMortgage);
  const monthlyOperatingCosts = Math.max(0, input.monthlyOperatingCosts);
  const annualReserveCosts = Math.max(0, input.annualReserveCosts);

  const effectiveAnnualRent = monthlyRent * 12 * (1 - vacancyPercent / 100);
  const annualMortgage = monthlyMortgage * 12;
  const annualOperatingCosts = monthlyOperatingCosts * 12 + annualReserveCosts;
  const annualCashFlow = effectiveAnnualRent - annualMortgage - annualOperatingCosts;

  return {
    effectiveAnnualRent,
    annualMortgage,
    annualOperatingCosts,
    annualCashFlow,
    monthlyCashFlow: annualCashFlow / 12,
  };
}

export function calculateHomeBuyingBudget(input: {
  monthlyIncome: number;
  monthlyDebt: number;
  downPayment: number;
  annualRate: number;
  loanTermYears: number;
  housingRatioPercent: number;
  monthlyOwnershipCosts: number;
}) {
  const monthlyIncome = Math.max(0, input.monthlyIncome);
  const monthlyDebt = Math.max(0, input.monthlyDebt);
  const downPayment = Math.max(0, input.downPayment);
  const annualRate = Math.max(0, input.annualRate);
  const loanTermYears = Math.max(0, input.loanTermYears);
  const housingRatioPercent = Math.max(0, input.housingRatioPercent);
  const monthlyOwnershipCosts = Math.max(0, input.monthlyOwnershipCosts);

  const targetHousingBudget = monthlyIncome * (housingRatioPercent / 100);
  const maxMortgagePayment = Math.max(0, targetHousingBudget - monthlyDebt - monthlyOwnershipCosts);
  const loanTermMonths = loanTermYears * 12;

  let maxLoanAmount = 0;
  if (maxMortgagePayment > 0 && loanTermMonths > 0) {
    if (annualRate === 0) {
      maxLoanAmount = maxMortgagePayment * loanTermMonths;
    } else {
      const monthlyRate = annualRate / 12 / 100;
      maxLoanAmount =
        (maxMortgagePayment * (Math.pow(1 + monthlyRate, loanTermMonths) - 1)) /
        (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths));
    }
  }

  return {
    targetHousingBudget,
    maxMortgagePayment,
    maxLoanAmount,
    estimatedHomeBudget: maxLoanAmount + downPayment,
  };
}

export function calculateLeaseEscalation(input: {
  baseMonthlyRent: number;
  annualIncreasePercent: number;
  years: number;
}) {
  const baseMonthlyRent = Math.max(0, input.baseMonthlyRent);
  const annualIncreasePercent = Math.max(0, input.annualIncreasePercent);
  const years = Math.max(0, Math.floor(input.years));

  const schedule = Array.from({ length: years }, (_, index) => {
    const year = index + 1;
    const monthlyRent = baseMonthlyRent * Math.pow(1 + annualIncreasePercent / 100, index);
    const annualRent = monthlyRent * 12;

    return {
      year,
      monthlyRent,
      annualRent,
    };
  });

  const totalRent = schedule.reduce((sum, item) => sum + item.annualRent, 0);
  const finalMonthlyRent = schedule.at(-1)?.monthlyRent ?? baseMonthlyRent;

  return {
    schedule,
    totalRent,
    finalMonthlyRent,
  };
}

export function calculateSecurityDeposit(input: {
  monthlyRent: number;
  depositMonths: number;
  advanceRentMonths: number;
  adminFees: number;
}) {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const depositMonths = Math.max(0, input.depositMonths);
  const advanceRentMonths = Math.max(0, input.advanceRentMonths);
  const adminFees = Math.max(0, input.adminFees);
  const depositAmount = monthlyRent * depositMonths;
  const advanceRentAmount = monthlyRent * advanceRentMonths;
  const totalMoveInCost = depositAmount + advanceRentAmount + adminFees;

  return {
    depositAmount,
    advanceRentAmount,
    totalMoveInCost,
  };
}

export function calculatePropertyManagementFee(input: {
  monthlyRent: number;
  managementFeePercent: number;
  leasingFeePercent: number;
  annualRepairs: number;
}) {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const managementFeePercent = Math.max(0, input.managementFeePercent);
  const leasingFeePercent = Math.max(0, input.leasingFeePercent);
  const annualRepairs = Math.max(0, input.annualRepairs);
  const annualRent = monthlyRent * 12;
  const annualManagementFee = annualRent * (managementFeePercent / 100);
  const leasingFee = annualRent * (leasingFeePercent / 100);
  const annualOwnerNet = annualRent - annualManagementFee - leasingFee - annualRepairs;

  return {
    annualRent,
    annualManagementFee,
    leasingFee,
    annualOwnerNet,
    monthlyOwnerNet: annualOwnerNet / 12,
  };
}

export function calculateStampDuty(input: {
  purchasePrice: number;
  dutyPercent: number;
  legalFees: number;
  registrationFees: number;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);
  const dutyPercent = Math.max(0, input.dutyPercent);
  const legalFees = Math.max(0, input.legalFees);
  const registrationFees = Math.max(0, input.registrationFees);
  const dutyAmount = purchasePrice * (dutyPercent / 100);
  const totalTransactionFees = dutyAmount + legalFees + registrationFees;

  return {
    dutyAmount,
    totalTransactionFees,
    totalCashNeeded: purchasePrice + totalTransactionFees,
  };
}

export function calculateUkSdlt(input: {
  purchasePrice: number;
  buyerType: "standard" | "first-time";
  additionalProperty: boolean;
  nonUkResident: boolean;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);
  const surcharge = (input.additionalProperty ? 5 : 0) + (input.nonUkResident ? 2 : 0);
  const useFirstTimeRelief = input.buyerType === "first-time" && purchasePrice <= 500_000;

  const brackets = useFirstTimeRelief
    ? [
        { upTo: 300_000, rate: 0 + surcharge },
        { upTo: 500_000, rate: 5 + surcharge },
        { upTo: Number.POSITIVE_INFINITY, rate: 5 + surcharge },
      ]
    : [
        { upTo: 125_000, rate: 0 + surcharge },
        { upTo: 250_000, rate: 2 + surcharge },
        { upTo: 925_000, rate: 5 + surcharge },
        { upTo: 1_500_000, rate: 10 + surcharge },
        { upTo: Number.POSITIVE_INFINITY, rate: 12 + surcharge },
      ];

  const sdlt = applyProgressiveBrackets(purchasePrice, brackets);

  return {
    sdlt,
    effectiveRate: purchasePrice > 0 ? (sdlt / purchasePrice) * 100 : 0,
    surchargeRate: surcharge,
    usesFirstTimeRelief: useFirstTimeRelief,
  };
}

export function calculateSingaporePropertyStampDuty(input: {
  purchasePrice: number;
  buyerProfile: "sc-first" | "sc-second" | "sc-third-plus" | "spr-first" | "spr-second" | "spr-third-plus" | "foreigner" | "entity";
  ssdRegime: "2025-plus" | "2017-2025";
  yearsHeld: number;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);

  const bsd = applyProgressiveBrackets(purchasePrice, [
    { upTo: 180_000, rate: 1 },
    { upTo: 360_000, rate: 2 },
    { upTo: 1_000_000, rate: 3 },
    { upTo: 1_500_000, rate: 4 },
    { upTo: 3_000_000, rate: 5 },
    { upTo: Number.POSITIVE_INFINITY, rate: 6 },
  ]);

  const absdRates: Record<typeof input.buyerProfile, number> = {
    "sc-first": 0,
    "sc-second": 20,
    "sc-third-plus": 30,
    "spr-first": 5,
    "spr-second": 30,
    "spr-third-plus": 35,
    foreigner: 60,
    entity: 65,
  };

  const absdRate = absdRates[input.buyerProfile];
  const absd = purchasePrice * (absdRate / 100);

  const yearsHeld = Math.max(0, input.yearsHeld);
  let ssdRate = 0;

  if (input.ssdRegime === "2025-plus") {
    if (yearsHeld <= 1) ssdRate = 16;
    else if (yearsHeld <= 2) ssdRate = 12;
    else if (yearsHeld <= 3) ssdRate = 8;
    else if (yearsHeld <= 4) ssdRate = 4;
  } else {
    if (yearsHeld <= 1) ssdRate = 12;
    else if (yearsHeld <= 2) ssdRate = 8;
    else if (yearsHeld <= 3) ssdRate = 4;
  }

  const ssd = purchasePrice * (ssdRate / 100);

  return {
    bsd: Math.floor(bsd),
    absd: Math.floor(absd),
    absdRate,
    ssd: Math.floor(ssd),
    ssdRate,
    totalBuyerStampDuty: Math.floor(bsd + absd),
  };
}

export function calculateSingaporeBuyerStampDuty(input: {
  purchasePrice: number;
  buyerProfile: "sc-first" | "sc-second" | "sc-third-plus" | "spr-first" | "spr-second" | "spr-third-plus" | "foreigner" | "entity";
}) {
  const result = calculateSingaporePropertyStampDuty({
    purchasePrice: input.purchasePrice,
    buyerProfile: input.buyerProfile,
    ssdRegime: "2025-plus",
    yearsHeld: 5,
  });

  return {
    bsd: result.bsd,
    absd: result.absd,
    absdRate: result.absdRate,
    totalBuyerStampDuty: result.totalBuyerStampDuty,
  };
}

export function calculateSingaporeSellerStampDuty(input: {
  salePrice: number;
  acquisitionDate: string;
  disposalDate: string;
}) {
  const salePrice = Math.max(0, input.salePrice);
  const acquisitionDate = new Date(input.acquisitionDate);
  const disposalDate = new Date(input.disposalDate);

  if (Number.isNaN(acquisitionDate.getTime()) || Number.isNaN(disposalDate.getTime()) || disposalDate <= acquisitionDate) {
    return {
      holdingPeriodYears: 0,
      ssdRate: 0,
      ssd: 0,
      regime: "2025-plus" as const,
    };
  }

  const holdingPeriodYears =
    (disposalDate.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const cutover = new Date("2025-07-04T00:00:00");
  const regime = acquisitionDate >= cutover ? "2025-plus" : "2017-2025";

  let ssdRate = 0;
  if (regime === "2025-plus") {
    if (holdingPeriodYears <= 1) ssdRate = 16;
    else if (holdingPeriodYears <= 2) ssdRate = 12;
    else if (holdingPeriodYears <= 3) ssdRate = 8;
    else if (holdingPeriodYears <= 4) ssdRate = 4;
  } else {
    if (holdingPeriodYears <= 1) ssdRate = 12;
    else if (holdingPeriodYears <= 2) ssdRate = 8;
    else if (holdingPeriodYears <= 3) ssdRate = 4;
  }

  const ssd = Math.floor(salePrice * (ssdRate / 100));

  return {
    holdingPeriodYears,
    ssdRate,
    ssd,
    regime,
  };
}

export function calculateNycTransferTax(input: {
  transferPrice: number;
  propertyType: "residential-1-3-family" | "other";
}) {
  const transferPrice = Math.max(0, input.transferPrice);
  const isSmallTransfer = transferPrice <= 500_000;

  const rate =
    input.propertyType === "residential-1-3-family"
      ? isSmallTransfer
        ? 1
        : 1.425
      : isSmallTransfer
        ? 1.425
        : 2.625;

  const rtt = transferPrice * (rate / 100);

  // NYS Mansion Tax (Residential $1M+)
  let mansionTax = 0;
  if (input.propertyType === "residential-1-3-family" && transferPrice >= 1_000_000) {
    if (transferPrice < 2_000_000) mansionTax = transferPrice * 0.01;
    else if (transferPrice < 3_000_000) mansionTax = transferPrice * 0.0125;
    else if (transferPrice < 5_000_000) mansionTax = transferPrice * 0.015;
    else if (transferPrice < 10_000_000) mansionTax = transferPrice * 0.0225;
    else if (transferPrice < 15_000_000) mansionTax = transferPrice * 0.0325;
    else if (transferPrice < 20_000_000) mansionTax = transferPrice * 0.035;
    else if (transferPrice < 25_000_000) mansionTax = transferPrice * 0.0375;
    else mansionTax = transferPrice * 0.039;
  }

  return {
    rate,
    rtt,
    mansionTax,
    totalEstimatedTax: rtt + mansionTax,
  };
}

export function calculateDubaiTransferFee(input: {
  salePrice: number;
}) {
  const salePrice = Math.max(0, input.salePrice);
  const dldTransferFee = salePrice * 0.04;
  const trusteeFee = salePrice < 500_000 ? 2_100 : 4_200;
  const titleDeedFee = 250;
  const knowledgeFee = 10;
  const innovationFee = 10;
  const totalFees = dldTransferFee + trusteeFee + titleDeedFee + knowledgeFee + innovationFee;

  return {
    dldTransferFee,
    trusteeFee,
    titleDeedFee,
    knowledgeFee,
    innovationFee,
    totalFees,
  };
}

export function calculateScotlandLbtt(input: {
  purchasePrice: number;
  firstTimeBuyer: boolean;
  additionalDwelling: boolean;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);

  const mainBrackets = input.firstTimeBuyer
    ? [
        { upTo: 175_000, rate: 0 },
        { upTo: 250_000, rate: 2 },
        { upTo: 325_000, rate: 5 },
        { upTo: 750_000, rate: 10 },
        { upTo: Number.POSITIVE_INFINITY, rate: 12 },
      ]
    : [
        { upTo: 145_000, rate: 0 },
        { upTo: 250_000, rate: 2 },
        { upTo: 325_000, rate: 5 },
        { upTo: 750_000, rate: 10 },
        { upTo: Number.POSITIVE_INFINITY, rate: 12 },
      ];

  const lbtt = applyProgressiveBrackets(purchasePrice, mainBrackets);
  const ads = input.additionalDwelling ? purchasePrice * 0.08 : 0;

  return {
    lbtt,
    ads,
    totalTax: lbtt + ads,
    firstTimeNilRateBand: input.firstTimeBuyer ? 175_000 : 145_000,
  };
}

export function calculateWalesLtt(input: {
  purchasePrice: number;
  higherRates: boolean;
}) {
  const purchasePrice = Math.max(0, input.purchasePrice);

  const brackets = input.higherRates
    ? [
        { upTo: 180_000, rate: 5 },
        { upTo: 250_000, rate: 8.5 },
        { upTo: 400_000, rate: 10 },
        { upTo: 750_000, rate: 12.5 },
        { upTo: 1_500_000, rate: 15 },
        { upTo: Number.POSITIVE_INFINITY, rate: 17 },
      ]
    : [
        { upTo: 225_000, rate: 0 },
        { upTo: 400_000, rate: 6 },
        { upTo: 750_000, rate: 7.5 },
        { upTo: 1_500_000, rate: 10 },
        { upTo: Number.POSITIVE_INFINITY, rate: 12 },
      ];

  const ltt = applyProgressiveBrackets(purchasePrice, brackets);

  return {
    ltt,
    effectiveRate: purchasePrice > 0 ? (ltt / purchasePrice) * 100 : 0,
  };
}

export function calculateHongKongAvd(input: {
  propertyValue: number;
}) {
  const propertyValue = Math.max(0, input.propertyValue);

  if (propertyValue <= 4_000_000) return { avd: 100, regime: "current-scale-2" as const };
  if (propertyValue <= 4_323_780) return { avd: 100 + 0.2 * (propertyValue - 4_000_000), regime: "current-scale-2" as const };
  if (propertyValue <= 4_500_000) return { avd: propertyValue * 0.015, regime: "current-scale-2" as const };
  if (propertyValue <= 4_935_480) return { avd: 67_500 + 0.1 * (propertyValue - 4_500_000), regime: "current-scale-2" as const };
  if (propertyValue <= 6_000_000) return { avd: propertyValue * 0.0225, regime: "current-scale-2" as const };
  if (propertyValue <= 6_642_860) return { avd: 135_000 + 0.1 * (propertyValue - 6_000_000), regime: "current-scale-2" as const };
  if (propertyValue <= 9_000_000) return { avd: propertyValue * 0.03, regime: "current-scale-2" as const };
  if (propertyValue <= 10_080_000) return { avd: 270_000 + 0.1 * (propertyValue - 9_000_000), regime: "current-scale-2" as const };
  if (propertyValue <= 20_000_000) return { avd: propertyValue * 0.0375, regime: "current-scale-2" as const };
  if (propertyValue <= 21_739_120) return { avd: 750_000 + 0.1 * (propertyValue - 20_000_000), regime: "current-scale-2" as const };
  return { avd: propertyValue * 0.0425, regime: "current-scale-2" as const };
}

export function calculateDubaiMortgageRegistration(input: {
  mortgageValue: number;
}) {
  const mortgageValue = Math.max(0, input.mortgageValue);
  const mortgageFee = mortgageValue * 0.0025;
  const titleDeedFee = 250;
  const knowledgeFee = 10;
  const innovationFee = 10;
  const totalFees = mortgageFee + titleDeedFee + knowledgeFee + innovationFee;

  return {
    mortgageFee,
    titleDeedFee,
    knowledgeFee,
    innovationFee,
    totalFees,
  };
}

export function calculateDubaiServiceCharge(input: {
  titleDeedAreaSqFt: number;
  approvedRatePerSqFt: number;
}) {
  const titleDeedAreaSqFt = Math.max(0, input.titleDeedAreaSqFt);
  const approvedRatePerSqFt = Math.max(0, input.approvedRatePerSqFt);
  const annualServiceCharge = titleDeedAreaSqFt * approvedRatePerSqFt;

  return {
    annualServiceCharge,
    monthlyEquivalent: annualServiceCharge / 12,
  };
}

export function calculateRentVsBuy(input: {
  homePrice: number;
  downPayment: number;
  monthlyMortgage: number;
  monthlyOwnershipCosts: number;
  monthlyRent: number;
  yearsPlanned: number;
}) {
  const homePrice = Math.max(0, input.homePrice);
  const downPayment = Math.max(0, input.downPayment);
  const monthlyMortgage = Math.max(0, input.monthlyMortgage);
  const monthlyOwnershipCosts = Math.max(0, input.monthlyOwnershipCosts);
  const monthlyRent = Math.max(0, input.monthlyRent);
  const yearsPlanned = Math.max(0, input.yearsPlanned);
  const months = yearsPlanned * 12;

  const rentCost = monthlyRent * months;
  const buyCost = downPayment + (monthlyMortgage + monthlyOwnershipCosts) * months;

  return {
    rentCost,
    buyCost,
    difference: buyCost - rentCost,
    cheaperOption: buyCost === rentCost ? "same" : buyCost < rentCost ? "buy" : "rent",
    homePrice,
  };
}
