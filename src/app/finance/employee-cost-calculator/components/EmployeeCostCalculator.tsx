"use client";

import { useMemo, useState } from "react";

import { CURRENCIES } from "@/lib/tools/emi";
import { calculateEmployeeCost } from "@/lib/tools/employee-cost";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(CURRENCIES[0].locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EmployeeCostCalculator() {
  const [annualGrossSalary, setAnnualGrossSalary] = useState<number | "">(95_000);
  const [annualBenefitsCost, setAnnualBenefitsCost] = useState<number | "">(12_000);
  const [employerRetirementContributionPercent, setEmployerRetirementContributionPercent] =
    useState<number | "">(4);

  const result = useMemo(
    () =>
      calculateEmployeeCost({
        annualGrossSalary: annualGrossSalary === "" ? 0 : annualGrossSalary,
        annualBenefitsCost: annualBenefitsCost === "" ? 0 : annualBenefitsCost,
        employerRetirementContributionPercent:
          employerRetirementContributionPercent === ""
            ? 0
            : employerRetirementContributionPercent,
      }),
    [annualBenefitsCost, annualGrossSalary, employerRetirementContributionPercent],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Annual gross salary (USD)</span>
              <input type="number" min={0} step="0.01" value={annualGrossSalary} onChange={(e) => setAnnualGrossSalary(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Annual benefits cost</span>
              <input type="number" min={0} step="0.01" value={annualBenefitsCost} onChange={(e) => setAnnualBenefitsCost(optionalNum(e.target.value))} className={fieldClass} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-muted-foreground">Employer retirement contribution %</span>
              <input type="number" min={0} step="0.01" value={employerRetirementContributionPercent} onChange={(e) => setEmployerRetirementContributionPercent(optionalNum(e.target.value))} className={fieldClass} />
            </label>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total employer cost
            </p>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.totalAnnualEmployerCost)}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Salary plus federal payroll taxes, annual benefits, and employer retirement contribution.
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Monthly employer cost</span>
                <span className="font-medium text-foreground">{formatCurrency(result.monthlyEmployerCost)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Employer payroll taxes</span>
                <span className="font-medium text-foreground">{formatCurrency(result.employerPayrollTaxes)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Gross salary", result.annualGrossSalary],
          ["Benefits cost", result.annualBenefitsCost],
          ["Retirement contribution", result.employerRetirementContribution],
          ["Employer payroll taxes", result.employerPayrollTaxes],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(value as number)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
