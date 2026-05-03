"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp, Info, Download, Share2 } from "lucide-react";
import { calculateGratuity, formatCurrency, GratuityInputs, GratuityResult } from "@/lib/calculators/uae-gratuity";
import CalculatorForm from "./CalculatorForm";
import ResultCard from "./ResultCard";

export default function GratuityCalculator() {
  const [result, setResult] = useState<GratuityResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleCalculate = useCallback((inputs: GratuityInputs) => {
    const calcResult = calculateGratuity(inputs);
    setResult(calcResult);
    setShowBreakdown(false);
    
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById("calculation-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div id="calculator" className="mx-auto max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Gratuity Calculator</h2>
                <p className="text-sm text-slate-500">Enter your employment details below</p>
              </div>
            </div>
            <CalculatorForm onCalculate={handleCalculate} />
          </div>
        </div>

        <div className="lg:col-span-2" id="calculation-results">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ResultCard result={result} />
                
                <div className="mt-4">
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 hover:ring-blue-300 transition-all"
                  >
                    <span className="font-semibold text-slate-900 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      View Calculation Breakdown
                    </span>
                    {showBreakdown ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </button>
                  
                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <ol className="space-y-2">
                            {result.breakdown.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                  {i + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const text = `UAE Gratuity Calculation Result\nFinal Amount: ${formatCurrency(result.finalGratuity)}\nYears of Service: ${result.totalYears.toFixed(2)}\nCalculated using findbest.tools`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Copy Result
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Print / Save
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white/50 p-8 ring-1 ring-dashed ring-slate-300"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Calculator className="h-8 w-8 text-slate-400" />
                </div>
                <p className="mt-4 text-center text-slate-500">
                  Enter your details and click Calculate to see your gratuity estimate
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
