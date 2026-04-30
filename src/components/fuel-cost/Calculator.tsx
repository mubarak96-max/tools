"use client";

import { useState, useMemo, useCallback } from "react";
import { TripComparison } from "./TripComparison";
import { CostBreakdown } from "./CostBreakdown";

interface Vehicle {
  name: string;
  mpg: number;
  fuelType: "gas" | "diesel" | "electric";
  kwhPer100Mi?: number;
}

const VEHICLE_PRESETS: Vehicle[] = [
  { name: "Toyota Camry", mpg: 32, fuelType: "gas" },
  { name: "Honda Civic", mpg: 36, fuelType: "gas" },
  { name: "Ford F-150", mpg: 20, fuelType: "gas" },
  { name: "Toyota Prius", mpg: 52, fuelType: "gas" },
  { name: "Tesla Model 3", mpg: 0, fuelType: "electric", kwhPer100Mi: 25 },
  { name: "Honda CR-V", mpg: 30, fuelType: "gas" },
  { name: "Chevy Silverado", mpg: 18, fuelType: "gas" },
  { name: "BMW 3 Series", mpg: 28, fuelType: "gas" },
  { name: "Ford Mustang", mpg: 24, fuelType: "gas" },
  { name: "Custom Vehicle", mpg: 25, fuelType: "gas" },
];

const STATE_GAS_PRICES: Record<string, number> = {
  CA: 4.85, WA: 4.25, HI: 4.65, NV: 4.15, OR: 4.05,
  AK: 4.35, IL: 3.95, PA: 3.75, NY: 3.65, MI: 3.55,
  FL: 3.25, TX: 3.05, OH: 3.35, GA: 3.15, NC: 3.20,
  AZ: 3.45, TN: 3.10, MO: 3.15, IN: 3.25, WI: 3.30,
  CO: 3.40, MN: 3.35, SC: 3.15, AL: 3.10, LA: 3.05,
  KY: 3.20, OK: 3.00, UT: 3.35, IA: 3.20, AR: 3.05,
  KS: 3.15, MS: 3.05, NE: 3.20, SD: 3.25, ND: 3.20,
  NM: 3.30, WV: 3.25, ID: 3.45, MT: 3.35, WY: 3.30,
  ME: 3.55, NH: 3.45, VT: 3.50, MA: 3.60, RI: 3.55,
  CT: 3.65, NJ: 3.55, DE: 3.45, MD: 3.50, VA: 3.35,
  DC: 3.60, US: 3.45,
};

export function Calculator() {
  const [tripDistance, setTripDistance] = useState<string>("500");
  const [roundTrip, setRoundTrip] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(VEHICLE_PRESETS[0]);
  const [customMpg, setCustomMpg] = useState<string>("32");
  const [fuelPrice, setFuelPrice] = useState<string>("3.45");
  const [electricityRate, setElectricityRate] = useState<string>("0.14");
  const [commuteDays, setCommuteDays] = useState<string>("22");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareVehicle, setCompareVehicle] = useState<Vehicle>(VEHICLE_PRESETS[3]);
  const [showResults, setShowResults] = useState(true);

  const totalDistance = useMemo(() => {
    const base = parseFloat(tripDistance) || 0;
    return roundTrip ? base * 2 : base;
  }, [tripDistance, roundTrip]);

  const calculateCost = useCallback((vehicle: Vehicle, distance: number, gasPrice: number, elecRate: number) => {
    if (vehicle.fuelType === "electric" && vehicle.kwhPer100Mi) {
      const kwhNeeded = (distance / 100) * vehicle.kwhPer100Mi;
      const cost = kwhNeeded * elecRate;
      return { gallons: 0, kwh: kwhNeeded, cost, costPerMile: cost / distance };
    }
    const gallons = distance / vehicle.mpg;
    const cost = gallons * gasPrice;
    return { gallons, kwh: 0, cost, costPerMile: cost / distance };
  }, []);

  const mainResult = useMemo(() => {
    const vehicle = selectedVehicle.name === "Custom Vehicle" 
      ? { ...selectedVehicle, mpg: parseFloat(customMpg) || 25 }
      : selectedVehicle;
    return calculateCost(vehicle, totalDistance, parseFloat(fuelPrice) || 3.45, parseFloat(electricityRate) || 0.14);
  }, [selectedVehicle, customMpg, totalDistance, fuelPrice, electricityRate, calculateCost]);

  const compareResult = useMemo(() => {
    if (!compareMode) return null;
    return calculateCost(compareVehicle, totalDistance, parseFloat(fuelPrice) || 3.45, parseFloat(electricityRate) || 0.14);
  }, [compareMode, compareVehicle, totalDistance, fuelPrice, electricityRate, calculateCost]);

  const annualCommute = useMemo(() => {
    const days = parseFloat(commuteDays) || 22;
    const annualDistance = totalDistance * days * 12;
    const vehicle = selectedVehicle.name === "Custom Vehicle"
      ? { ...selectedVehicle, mpg: parseFloat(customMpg) || 25 }
      : selectedVehicle;
    return calculateCost(vehicle, annualDistance, parseFloat(fuelPrice) || 3.45, parseFloat(electricityRate) || 0.14);
  }, [commuteDays, totalDistance, selectedVehicle, customMpg, fuelPrice, electricityRate, calculateCost]);

  const handleStateSelect = (state: string) => {
    setFuelPrice(STATE_GAS_PRICES[state].toString());
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="space-y-8">
      {/* Trip & Vehicle Inputs */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Trip & Vehicle Configuration</h2>
          <p className="text-sm text-slate-500">Enter your route details and vehicle information</p>
        </div>

        <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Distance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Trip Distance (miles)</label>
            <input
              type="number"
              value={tripDistance}
              onChange={(e) => setTripDistance(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="500"
            />
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              Round trip ({totalDistance} miles total)
            </label>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vehicle</label>
            <select
              value={selectedVehicle.name}
              onChange={(e) => {
                const v = VEHICLE_PRESETS.find(v => v.name === e.target.value) || VEHICLE_PRESETS[0];
                setSelectedVehicle(v);
              }}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {VEHICLE_PRESETS.map((v) => (
                <option key={v.name} value={v.name}>{v.name} {v.fuelType === "electric" ? "(EV)" : `(${v.mpg} MPG)`}</option>
              ))}
            </select>
            {selectedVehicle.name === "Custom Vehicle" && (
              <input
                type="number"
                value={customMpg}
                onChange={(e) => setCustomMpg(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 px-4 text-slate-900 text-sm"
                placeholder="Enter MPG"
              />
            )}
          </div>

          {/* Fuel Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Fuel Price ($/gal)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(STATE_GAS_PRICES).slice(0, 8).map(([state, price]) => (
                <button
                  key={state}
                  onClick={() => handleStateSelect(state)}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {state} ${price}
                </button>
              ))}
            </div>
          </div>

          {/* Electricity Rate (for EVs) */}
          {selectedVehicle.fuelType === "electric" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Electricity Rate ($/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={electricityRate}
                onChange={(e) => setElectricityRate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          )}

          {/* Commute Days */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Monthly Commute Days</label>
            <input
              type="number"
              value={commuteDays}
              onChange={(e) => setCommuteDays(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <p className="text-xs text-slate-500">For annual cost projection</p>
          </div>

          {/* Compare Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`w-full rounded-lg px-6 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${
                compareMode
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
              }`}
            >
              {compareMode ? "Disable Comparison" : "Compare Another Vehicle"}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Vehicle */}
      {compareMode && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-top-2">
          <div className="border-b border-slate-100 bg-amber-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Comparison Vehicle</h2>
          </div>
          <div className="p-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Compare With</label>
              <select
                value={compareVehicle.name}
                onChange={(e) => {
                  const v = VEHICLE_PRESETS.find(v => v.name === e.target.value) || VEHICLE_PRESETS[3];
                  setCompareVehicle(v);
                }}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-amber-500 focus:outline-none"
              >
                {VEHICLE_PRESETS.map((v) => (
                  <option key={v.name} value={v.name}>{v.name} {v.fuelType === "electric" ? "(EV)" : `(${v.mpg} MPG)`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Results Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
              <p className="text-sm font-medium text-slate-500">Trip Fuel Cost</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(mainResult.cost)}</p>
              <p className="text-xs text-slate-500 mt-1">{totalDistance} miles</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
              <p className="text-sm font-medium text-slate-500">Cost Per Mile</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(mainResult.costPerMile)}</p>
              <p className="text-xs text-slate-500 mt-1">Fuel only</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
              <p className="text-sm font-medium text-slate-500">Annual Commute</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{formatCurrency(annualCommute.cost)}</p>
              <p className="text-xs text-slate-500 mt-1">{parseFloat(commuteDays) * 12} days/year</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-slate-500" />
              <p className="text-sm font-medium text-slate-500">Gallons Needed</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{mainResult.gallons.toFixed(1)}</p>
              <p className="text-xs text-slate-500 mt-1">{selectedVehicle.fuelType === "electric" ? "kWh: " + mainResult.kwh.toFixed(1) : "gallons"}</p>
            </div>
          </div>

          {/* Comparison */}
          {compareMode && compareResult && (
            <TripComparison
              vehicle1={{ name: selectedVehicle.name, ...mainResult }}
              vehicle2={{ name: compareVehicle.name, ...compareResult }}
              distance={totalDistance}
            />
          )}

          <CostBreakdown
            mainResult={mainResult}
            annualCommute={annualCommute}
            vehicle={selectedVehicle}
            distance={totalDistance}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                const csv = `Fuel Cost Calculation\nVehicle,${selectedVehicle.name}\nDistance,${totalDistance} miles\nFuel Price,$${fuelPrice}/gal\nTrip Cost,${formatCurrency(mainResult.cost)}\nCost Per Mile,${formatCurrency(mainResult.costPerMile)}\nAnnual Commute,${formatCurrency(annualCommute.cost)}`;
                const blob = new Blob([csv], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `fuel-cost-${selectedVehicle.name.replace(/\s+/g, "-")}.csv`;
                a.click();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-900 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
