export interface GratuityInputs {
  basicSalary: number;
  startDate: string;
  endDate: string;
  unpaidLeaveDays: number;
  contractType: "limited" | "unlimited";
  workPattern: "full-time" | "part-time" | "temporary" | "flexible";
  weeklyHours?: number;
}

export interface GratuityResult {
  dailyWage: number;
  totalYears: number;
  totalDays: number;
  firstFiveYearsGratuity: number;
  beyondFiveYearsGratuity: number;
  subtotalGratuity: number;
  twoYearCap: number;
  finalGratuity: number;
  isCapped: boolean;
  yearsInFirstTier: number;
  yearsInSecondTier: number;
  proRataFactor: number;
  eligible: boolean;
  breakdown: string[];
}

export function calculateGratuity(inputs: GratuityInputs): GratuityResult {
  const {
    basicSalary,
    startDate,
    endDate,
    unpaidLeaveDays,
    workPattern,
    weeklyHours = 40,
  } = inputs;

  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate total days of service
  const diffTime = end.getTime() - start.getTime();
  const totalDaysRaw = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = Math.max(0, totalDaysRaw - unpaidLeaveDays);
  
  // Calculate years of service (including fractions)
  const totalYears = totalDays / 365.25;
  
  // Check eligibility (minimum 1 year)
  const eligible = totalYears >= 1;
  
  if (!eligible) {
    return {
      dailyWage: basicSalary / 30,
      totalYears,
      totalDays,
      firstFiveYearsGratuity: 0,
      beyondFiveYearsGratuity: 0,
      subtotalGratuity: 0,
      twoYearCap: basicSalary * 24,
      finalGratuity: 0,
      isCapped: false,
      yearsInFirstTier: 0,
      yearsInSecondTier: 0,
      proRataFactor: 1,
      eligible: false,
      breakdown: ["Less than 1 year of service. No gratuity entitlement."],
    };
  }

  // Calculate pro-rata factor for part-time/temporary/flexible workers
  // Full-time = 40 hours/week standard
  const proRataFactor = workPattern === "full-time" ? 1 : Math.min(weeklyHours / 40, 1);

  const dailyWage = basicSalary / 30;
  
  // Determine years in each tier
  const yearsInFirstTier = Math.min(totalYears, 5);
  const yearsInSecondTier = Math.max(0, totalYears - 5);
  
  // Calculate gratuity for first 5 years (21 days per year)
  const firstFiveYearsGratuity = 21 * dailyWage * yearsInFirstTier * proRataFactor;
  
  // Calculate gratuity beyond 5 years (30 days per year)
  const beyondFiveYearsGratuity = 30 * dailyWage * yearsInSecondTier * proRataFactor;
  
  const subtotalGratuity = firstFiveYearsGratuity + beyondFiveYearsGratuity;
  
  // Apply 2-year cap
  const twoYearCap = basicSalary * 24;
  const finalGratuity = Math.min(subtotalGratuity, twoYearCap);
  const isCapped = subtotalGratuity > twoYearCap;

  // Build breakdown
  const breakdown: string[] = [];
  breakdown.push(`Daily Wage: AED ${dailyWage.toFixed(2)} (Basic Salary ÷ 30)`);
  breakdown.push(`Total Service: ${totalYears.toFixed(2)} years (${totalDays} days)`);
  
  if (proRataFactor < 1) {
    breakdown.push(`Pro-Rata Factor: ${(proRataFactor * 100).toFixed(1)}% (${weeklyHours} hrs/week vs 40 hrs full-time)`);
  }
  
  if (yearsInFirstTier > 0) {
    breakdown.push(`First ${yearsInFirstTier.toFixed(2)} years: 21 days/year × AED ${dailyWage.toFixed(2)} = AED ${firstFiveYearsGratuity.toFixed(2)}`);
  }
  
  if (yearsInSecondTier > 0) {
    breakdown.push(`Beyond 5 years (${yearsInSecondTier.toFixed(2)} yrs): 30 days/year × AED ${dailyWage.toFixed(2)} = AED ${beyondFiveYearsGratuity.toFixed(2)}`);
  }
  
  if (isCapped) {
    breakdown.push(`Subtotal: AED ${subtotalGratuity.toFixed(2)}`);
    breakdown.push(`2-Year Cap Applied: AED ${twoYearCap.toFixed(2)} (Basic × 24)`);
  }
  
  breakdown.push(`Final Gratuity: AED ${finalGratuity.toFixed(2)}`);

  return {
    dailyWage,
    totalYears,
    totalDays,
    firstFiveYearsGratuity,
    beyondFiveYearsGratuity,
    subtotalGratuity,
    twoYearCap,
    finalGratuity,
    isCapped,
    yearsInFirstTier,
    yearsInSecondTier,
    proRataFactor,
    eligible,
    breakdown,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-AE").format(num);
}
