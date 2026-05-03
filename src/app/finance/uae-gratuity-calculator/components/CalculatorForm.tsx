"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, DollarSign, Clock, AlertCircle } from "lucide-react";
import { GratuityInputs } from "@/lib/calculators/uae-gratuity";

interface CalculatorFormProps {
  onCalculate: (inputs: GratuityInputs) => void;
}

export default function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const [inputs, setInputs] = useState<GratuityInputs>({
    basicSalary: 15000,
    startDate: oneYearAgo.toISOString().split("T")[0],
    endDate: today,
    unpaidLeaveDays: 0,
    contractType: "limited",
    workPattern: "full-time",
    weeklyHours: 40,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!inputs.basicSalary || inputs.basicSalary <= 0) newErrors.basicSalary = "Please enter a valid basic salary";
    if (!inputs.startDate) newErrors.startDate = "Start date is required";
    if (!inputs.endDate) newErrors.endDate = "End date is required";
    if (inputs.startDate && inputs.endDate && new Date(inputs.startDate) >= new Date(inputs.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (inputs.unpaidLeaveDays < 0) newErrors.unpaidLeaveDays = "Cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onCalculate(inputs);
  };

  const updateField = <K extends keyof GratuityInputs>(field: K, value: GratuityInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <DollarSign className="h-4 w-4 text-blue-600" />
          Basic Monthly Salary (AED) *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">AED</span>
          <input
            type="number"
            min="1"
            step="1"
            value={inputs.basicSalary}
            onChange={(e) => updateField("basicSalary", Number(e.target.value))}
            className={`w-full rounded-xl border ${errors.basicSalary ? "border-red-300 ring-red-100" : "border-slate-200 ring-slate-100"} bg-white py-3 pl-14 pr-4 text-slate-900 shadow-sm ring-1 focus:border-blue-500 focus:ring-blue-200 transition-all outline-none`}
            placeholder="e.g., 15000"
          />
        </div>
        {errors.basicSalary && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" /> {errors.basicSalary}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-500">Enter your basic salary only. Excludes housing, transport, and other allowances.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Calendar className="h-4 w-4 text-blue-600" />
            Start Date *
          </label>
          <input
            type="date"
            value={inputs.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            className={`w-full rounded-xl border ${errors.startDate ? "border-red-300" : "border-slate-200"} bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-slate-100 focus:border-blue-500 focus:ring-blue-200 transition-all outline-none`}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Calendar className="h-4 w-4 text-blue-600" />
            End Date *
          </label>
          <input
            type="date"
            value={inputs.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            className={`w-full rounded-xl border ${errors.endDate ? "border-red-300" : "border-slate-200"} bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-slate-100 focus:border-blue-500 focus:ring-blue-200 transition-all outline-none`}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <Briefcase className="h-4 w-4 text-blue-600" />
          Work Pattern
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { value: "full-time", label: "Full-Time" },
            { value: "part-time", label: "Part-Time" },
            { value: "temporary", label: "Temporary" },
            { value: "flexible", label: "Flexible" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateField("workPattern", option.value as GratuityInputs["workPattern"])}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                inputs.workPattern === option.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {inputs.workPattern !== "full-time" && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            Weekly Working Hours
          </label>
          <input
            type="number"
            min="1"
            max="168"
            value={inputs.weeklyHours}
            onChange={(e) => updateField("weeklyHours", Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-slate-100 focus:border-blue-500 focus:ring-blue-200 transition-all outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">Standard full-time is 40 hours/week. Your gratuity will be pro-rated accordingly.</p>
        </motion.div>
      )}

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          Unpaid Leave Days (Optional)
        </label>
        <input
          type="number"
          min="0"
          value={inputs.unpaidLeaveDays}
          onChange={(e) => updateField("unpaidLeaveDays", Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-slate-100 focus:border-blue-500 focus:ring-blue-200 transition-all outline-none"
          placeholder="0"
        />
        <p className="mt-1 text-xs text-slate-500">Unpaid leave days are excluded from gratuity calculation per MoHRE rules.</p>
      </div>

      <div className="rounded-lg bg-blue-50 p-3 ring-1 ring-blue-100">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Under Federal Decree-Law No. 33 of 2021 (effective Feb 2022), all new contracts are limited-term. 
          Resignation no longer reduces your gratuity entitlement.
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
      >
        Calculate My Gratuity
      </motion.button>
    </form>
  );
}
