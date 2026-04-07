"use client";

import type { BracketSlice, SalaryCountryMeta } from "@/lib/tools/salary";

type BracketVisualizerProps = {
  brackets: BracketSlice[];
  country: SalaryCountryMeta;
};

function formatCurrency(value: number, country: SalaryCountryMeta) {
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BracketVisualizer({ brackets, country }: BracketVisualizerProps) {
  const totalTax = brackets.reduce((sum, bracket) => sum + bracket.taxAmount, 0);

  if (brackets.length === 0 || totalTax <= 0) {
    return (
      <div className="rounded-[1.5rem] border border-border bg-background p-5">
        <h3 className="text-lg font-semibold text-foreground">Tax bracket view</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No progressive income-tax slices apply for this setup, so there is no bracket chart to show.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-background p-5">
      <h3 className="text-lg font-semibold text-foreground">Tax bracket view</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This shows where your estimated tax is landing across the applicable brackets.
      </p>

      <div className="mt-6 space-y-4">
        {brackets.map((bracket) => {
          const share = totalTax > 0 ? (bracket.taxAmount / totalTax) * 100 : 0;

          return (
            <div key={`${bracket.label}-${bracket.from}-${bracket.to ?? "max"}`} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{bracket.label}</p>
                  <p className="text-muted-foreground">
                    {formatCurrency(bracket.from, country)}
                    {" - "}
                    {bracket.to === null ? "and above" : formatCurrency(bracket.to, country)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{Math.round(bracket.rate * 100)}%</p>
                  <p className="text-muted-foreground">{formatCurrency(bracket.taxAmount, country)}</p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(share, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
