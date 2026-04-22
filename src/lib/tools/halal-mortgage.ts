// Halal mortgage calculation logic for all three Sharia-compliant structures.
// No interest (riba) is used. Each structure has a distinct contractual basis.

export type MortgageMode = "musharakah" | "murabaha" | "ijara";

export interface MortgageInputs {
  propertyValue: number; // full purchase price
  deposit: number; // customer's upfront contribution
  termYears: number; // finance term in years
  annualRate: number; // profit/rental rate as a percentage e.g. 5.5
  mode: MortgageMode;
}

export interface YearlyRow {
  year: number;
  profitOrRent: number; // rental / profit portion of payments that year
  principal: number; // buyout / capital repayment portion
  balance: number; // outstanding finance balance at year end
  ownershipPct: number; // customer's ownership % (Musharakah/Ijara only)
}

export interface MortgageResult {
  financeAmount: number;
  monthlyPayment: number;
  totalPaid: number; // deposit + all payments
  totalProfit: number; // total profit/rent above finance amount
  ltvRatio: number; // loan-to-value as decimal e.g. 0.8
  schedule: YearlyRow[];
}

/**
 * DIMINISHING MUSHARAKAH
 * ----------------------
 * Bank and customer co-own the property from day one.
 * Customer pays:
 *   1. Rent on the bank's share (declining each year as ownership transfers)
 *   2. A fixed buyout instalment to purchase the bank's share over time
 */
function calcMusharakah(inputs: MortgageInputs): MortgageResult {
  const { propertyValue, deposit, termYears, annualRate } = inputs;
  const F = Math.max(0, propertyValue - deposit);
  const n = termYears * 12;
  const r = annualRate / 100 / 12;

  const monthly =
    r === 0 ? F / n : (F * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const totalPaid = monthly * n + deposit;
  const totalProfit = totalPaid - propertyValue;
  const ltvRatio = propertyValue > 0 ? F / propertyValue : 0;

  let balance = F;
  const schedule: YearlyRow[] = [];

  for (let y = 1; y <= termYears; y++) {
    let profitYear = 0;
    let principalYear = 0;
    for (let m = 0; m < 12; m++) {
      const profitMonth = balance * r;
      const principalMonth = monthly - profitMonth;
      profitYear += profitMonth;
      principalYear += principalMonth;
      balance = Math.max(0, balance - principalMonth);
    }
    const ownershipPct = ((F - balance) / F) * 100;
    schedule.push({
      year: y,
      profitOrRent: profitYear,
      principal: principalYear,
      balance,
      ownershipPct,
    });
  }

  return { financeAmount: F, monthlyPayment: monthly, totalPaid, totalProfit, ltvRatio, schedule };
}

/**
 * MURABAHA (COST-PLUS SALE)
 * -------------------------
 */
function calcMurabaha(inputs: MortgageInputs): MortgageResult {
  const { propertyValue, deposit, termYears, annualRate } = inputs;
  const F = Math.max(0, propertyValue - deposit);
  const n = termYears * 12;

  const totalProfit = F * (annualRate / 100) * termYears;
  const totalSalePrice = F + totalProfit;
  const monthly = totalSalePrice / n;
  const totalPaid = totalSalePrice + deposit;
  const ltvRatio = propertyValue > 0 ? F / propertyValue : 0;

  const profitPerYear = totalProfit / termYears;
  const principalPerYear = F / termYears;
  let balance = totalSalePrice;
  const schedule: YearlyRow[] = [];

  for (let y = 1; y <= termYears; y++) {
    balance -= profitPerYear + principalPerYear;
    schedule.push({
      year: y,
      profitOrRent: profitPerYear,
      principal: principalPerYear,
      balance: Math.max(0, balance),
      ownershipPct: (y / termYears) * 100,
    });
  }

  return { financeAmount: F, monthlyPayment: monthly, totalPaid, totalProfit, ltvRatio, schedule };
}

/**
 * IJARA WA IQTINA (LEASE-TO-OWN)
 */
function calcIjara(inputs: MortgageInputs): MortgageResult {
  return calcMusharakah(inputs);
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  switch (inputs.mode) {
    case "murabaha":
      return calcMurabaha(inputs);
    case "ijara":
      return calcIjara(inputs);
    default:
      return calcMusharakah(inputs);
  }
}

export function formatCurrency(n: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatCurrencyShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `£${Math.round(n / 1_000)}k`;
  return `£${Math.round(n)}`;
}
