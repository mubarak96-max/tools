"use client";

import { useMemo, useState } from "react";

import { CURRENCIES } from "@/lib/tools/emi";
import {
  US_PAYROLL_TAX_RULES_2026,
  calculatePayrollTax,
} from "@/lib/tools/payroll-tax";

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

export default function PayrollTaxCalculator() {
  const [annualGrossWages, setAnnualGrossWages] = useState<number | "">(95_000);

  const result = useMemo(
    () =>
      calculatePayrollTax({
        annualGrossWages: annualGrossWages === "" ? 0 : annualGrossWages,
      }),
    [annualGrossWages],
  );

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <label className="block space-y-2 md:max-w-sm">
              <span className="text-sm font-medium text-muted-foreground">Annual gross wages (USD)</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={annualGrossWages}
                onChange={(e) => setAnnualGrossWages(optionalNum(e.target.value))}
                className={fieldClass}
              />
            </label>

            <div className="rounded-[1.25rem] border border-border/70 bg-background p-4 text-sm leading-6 text-muted-foreground">
              Scope: U.S. federal payroll taxes only. This page models 2026 Social Security, Medicare, Additional Medicare withholding above $200,000, and FUTA at the maximum standard credit assumption.
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Employee payroll taxes
            </p>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {formatCurrency(result.employeePayrollTaxes)}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Social Security, Medicare, and Additional Medicare when applicable.
            </p>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Employer payroll taxes</span>
                <span className="font-medium text-foreground">{formatCurrency(result.employerPayrollTaxesExcludingBenefits)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Social Security wage base</span>
                <span className="font-medium text-foreground">{formatCurrency(US_PAYROLL_TAX_RULES_2026.socialSecurityWageBase)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Employee Social Security", result.employeeSocialSecurity],
          ["Employee Medicare", result.employeeMedicare],
          ["Additional Medicare", result.employeeAdditionalMedicare],
          ["Employer Social Security", result.employerSocialSecurity],
          ["Employer Medicare", result.employerMedicare],
          ["FUTA after max credit", result.futaAfterMaxCredit],
          ["FUTA before credit", result.futaBeforeCredit],
          ["Taxable Social Security wages", result.taxableSocialSecurityWages],
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
