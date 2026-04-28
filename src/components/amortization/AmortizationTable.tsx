"use client";

import { useState } from "react";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export function AmortizationTable({
  schedule,
  startDate,
}: {
  schedule: AmortizationRow[];
  startDate: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 12;

  const paginated = schedule.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const totalPages = Math.ceil(schedule.length / rowsPerPage);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const getDate = (monthOffset: number) => {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + monthOffset);
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Amortization Schedule Table
        </h3>
        <span className="text-sm text-slate-500">
          {schedule.length} payments total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 font-semibold text-slate-700">#</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Payment</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Principal</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Interest</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Total Interest</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((row) => (
              <tr
                key={row.month}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-3 text-slate-600">{row.month}</td>
                <td className="px-6 py-3 text-slate-600">
                  {getDate(row.month - 1)}
                </td>
                <td className="px-6 py-3 text-right font-medium text-slate-900">
                  {formatCurrency(row.payment)}
                </td>
                <td className="px-6 py-3 text-right text-emerald-600 font-medium">
                  {formatCurrency(row.principal)}
                </td>
                <td className="px-6 py-3 text-right text-amber-600">
                  {formatCurrency(row.interest)}
                </td>
                <td className="px-6 py-3 text-right text-slate-600">
                  {formatCurrency(row.totalInterest)}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-900">
                  {formatCurrency(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
