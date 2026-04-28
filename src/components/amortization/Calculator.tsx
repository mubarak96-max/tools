"use client";

import { useState, useCallback, useMemo } from "react";
import { AmortizationTable } from "./AmortizationTable";
import { AmortizationChart } from "./AmortizationChart";
import { ResultsSummary } from "./ResultsSummary";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export function Calculator() {
  const [loanAmount, setLoanAmount] = useState<string>("300000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [extraPayment, setExtraPayment] = useState<string>("0");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [showResults, setShowResults] = useState(false);

  const calculateAmortization = useCallback(() => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (principal <= 0 || annualRate <= 0 || years <= 0) return;

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const newSchedule: AmortizationRow[] = [];
    let balance = principal;
    let totalInterest = 0;

    for (let month = 1; month <= numPayments && balance > 0; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + extra;

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      balance -= principalPayment;
      totalInterest += interestPayment;

      newSchedule.push({
        month,
        payment: monthlyPayment + extra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest,
      });

      if (balance <= 0.01) break;
    }

    setSchedule(newSchedule);
    setShowResults(true);
  }, [loanAmount, interestRate, loanTerm, extraPayment]);

  const stats = useMemo(() => {
    if (schedule.length === 0) return null;
    const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
    const totalInterest = schedule[schedule.length - 1].totalInterest;
    const originalTerm = parseFloat(loanTerm) * 12;
    const monthsSaved = originalTerm - schedule.length;
    
    return {
      monthlyPayment: schedule[0].payment,
      totalPaid,
      totalInterest,
      totalPrincipal: totalPaid - totalInterest,
      monthsSaved,
      payoffDate: new Date(
        new Date(startDate).setMonth(
          new Date(startDate).getMonth() + schedule.length
        )
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }, [schedule, loanTerm, startDate]);

  const downloadCSV = () => {
    const headers = [
      "Payment #",
      "Payment Date",
      "Payment Amount",
      "Principal",
      "Interest",
      "Total Interest",
      "Remaining Balance",
    ];
    const rows = schedule.map((row) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + row.month - 1);
      return [
        row.month,
        date.toISOString().split("T")[0],
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.totalInterest.toFixed(2),
        row.balance.toFixed(2),
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amortization-schedule-${loanAmount}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Loan Details
          </h2>
          <p className="text-sm text-slate-500">
            Enter your loan information to generate your amortization schedule
          </p>
        </div>
        
        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Loan Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Loan Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="300000"
                min="1"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-8 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="6.5"
                min="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Loan Term (Years)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="5">5 Years</option>
              <option value="7">7 Years</option>
              <option value="10">10 Years</option>
              <option value="15">15 Years</option>
              <option value="20">20 Years</option>
              <option value="25">25 Years</option>
              <option value="30">30 Years</option>
            </select>
          </div>

          {/* Extra Payment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Extra Monthly Payment ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="0"
                min="0"
              />
            </div>
            <p className="text-xs text-slate-500">Optional: Add extra principal payments</p>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              First Payment Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Calculate Button */}
          <div className="flex items-end">
            <button
              onClick={calculateAmortization}
              className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              Calculate Amortization Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && stats && (
        <div className="space-y-8">
          <ResultsSummary stats={stats} />
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <AmortizationChart schedule={schedule} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-900 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>

          <AmortizationTable schedule={schedule} startDate={startDate} />
        </div>
      )}
    </div>
  );
}
