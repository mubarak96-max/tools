"use client";

import { useMemo, useState, useRef } from "react";
import { 
  NumberField, 
  ResultCard, 
  SelectField, 
  formatMoney, 
  formatPercent 
} from "@/components/real-estate/shared";
import { calculateNycTransferTax } from "@/lib/tools/real-estate";
import { PrinterIcon } from "lucide-react";

const USD_MARKET = { key: "US", label: "United States", currency: "USD", locale: "en-US" } as const;

export default function NYCTransferTaxCalculator() {
  const [transferPrice, setTransferPrice] = useState("");
  const [propertyType, setPropertyType] = useState("residential-1-3-family");
  const printRef = useRef<HTMLDivElement>(null);

  const result = useMemo(
    () =>
      calculateNycTransferTax({
        transferPrice: Number(transferPrice) || 0,
        propertyType: propertyType as "residential-1-3-family" | "condo" | "co-op" | "other",
      }),
    [propertyType, transferPrice],
  );

  const handlePrint = () => {
    window.print();
  };

  const totalTaxes = result.totalEstimatedTax;
  const breakDown = [
    { label: "NYC RPTT", value: result.nycRptt, rate: result.nycRate, color: "bg-blue-500" },
    { label: "NYS Transfer Tax", value: result.nysTransferTax, rate: result.nysRate, color: "bg-emerald-500" },
    { label: "NYS Mansion Tax", value: result.mansionTax, rate: (result.mansionTax / (Number(transferPrice) || 1)) * 100, color: "bg-amber-500" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 print:m-0 print:p-0">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8 print:hidden">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="Transfer price"
            value={transferPrice}
            onChange={setTransferPrice}
            placeholder="Enter transfer price"
          />
          <SelectField
            label="Property type"
            value={propertyType}
            onChange={setPropertyType}
            options={[
              { label: "Residential 1-3 family home", value: "residential-1-3-family" },
              { label: "Condominium (Condo)", value: "condo" },
              { label: "Co-operative (Co-op)", value: "co-op" },
              { label: "Other property type (Commercial)", value: "other" },
            ]}
            helper="NYC and NYS transfer tax rates differ by property class and price thresholds."
          />
          <div className="flex items-end">
            <button
              onClick={handlePrint}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-medium transition-all hover:bg-secondary/80"
            >
              <PrinterIcon className="h-4 w-4" />
              Print Results
            </button>
          </div>
        </div>
      </section>

      <section ref={printRef} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="NYC RPTT Rate"
            value={formatPercent(result.nycRate)}
            helper="Current NYC Real Property Transfer Tax rate."
          />
          <ResultCard
            label="Estimated NYC RPTT"
            value={formatMoney(result.nycRptt, USD_MARKET)}
            helper="NYC City-level transfer tax."
          />
          <ResultCard
            label="Estimated NYS Tax"
            value={formatMoney(result.nysTransferTax, USD_MARKET)}
            helper="NYS State-level base transfer tax."
          />
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">Total Estimated Taxes</p>
            <p className="mt-2 text-3xl font-bold text-primary">{formatMoney(result.totalEstimatedTax, USD_MARKET)}</p>
            <p className="mt-1 text-xs text-muted-foreground/80">Combined City and State taxes.</p>
          </div>
        </div>

        {totalTaxes > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h3 className="mb-6 text-lg font-bold">Detailed Tax Breakdown</h3>
            
            <div className="mb-8">
              <div className="flex h-10 w-full overflow-hidden rounded-full bg-muted/30">
                {breakDown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} transition-all duration-500`}
                    style={{ width: `${(item.value / totalTaxes) * 100}%` }}
                    title={`${item.label}: ${formatMoney(item.value, USD_MARKET)}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {breakDown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.label} ({Math.round((item.value / totalTaxes) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border">
                  <tr>
                    <th className="py-3 font-semibold text-muted-foreground">Tax Type</th>
                    <th className="py-3 font-semibold text-muted-foreground">Official Rate</th>
                    <th className="py-3 text-right font-semibold text-muted-foreground">Amount Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-4 font-medium">NYC Real Property Transfer Tax (RPTT)</td>
                    <td className="py-4 text-sm text-muted-foreground">{formatPercent(result.nycRate)}</td>
                    <td className="py-4 text-right font-semibold">{formatMoney(result.nycRptt, USD_MARKET)}</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium">NYS Base Transfer Tax</td>
                    <td className="py-4 text-sm text-muted-foreground">{formatPercent(result.nysRate)}</td>
                    <td className="py-4 text-right font-semibold">{formatMoney(result.nysTransferTax, USD_MARKET)}</td>
                  </tr>
                  {result.mansionTax > 0 && (
                    <tr>
                      <td className="py-4 font-medium">NYS Mansion Tax</td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {formatPercent((result.mansionTax / (Number(transferPrice) || 1)) * 100)} 
                        <span className="ml-1 text-[10px] italic opacity-70">(Effective)</span>
                      </td>
                      <td className="py-4 text-right font-semibold">{formatMoney(result.mansionTax, USD_MARKET)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary/20 bg-primary/5">
                    <td className="py-4 pl-4 font-bold">Total Transfer Taxes Due</td>
                    <td></td>
                    <td className="py-4 pr-4 text-right font-bold text-primary">{formatMoney(result.totalEstimatedTax, USD_MARKET)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
