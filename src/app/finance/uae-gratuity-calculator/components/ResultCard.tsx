"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";
import { GratuityResult, formatCurrency } from "@/lib/calculators/uae-gratuity";

interface ResultCardProps {
  result: GratuityResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { finalGratuity, eligible, isCapped, twoYearCap, totalYears, dailyWage, proRataFactor } = result;

  if (!eligible) {
    return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-900">Not Eligible</h3>
        </div>
        <p className="text-amber-800">
          You have only served <strong>{totalYears.toFixed(2)} years</strong>. Under UAE Labour Law, 
          you must complete at least <strong>1 year of continuous service</strong> to be entitled to gratuity.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Your Gratuity Estimate</h3>
          <CheckCircle className="h-6 w-6 text-white/80" />
        </div>
        <p className="text-sm text-blue-100 mt-1">Based on Federal Decree-Law No. 33 of 2021</p>
      </div>

      <div className="px-6 py-6 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}>
          <span className="text-5xl font-extrabold tracking-tight text-slate-900">{formatCurrency(finalGratuity)}</span>
        </motion.div>
        <p className="mt-2 text-sm text-slate-500">Estimated end of service benefit</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
        <div className="px-4 py-4 text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Daily Wage</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(dailyWage)}</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Service Period</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{totalYears.toFixed(2)} yrs</p>
        </div>
      </div>

      {isCapped && (
        <div className="mx-4 mb-4 mt-2 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-800">
              <strong>2-Year Cap Applied:</strong> Your calculated gratuity exceeded the legal maximum of {formatCurrency(twoYearCap)}. 
              The amount has been capped accordingly.
            </div>
          </div>
        </div>
      )}

      {proRataFactor < 1 && (
        <div className="mx-4 mb-4 mt-2 rounded-lg bg-cyan-50 p-3 ring-1 ring-cyan-200">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-cyan-600 mt-0.5" />
            <div className="text-xs text-cyan-800">
              <strong>Pro-Rata Applied:</strong> Your gratuity was adjusted to {(proRataFactor * 100).toFixed(0)}% based on your part-time work schedule.
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 px-6 py-3">
        <div className="flex items-center gap-2 text-xs text-green-700">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Eligible for full gratuity under UAE Labour Law Article 51</span>
        </div>
      </div>
    </motion.div>
  );
}
