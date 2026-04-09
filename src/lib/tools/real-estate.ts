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
