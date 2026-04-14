"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  MORTGAGE_CURRENCIES,
  buildMortgageAmortization,
  calculateMortgage,
  type MortgageCurrency,
} from "@/lib/tools/mortgage";

const DEFAULT_MONTHLY_INCOME: Record<string, number> = {
  USD: 9_000,
  EUR: 7_000,
  GBP: 6_500,
  AED: 25_000,
  INR: 250_000,
};

function getDefaultMonthlyIncome(code: string) {
  return DEFAULT_MONTHLY_INCOME[code] ?? 8_000;
}

function formatCurrency(value: number, currency: MortgageCurrency) {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateMaxAffordableLoan(
  monthlyBudget: number,
  annualRate: number,
  tenureMonths: number,
  propertyTax: number,
  insurance: number,
  hoaFees: number,
  maintenanceReserve: number,
) {
  if (monthlyBudget <= 0) return 0;

  let low = 0;
  let high = 50_000_000;

  for (let index = 0; index < 50; index += 1) {
    const mid = (low + high) / 2;
    const monthlyCost =
      calculateMortgage(mid, annualRate, tenureMonths, propertyTax, insurance).monthlyPITI +
      hoaFees +
      maintenanceReserve;

    if (monthlyCost > monthlyBudget) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return low;
}

export default function MortgageCalculator() {
  const [currency, setCurrency] = useState<MortgageCurrency>(MORTGAGE_CURRENCIES[0]);
  const [homePrice, setHomePrice] = useState<number>(currency.defaultHomePrice);
  const [downPayment, setDownPayment] = useState<number>(currency.defaultDownPayment);
  const [rate, setRate] = useState<number>(currency.defaultRate);
  const [tenure, setTenure] = useState<number>(currency.defaultTenure);
  const [propertyTax, setPropertyTax] = useState<number>(currency.defaultPropertyTax);
  const [insurance, setInsurance] = useState<number>(currency.defaultInsurance);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState<number>(getDefaultMonthlyIncome(currency.code));
  const [monthlyDebts, setMonthlyDebts] = useState<number>(0);
  const [hoaFees, setHoaFees] = useState<number>(0);
  const [maintenanceReserve, setMaintenanceReserve] = useState<number>(0);
  const [showAmortization, setShowAmortization] = useState(true);

  const principal = Math.max(0, homePrice - downPayment);
  const result = useMemo(
    () => calculateMortgage(principal, rate, tenure, propertyTax, insurance),
    [principal, rate, tenure, propertyTax, insurance],
  );
  const schedule = useMemo(
    () => (showAmortization ? buildMortgageAmortization(principal, rate, tenure) : []),
    [principal, rate, tenure, showAmortization],
  );

  const downPaymentPercent = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;
  const totalPayment = result.totalPayment || 0;
  const interestPercent = totalPayment > 0 ? Math.round((result.totalInterest / totalPayment) * 100) : 0;
  const fullMonthlyOwnership = result.monthlyPITI + hoaFees + maintenanceReserve;
  const housingRatio = grossMonthlyIncome > 0 ? fullMonthlyOwnership / grossMonthlyIncome : 0;
  const dtiRatio = grossMonthlyIncome > 0 ? (fullMonthlyOwnership + monthlyDebts) / grossMonthlyIncome : 0;
  const recommendedHousingBudget = grossMonthlyIncome > 0 ? grossMonthlyIncome * 0.28 : 0;
  const recommendedMaxDebtLoad = grossMonthlyIncome > 0 ? grossMonthlyIncome * 0.36 : 0;
  const affordableMonthlyBudget = Math.max(0, Math.min(recommendedHousingBudget, recommendedMaxDebtLoad - monthlyDebts));
  const maxAffordableLoan = useMemo(
    () =>
      calculateMaxAffordableLoan(
        affordableMonthlyBudget,
        rate,
        tenure,
        propertyTax,
        insurance,
        hoaFees,
        maintenanceReserve,
      ),
    [affordableMonthlyBudget, rate, tenure, propertyTax, insurance, hoaFees, maintenanceReserve],
  );
  const downPaymentShare = homePrice > 0 ? downPayment / homePrice : 0;
  const estimatedAffordableHomePrice =
    downPaymentShare >= 1 ? maxAffordableLoan : maxAffordableLoan / Math.max(0.05, 1 - downPaymentShare);

  const affordabilityState =
    grossMonthlyIncome <= 0
      ? {
          label: "Add income for affordability",
          className: "border-slate-300/50 bg-slate-50 text-slate-950",
          message: "Enter gross monthly income and other debts to see whether this payment is realistic.",
        }
      : housingRatio <= 0.28 && dtiRatio <= 0.36
        ? {
            label: "Within common lending ranges",
            className: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
            message: "This looks reasonable against the common 28/36 affordability rule.",
          }
        : housingRatio <= 0.33 && dtiRatio <= 0.43
          ? {
              label: "Stretch budget",
              className: "border-amber-300/50 bg-amber-50 text-amber-950",
              message: "This payment could be workable, but it is tighter than the standard affordability range.",
            }
          : {
              label: "High affordability risk",
              className: "border-rose-300/50 bg-rose-50 text-rose-950",
              message: "This setup is above common affordability thresholds and deserves a closer review.",
            };

  const dubaiBuyerCosts = useMemo(() => {
    if (currency.code !== "AED") return null;

    const dldTransferFee = homePrice * 0.04;
    const servicePartnerFee = homePrice >= 500_000 ? 4_200 : 2_100;
    const mortgageRegistrationFee = principal * 0.0025;
    const brokerEstimate = homePrice * 0.02;

    return {
      dldTransferFee,
      servicePartnerFee,
      mortgageRegistrationFee,
      brokerEstimate,
      officialSubtotal: dldTransferFee + servicePartnerFee + mortgageRegistrationFee,
      estimatedCashNeeded: downPayment + dldTransferFee + servicePartnerFee + mortgageRegistrationFee + brokerEstimate,
    };
  }, [currency.code, homePrice, principal, downPayment]);

  const handleCurrencyChange = (code: string) => {
    const selected = MORTGAGE_CURRENCIES.find((item) => item.code === code) ?? MORTGAGE_CURRENCIES[0];
    setCurrency(selected);
    setHomePrice(selected.defaultHomePrice);
    setDownPayment(selected.defaultDownPayment);
    setRate(selected.defaultRate);
    setTenure(selected.defaultTenure);
    setPropertyTax(selected.defaultPropertyTax);
    setInsurance(selected.defaultInsurance);
    setGrossMonthlyIncome(getDefaultMonthlyIncome(selected.code));
    setMonthlyDebts(0);
    setHoaFees(0);
    setMaintenanceReserve(0);
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_20rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                <div className="relative">
                  <select
                    value={currency.code}
                    onChange={(event) => handleCurrencyChange(event.target.value)}
                    className="w-full appearance-none rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  >
                    {MORTGAGE_CURRENCIES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label} ({item.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Home price</span>
                <input
                  type="number"
                  min={currency.minHomePrice}
                  max={currency.maxHomePrice}
                  step={currency.homePriceStep}
                  value={homePrice}
                  onChange={(event) => setHomePrice(Number(event.target.value))}
                  className="w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Home price</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {formatCurrency(homePrice, currency)}
                  </p>
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {currency.code}
                </span>
              </div>
              <input
                type="range"
                min={currency.minHomePrice}
                max={currency.maxHomePrice}
                step={currency.homePriceStep}
                value={homePrice}
                onChange={(event) => setHomePrice(Number(event.target.value))}
                className="mt-4 w-full accent-primary"
              />
            </div>

            <div className="rounded-[1.5rem] border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Down payment</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {formatCurrency(downPayment, currency)} ({downPaymentPercent}%)
                  </p>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={homePrice}
                step={currency.homePriceStep}
                value={downPayment}
                onChange={(event) => setDownPayment(Number(event.target.value))}
                className="mt-4 w-full accent-primary"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <p className="text-sm font-medium text-muted-foreground">Loan amount</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {formatCurrency(principal, currency)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Home price minus down payment
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual interest rate</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">{rate}%</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loan term</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {tenure} months
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      About {Math.round(tenure / 12)} years
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={60}
                  max={360}
                  step={12}
                  value={tenure}
                  onChange={(event) => setTenure(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual property tax</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(propertyTax, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={currency.taxMax}
                  step={Math.max(currency.taxStep, 1)}
                  value={propertyTax}
                  onChange={(event) => setPropertyTax(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual insurance</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(insurance, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={currency.insuranceMax}
                  step={currency.insuranceStep}
                  value={insurance}
                  onChange={(event) => setInsurance(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gross monthly income</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(grossMonthlyIncome, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(currency.defaultHomePrice / 20, grossMonthlyIncome * 2, 20_000)}
                  step={Math.max(currency.homePriceStep / 10, 100)}
                  value={grossMonthlyIncome}
                  onChange={(event) => setGrossMonthlyIncome(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Other monthly debts</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(monthlyDebts, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(grossMonthlyIncome, 10_000)}
                  step={Math.max(currency.homePriceStep / 20, 50)}
                  value={monthlyDebts}
                  onChange={(event) => setMonthlyDebts(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {currency.code === "AED" ? "Monthly service charges / HOA" : "Monthly HOA / service charges"}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(hoaFees, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(currency.defaultHomePrice / 1000, 10_000)}
                  step={Math.max(currency.homePriceStep / 50, 25)}
                  value={hoaFees}
                  onChange={(event) => setHoaFees(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly maintenance reserve</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {formatCurrency(maintenanceReserve, currency)}
                    </p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(currency.defaultHomePrice / 2000, 5_000)}
                  step={Math.max(currency.homePriceStep / 100, 25)}
                  value={maintenanceReserve}
                  onChange={(event) => setMaintenanceReserve(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Monthly payment
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.monthlyPayment, currency)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Principal and interest only</p>

            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-soft-foreground">
                Full monthly cost (PITI)
              </p>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-primary-soft-foreground">
                {formatCurrency(result.monthlyPITI, currency)}
              </div>
            </div>

            <div className="mt-4 rounded-[1rem] border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                True monthly ownership cost
              </p>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {formatCurrency(fullMonthlyOwnership, currency)}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                PITI plus HOA or service charges and a maintenance reserve.
              </p>
            </div>

            <div className={`mt-4 rounded-[1rem] border p-4 ${affordabilityState.className}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Affordability signal</p>
              <p className="mt-2 text-lg font-semibold">{affordabilityState.label}</p>
              <p className="mt-2 text-xs leading-5">{affordabilityState.message}</p>
              <div className="mt-3 space-y-2 text-xs leading-5">
                <div className="flex items-center justify-between gap-4">
                  <span>Housing ratio</span>
                  <span>{grossMonthlyIncome > 0 ? `${(housingRatio * 100).toFixed(1)}%` : "--"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Total debt ratio</span>
                  <span>{grossMonthlyIncome > 0 ? `${(dtiRatio * 100).toFixed(1)}%` : "--"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Loan amount</span>
                <span className="font-medium text-foreground">{formatCurrency(principal, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total interest</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(result.totalInterest, currency)} ({interestPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Total payment</span>
                <span className="font-medium text-foreground">{formatCurrency(result.totalPayment, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Recommended housing budget</span>
                <span className="font-medium text-foreground">{formatCurrency(affordableMonthlyBudget, currency)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Estimated affordable home price</span>
                <span className="font-medium text-foreground">{formatCurrency(estimatedAffordableHomePrice, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Principal + interest</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrency(result.monthlyPayment, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The pure loan payment before taxes, insurance, and ownership extras.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Taxes + insurance</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrency(result.monthlyPITI - result.monthlyPayment, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Monthly load added by annual property tax and home insurance.</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ownership extras</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{formatCurrency(hoaFees + maintenanceReserve, currency)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Service charges, HOA, and maintenance reserve that many buyers forget to budget.</p>
        </article>
      </section>

      {dubaiBuyerCosts ? (
        <section className="tool-frame p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common Dubai upfront buying costs</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Mortgage affordability in Dubai is not only about the monthly payment. Buyers also need cash for the down payment, Land Department fees, mortgage registration, and often broker commission.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-[1.25rem] border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Down payment</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(downPayment, currency)}</p>
                </article>
                <article className="rounded-[1.25rem] border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">DLD transfer fee</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(dubaiBuyerCosts.dldTransferFee, currency)}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Calculated at 4% of the property price.</p>
                </article>
                <article className="rounded-[1.25rem] border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Mortgage registration</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(dubaiBuyerCosts.mortgageRegistrationFee, currency)}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Calculated at 0.25% of the loan amount.</p>
                </article>
                <article className="rounded-[1.25rem] border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Broker estimate</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(dubaiBuyerCosts.brokerEstimate, currency)}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Common market estimate at 2%; this is not an official government fee.</p>
                </article>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Estimated cash needed</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                {formatCurrency(dubaiBuyerCosts.estimatedCashNeeded, currency)}
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Official-type subtotal</span>
                  <span className="font-medium text-foreground">{formatCurrency(dubaiBuyerCosts.officialSubtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Service partner fee</span>
                  <span className="font-medium text-foreground">{formatCurrency(dubaiBuyerCosts.servicePartnerFee, currency)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Down payment included</span>
                  <span className="font-medium text-foreground">{formatCurrency(downPayment, currency)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Valuation, bank processing, life insurance, and title-related extras can still change the final cash needed.
              </p>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="tool-frame p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Amortization schedule
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review how each monthly payment shifts from interest-heavy to principal-heavy over time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAmortization((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-[1rem] border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
          >
            {showAmortization ? (
              <>
                Hide schedule
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show schedule
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {showAmortization ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1.25rem] border border-border">
              <thead className="bg-muted">
                <tr>
                  {["Month", "Payment", "Principal", "Interest", "Balance"].map((label) => (
                    <th
                      key={label}
                      className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="bg-card even:bg-background">
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">{row.month}</td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.payment, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.principalPaid, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.interest, currency)}
                    </td>
                    <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                      {formatCurrency(row.balance, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}


