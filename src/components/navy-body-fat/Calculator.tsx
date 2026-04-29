"use client";

import { useState, useMemo, useCallback } from "react";
import { StandardsTable } from "./StandardsTable";
import { PRTReadiness } from "./PRTReadiness";

interface BodyFatResult {
  bodyFat: number;
  status: "within" | "warning" | "over";
  maxAllowed: number;
  margin: number;
  bmi: number;
}

const NAVY_MAX_BODY_FAT = {
  male: {
    "17-20": 22,
    "21-27": 23,
    "28-39": 24,
    "40+": 26,
  },
  female: {
    "17-20": 33,
    "21-27": 34,
    "28-39": 35,
    "40+": 36,
  },
};

function getAgeBracket(age: number): string {
  if (age <= 20) return "17-20";
  if (age <= 27) return "21-27";
  if (age <= 39) return "28-39";
  return "40+";
}

function calculateMaleBodyFat(neck: number, abdomen: number, height: number): number {
  // Navy male formula: %BF = 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76
  const abdomenNeck = abdomen - neck;
  if (abdomenNeck <= 0) return 0;
  const bodyFat = 86.01 * Math.log10(abdomenNeck) - 70.041 * Math.log10(height) + 36.76;
  return Math.max(0, bodyFat);
}

function calculateFemaleBodyFat(neck: number, waist: number, hip: number, height: number): number {
  // Navy female formula: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
  const waistHipNeck = waist + hip - neck;
  if (waistHipNeck <= 0) return 0;
  const bodyFat = 163.205 * Math.log10(waistHipNeck) - 97.684 * Math.log10(height) - 78.387;
  return Math.max(0, bodyFat);
}

function calculateBMI(weight: number, height: number): number {
  // weight in lbs, height in inches
  return (weight / (height * height)) * 703;
}

export function Calculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("25");
  const [height, setHeight] = useState<string>("70"); // inches
  const [weight, setWeight] = useState<string>("185"); // lbs
  const [neck, setNeck] = useState<string>("16");
  const [abdomen, setAbdomen] = useState<string>("34");
  const [waist, setWaist] = useState<string>("28");
  const [hip, setHip] = useState<string>("38");
  const [showResults, setShowResults] = useState(false);

  const result = useMemo((): BodyFatResult | null => {
    const ageNum = parseInt(age) || 25;
    const heightNum = parseFloat(height) || 70;
    const weightNum = parseFloat(weight) || 185;
    const neckNum = parseFloat(neck) || 16;
    
    let bodyFat = 0;
    
    if (gender === "male") {
      const abdomenNum = parseFloat(abdomen) || 34;
      bodyFat = calculateMaleBodyFat(neckNum, abdomenNum, heightNum);
    } else {
      const waistNum = parseFloat(waist) || 28;
      const hipNum = parseFloat(hip) || 38;
      bodyFat = calculateFemaleBodyFat(neckNum, waistNum, hipNum, heightNum);
    }

    const ageBracket = getAgeBracket(ageNum);
    const maxAllowed = NAVY_MAX_BODY_FAT[gender][ageBracket as keyof typeof NAVY_MAX_BODY_FAT.male];
    const margin = maxAllowed - bodyFat;
    const bmi = calculateBMI(weightNum, heightNum);

    let status: "within" | "warning" | "over";
    if (bodyFat <= maxAllowed - 2) status = "within";
    else if (bodyFat <= maxAllowed) status = "warning";
    else status = "over";

    return { bodyFat, status, maxAllowed, margin, bmi };
  }, [gender, age, height, weight, neck, abdomen, waist, hip]);

  const formatInches = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const rem = Math.round(inches % 12);
    return `${feet}'${rem}"`;
  };

  return (
    <div className="space-y-8">
      {/* Gender & Basic Info */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Sailor Information</h2>
          <p className="text-sm text-slate-500">Enter your demographics for accurate standards</p>
        </div>
        
        <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <div className="flex rounded-lg border border-slate-300 p-1">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  gender === "male"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  gender === "female"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              min="17"
              max="80"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Height (inches)</label>
            <div className="relative">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-16 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {formatInches(parseFloat(height) || 0)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Weight (lbs)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Circumference Measurements (inches)
          </h2>
          <p className="text-sm text-slate-500">
            {gender === "male" 
              ? "Measure neck and abdomen per OPNAVINST 6110.1J" 
              : "Measure neck, waist (narrowest), and hips (widest)"}
          </p>
        </div>

        <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Neck</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">in</span>
            </div>
            <p className="text-xs text-slate-500">Below larynx, perpendicular</p>
          </div>

          {gender === "male" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Abdomen</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={abdomen}
                  onChange={(e) => setAbdomen(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">in</span>
              </div>
              <p className="text-xs text-slate-500">At navel, horizontal, after exhale</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Waist (narrowest)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">in</span>
                </div>
                <p className="text-xs text-slate-500">Natural waist, narrowest point</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Hips (widest)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">in</span>
                </div>
                <p className="text-xs text-slate-500">Widest point of buttocks</p>
              </div>
            </>
          )}

          <div className="flex items-end">
            <button
              onClick={() => setShowResults(true)}
              className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              Calculate Navy Body Fat
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
              <p className="text-sm font-medium text-slate-500">Body Fat %</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{result.bodyFat.toFixed(1)}%</p>
              <p className="text-xs text-slate-500 mt-1">Navy circumference method</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className={`absolute top-0 left-0 h-1 w-full ${
                result.status === "within" ? "bg-emerald-500" : result.status === "warning" ? "bg-amber-500" : "bg-red-500"
              }`} />
              <p className="text-sm font-medium text-slate-500">Navy Standard</p>
              <p className={`mt-2 text-3xl font-bold ${
                result.status === "within" ? "text-emerald-600" : result.status === "warning" ? "text-amber-600" : "text-red-600"
              }`}>
                {result.status === "within" ? "WITHIN" : result.status === "warning" ? "WARNING" : "OVER"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Max: {result.maxAllowed}%</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500" />
              <p className="text-sm font-medium text-slate-500">Margin</p>
              <p className={`mt-2 text-3xl font-bold ${result.margin >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {result.margin > 0 ? "+" : ""}{result.margin.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {result.margin > 0 ? "Below max" : "Over limit"}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-slate-500" />
              <p className="text-sm font-medium text-slate-500">BMI</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{result.bmi.toFixed(1)}</p>
              <p className="text-xs text-slate-500 mt-1">Reference only</p>
            </div>
          </div>

          <PRTReadiness result={result} gender={gender} age={parseInt(age) || 25} />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const csv = `Navy Body Fat Assessment\nGender,${gender}\nAge,${age}\nHeight,${height} in\nWeight,${weight} lbs\nBody Fat,${result.bodyFat.toFixed(1)}%\nMax Allowed,${result.maxAllowed}%\nStatus,${result.status}\nBMI,${result.bmi.toFixed(1)}`;
                const blob = new Blob([csv], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `navy-body-fat-${gender}.csv`;
                a.click();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-900 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Record
            </button>
          </div>
        </div>
      )}

      <StandardsTable />
    </div>
  );
}
