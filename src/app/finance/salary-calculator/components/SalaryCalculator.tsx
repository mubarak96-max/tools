"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import BracketVisualizer from "@/app/finance/salary-calculator/components/BracketVisualizer";
import TaxBreakdownTable from "@/app/finance/salary-calculator/components/TaxBreakdownTable";
import {
  CANADA_PROVINCES,
  COUNTRIES,
  GERMANY_STATES,
  ITALY_REGIONS,
  SPAIN_REGIONS,
  US_FILING_STATUSES,
  US_STATES,
  calculateSalary,
  getCountryMeta,
  type PayPeriod,
  type SalaryCalculationInput,
  type SalaryCountryCode,
} from "@/lib/tools/salary";

const fieldClass = "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const payPeriods: PayPeriod[] = ["annual", "monthly", "weekly", "hourly"];

const defaultForm: Omit<SalaryCalculationInput, "countryCode" | "salaryAmount" | "payPeriod"> = {
  hoursPerWeek: 40,
  weeksPerYear: 52,
  uaeBasicSalary: undefined,
  uaeHousingAllowance: undefined,
  uaeTransportAllowance: undefined,
  uaeOtherAllowances: undefined,
  uaeOvertimePay: undefined,
  uaeTotalDeductions: undefined,
  filingStatus: "single",
  usState: "CA",
  pretaxDeductions: undefined,
  usIsSenior: false,
  usSpouseIsSenior: false,
  usReportedTips: undefined,
  usQualifiedOvertimePremium: undefined,
  province: "Ontario",
  rrspContribution: undefined,
  isScotland: false,
  studentLoanPlan: "none",
  pensionContribution: undefined,
  germanTaxClass: "1",
  germanyState: "Berlin",
  germanyChildren: undefined,
  churchMember: false,
  germanHealthInsuranceType: "public",
  franceParts: 1,
  franceEmploymentType: "employee",
  netherlandsThirtyRuling: false,
  spainRegion: "Madrid",
  age: 30,
  italyRegion: "Lombardy",
  singaporeResidency: "resident",
  cpfEligible: true,
  indiaRegime: "new",
  oldRegimeDeductions: undefined,
  japanResidence: "tokyo",
  japanDependents: undefined,
};

function money(value: number, code: SalaryCountryCode) {
  const country = getCountryMeta(code);
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function num(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function optionalNum(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  return num(value);
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export default function SalaryCalculator() {
  const [countryCode, setCountryCode] = useState<SalaryCountryCode>("US");
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("annual");
  const [salaryAmount, setSalaryAmount] = useState(75_000);
  const [form, setForm] = useState(defaultForm);
  const country = useMemo(() => getCountryMeta(countryCode), [countryCode]);
  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const result = useMemo(
    () => calculateSalary({ countryCode, payPeriod, salaryAmount, ...form }),
    [countryCode, form, payPeriod, salaryAmount],
  );

  const renderCountryFields = () => {
    switch (countryCode) {
      case "US":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Filing status</span><select value={form.filingStatus} onChange={(e) => update("filingStatus", e.target.value as SalaryCalculationInput["filingStatus"])} className={fieldClass}>{US_FILING_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">State</span><select value={form.usState} onChange={(e) => update("usState", e.target.value)} className={fieldClass}>{US_STATES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Pre-tax deductions</span><input type="number" min={0} value={form.pretaxDeductions ?? ""} onChange={(e) => update("pretaxDeductions", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Qualified tips</span><input type="number" min={0} value={form.usReportedTips ?? ""} onChange={(e) => update("usReportedTips", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium text-muted-foreground">Qualified overtime premium</span><input type="number" min={0} value={form.usQualifiedOvertimePremium ?? ""} onChange={(e) => update("usQualifiedOvertimePremium", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"><input type="checkbox" checked={form.usIsSenior} onChange={(e) => update("usIsSenior", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />Taxpayer age 65 or older</label>
          {form.filingStatus === "married" ? <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"><input type="checkbox" checked={form.usSpouseIsSenior} onChange={(e) => update("usSpouseIsSenior", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />Spouse age 65 or older</label> : null}
        </>;
      case "CA":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Province</span><select value={form.province} onChange={(e) => update("province", e.target.value)} className={fieldClass}>{CANADA_PROVINCES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">RRSP contribution</span><input type="number" min={0} value={form.rrspContribution ?? ""} onChange={(e) => update("rrspContribution", optionalNum(e.target.value))} className={fieldClass} /></label>
        </>;
      case "GB":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Student loan plan</span><select value={form.studentLoanPlan} onChange={(e) => update("studentLoanPlan", e.target.value as SalaryCalculationInput["studentLoanPlan"])} className={fieldClass}>{["none","plan1","plan2","plan4","plan5"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Pension contribution</span><input type="number" min={0} value={form.pensionContribution ?? ""} onChange={(e) => update("pensionContribution", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground md:col-span-2"><input type="checkbox" checked={form.isScotland} onChange={(e) => update("isScotland", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />Use Scottish tax bands</label>
        </>;
      case "DE":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Tax class</span><select value={form.germanTaxClass} onChange={(e) => update("germanTaxClass", e.target.value as SalaryCalculationInput["germanTaxClass"])} className={fieldClass}>{["1","2","3","4","5","6"].map((item) => <option key={item} value={item}>Class {item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">State</span><select value={form.germanyState} onChange={(e) => update("germanyState", e.target.value)} className={fieldClass}>{GERMANY_STATES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Children</span><input type="number" min={0} value={form.germanyChildren ?? ""} onChange={(e) => update("germanyChildren", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Health insurance</span><select value={form.germanHealthInsuranceType} onChange={(e) => update("germanHealthInsuranceType", e.target.value as SalaryCalculationInput["germanHealthInsuranceType"])} className={fieldClass}><option value="public">Public</option><option value="private">Private</option></select></label>
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground md:col-span-2"><input type="checkbox" checked={form.churchMember} onChange={(e) => update("churchMember", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />Church member</label>
        </>;
      case "FR":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Family parts</span><input type="number" min={1} step={0.5} value={form.franceParts} onChange={(e) => update("franceParts", num(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Employment type</span><select value={form.franceEmploymentType} onChange={(e) => update("franceEmploymentType", e.target.value as SalaryCalculationInput["franceEmploymentType"])} className={fieldClass}><option value="employee">Employee</option><option value="self-employed">Self-employed</option></select></label>
        </>;
      case "NL":
        return <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground md:col-span-2"><input type="checkbox" checked={form.netherlandsThirtyRuling} onChange={(e) => update("netherlandsThirtyRuling", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />Apply 30% ruling</label>;
      case "ES":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Region</span><select value={form.spainRegion} onChange={(e) => update("spainRegion", e.target.value)} className={fieldClass}>{SPAIN_REGIONS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Age</span><input type="number" min={18} value={form.age} onChange={(e) => update("age", num(e.target.value))} className={fieldClass} /></label>
        </>;
      case "IT":
        return <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium text-muted-foreground">Region</span><select value={form.italyRegion} onChange={(e) => update("italyRegion", e.target.value)} className={fieldClass}>{ITALY_REGIONS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
      case "AE":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Basic salary</span><input type="number" min={0} value={form.uaeBasicSalary ?? ""} onChange={(e) => update("uaeBasicSalary", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Housing allowance</span><input type="number" min={0} value={form.uaeHousingAllowance ?? ""} onChange={(e) => update("uaeHousingAllowance", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Transport allowance</span><input type="number" min={0} value={form.uaeTransportAllowance ?? ""} onChange={(e) => update("uaeTransportAllowance", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Other allowances</span><input type="number" min={0} value={form.uaeOtherAllowances ?? ""} onChange={(e) => update("uaeOtherAllowances", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Overtime pay</span><input type="number" min={0} value={form.uaeOvertimePay ?? ""} onChange={(e) => update("uaeOvertimePay", optionalNum(e.target.value))} className={fieldClass} /></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Total deductions</span><input type="number" min={0} value={form.uaeTotalDeductions ?? ""} onChange={(e) => update("uaeTotalDeductions", optionalNum(e.target.value))} className={fieldClass} /></label>
        </>;
      case "SG":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Residency</span><select value={form.singaporeResidency} onChange={(e) => update("singaporeResidency", e.target.value as SalaryCalculationInput["singaporeResidency"])} className={fieldClass}><option value="resident">Resident</option><option value="non-resident">Non-resident</option></select></label>
          <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"><input type="checkbox" checked={form.cpfEligible} onChange={(e) => update("cpfEligible", e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />CPF eligible</label>
        </>;
      case "IN":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Tax regime</span><select value={form.indiaRegime} onChange={(e) => update("indiaRegime", e.target.value as SalaryCalculationInput["indiaRegime"])} className={fieldClass}><option value="new">New regime</option><option value="old">Old regime</option></select></label>
          {form.indiaRegime === "old" ? <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Old regime deductions</span><input type="number" min={0} value={form.oldRegimeDeductions ?? ""} onChange={(e) => update("oldRegimeDeductions", optionalNum(e.target.value))} className={fieldClass} /></label> : null}
        </>;
      case "JP":
        return <>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Residence</span><select value={form.japanResidence} onChange={(e) => update("japanResidence", e.target.value as SalaryCalculationInput["japanResidence"])} className={fieldClass}><option value="tokyo">Tokyo</option><option value="other">Other prefecture</option></select></label>
          <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Dependents</span><input type="number" min={0} value={form.japanDependents ?? ""} onChange={(e) => update("japanDependents", optionalNum(e.target.value))} className={fieldClass} /></label>
        </>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Country</span><SelectWrap><select value={countryCode} onChange={(e) => { const next = e.target.value as SalaryCountryCode; setCountryCode(next); setSalaryAmount(getCountryMeta(next).defaultSalary); }} className={`${fieldClass} appearance-none`}>{COUNTRIES.map((entry) => <option key={entry.code} value={entry.code}>{entry.name}</option>)}</select></SelectWrap></label>
              <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Pay period</span><SelectWrap><select value={payPeriod} onChange={(e) => setPayPeriod(e.target.value as PayPeriod)} className={`${fieldClass} appearance-none`}>{payPeriods.map((entry) => <option key={entry} value={entry}>{entry}</option>)}</select></SelectWrap></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {countryCode === "AE"
                ? <div className="rounded-[1rem] border border-border bg-background px-4 py-3 md:col-span-2"><p className="text-sm font-medium text-muted-foreground">Estimated annual gross</p><p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{money(result.annualGross, countryCode)}</p><p className="mt-1 text-xs text-muted-foreground">UAE mode uses monthly package inputs: basic salary, allowances, overtime, and deductions.</p></div>
                : <>
                    <label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Gross salary</span><input type="number" min={0} step={100} value={salaryAmount} onChange={(e) => setSalaryAmount(num(e.target.value))} className={fieldClass} /></label>
                    {payPeriod === "hourly" ? <div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Hours / week</span><input type="number" min={1} max={80} value={form.hoursPerWeek} onChange={(e) => update("hoursPerWeek", num(e.target.value))} className={fieldClass} /></label><label className="space-y-2"><span className="text-sm font-medium text-muted-foreground">Weeks / year</span><input type="number" min={1} max={52} value={form.weeksPerYear} onChange={(e) => update("weeksPerYear", num(e.target.value))} className={fieldClass} /></label></div> : <div className="rounded-[1rem] border border-border bg-background px-4 py-3"><p className="text-sm font-medium text-muted-foreground">Estimated annual gross</p><p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{money(result.annualGross, countryCode)}</p></div>}
                  </>}
            </div>
            <div className="grid gap-5 md:grid-cols-2">{renderCountryFields()}</div>
          </div>
          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Monthly take-home</p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">{money(result.periods.monthly.net, countryCode)}</div>
            <p className="mt-2 text-sm text-muted-foreground">Gross monthly: {money(result.periods.monthly.gross, countryCode)}</p>
            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Annual net</span><span className="font-medium text-foreground">{money(result.annualNet, countryCode)}</span></div>
              <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Total deductions</span><span className="font-medium text-foreground">{money(result.totalDeductions, countryCode)}</span></div>
              <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Employer cost</span><span className="font-medium text-foreground">{money(result.employerCost, countryCode)}</span></div>
              <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Effective tax rate</span><span className="font-medium text-foreground">{Math.round(result.effectiveTaxRate * 100)}%</span></div>
              <div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">Marginal tax rate</span><span className="font-medium text-foreground">{Math.round(result.marginalTaxRate * 100)}%</span></div>
            </div>
            <div className="mt-6 rounded-[1rem] border border-primary/15 bg-primary-soft p-4"><p className="text-sm leading-6 text-primary-soft-foreground">Tax year: {country.taxYear}. This is a quick salary estimate, not a payroll or filing substitute.</p></div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(["annual", "monthly", "weekly", "hourly"] as const).map((period) => <article key={period} className="rounded-[1.5rem] border border-border bg-background p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{period}</p><p className="mt-3 text-sm text-muted-foreground">Gross</p><p className="text-lg font-semibold tracking-tight text-foreground">{money(result.periods[period].gross, countryCode)}</p><p className="mt-3 text-sm text-muted-foreground">Net</p><p className="text-lg font-semibold tracking-tight text-foreground">{money(result.periods[period].net, countryCode)}</p></article>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <TaxBreakdownTable breakdown={result.breakdown} country={country} />
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h3 className="text-lg font-semibold text-foreground">Key figures</h3>
          <div className="mt-5 space-y-4">
            <div><p className="text-sm text-muted-foreground">Taxable income</p><p className="mt-1 text-lg font-semibold text-foreground">{money(result.taxableIncome, countryCode)}</p></div>
            <div><p className="text-sm text-muted-foreground">Income tax</p><p className="mt-1 text-lg font-semibold text-foreground">{money(result.incomeTax, countryCode)}</p></div>
            <div><p className="text-sm text-muted-foreground">Social contributions</p><p className="mt-1 text-lg font-semibold text-foreground">{money(result.socialContributions, countryCode)}</p></div>
            <div><p className="text-sm text-muted-foreground">Other deductions</p><p className="mt-1 text-lg font-semibold text-foreground">{money(result.otherDeductions, countryCode)}</p></div>
          </div>
        </div>
      </section>

      <BracketVisualizer brackets={result.bracketBreakdown} country={country} />

      {result.notes.length ? <section className="rounded-[1.5rem] border border-border bg-background p-5"><h3 className="text-lg font-semibold text-foreground">Calculation notes</h3><ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">{result.notes.map((note) => <li key={note}>{note}</li>)}</ul></section> : null}
    </div>
  );
}

