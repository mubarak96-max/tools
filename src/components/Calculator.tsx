"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, Home, Building2, Paintbrush, ArrowRightLeft, TrendingUp, DollarSign, Maximize, Info } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

type CalculatorMode = "real-estate" | "construction" | "flooring" | "rent" | "reverse";

interface CalculationResult {
  pricePerSqFt: number;
  totalCost: number;
  squareFeet: number;
  additionalMetrics: {
    label: string;
    value: string;
  }[];
}

export default function PricePerSquareFootCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("real-estate");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [squareFeet, setSquareFeet] = useState<string>("");
  const [pricePerSqFt, setPricePerSqFt] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [comparison, setComparison] = useState<{ price: string; sqft: string; name: string }[]>([
    { price: "", sqft: "", name: "Property A" },
    { price: "", sqft: "", name: "Property B" },
  ]);

  const calculate = useCallback(() => {
    const price = parseFloat(totalPrice.replace(/,/g, ""));
    const sqft = parseFloat(squareFeet.replace(/,/g, ""));
    const psf = parseFloat(pricePerSqFt.replace(/,/g, ""));

    let calcResult: CalculationResult | null = null;

    switch (mode) {
      case "real-estate":
      case "construction":
      case "flooring":
        if (price > 0 && sqft > 0) {
          const psfValue = price / sqft;
          calcResult = {
            pricePerSqFt: psfValue,
            totalCost: price,
            squareFeet: sqft,
            additionalMetrics: [
              {
                label: "Cost per Square Yard",
                value: formatCurrency(psfValue * 9),
              },
              {
                label: "Cost per Square Meter",
                value: formatCurrency(psfValue * 10.764),
              },
              {
                label: "Total Square Yards",
                value: formatNumber(sqft / 9),
              },
            ],
          };
        }
        break;

      case "rent":
        if (price > 0 && sqft > 0) {
          const monthlyPsf = price / sqft;
          calcResult = {
            pricePerSqFt: monthlyPsf,
            totalCost: price,
            squareFeet: sqft,
            additionalMetrics: [
              {
                label: "Annual Rent per Sq Ft",
                value: formatCurrency(monthlyPsf * 12),
              },
              {
                label: "Annual Total Rent",
                value: formatCurrency(price * 12),
              },
              {
                label: "Rent per Square Yard",
                value: formatCurrency(monthlyPsf * 9),
              },
            ],
          };
        }
        break;

      case "reverse":
        if (psf > 0 && sqft > 0) {
          const total = psf * sqft;
          calcResult = {
            pricePerSqFt: psf,
            totalCost: total,
            squareFeet: sqft,
            additionalMetrics: [
              {
                label: "Total Price (Rounded)",
                value: formatCurrency(Math.round(total)),
              },
              {
                label: "10% Down Payment",
                value: formatCurrency(total * 0.1),
              },
              {
                label: "20% Down Payment",
                value: formatCurrency(total * 0.2),
              },
            ],
          };
        }
        break;
    }

    setResult(calcResult);
  }, [mode, totalPrice, squareFeet, pricePerSqFt]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: "real-estate",
      label: "Real Estate",
      icon: <Home className="w-5 h-5" />,
      description: "Calculate home price per square foot",
    },
    {
      id: "construction",
      label: "Construction",
      icon: <Building2 className="w-5 h-5" />,
      description: "Estimate building costs per sq ft",
    },
    {
      id: "flooring",
      label: "Flooring",
      icon: <Maximize className="w-5 h-5" />,
      description: "Flooring material cost calculator",
    },
    {
      id: "rent",
      label: "Rent",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Calculate rent per square foot",
    },
    {
      id: "reverse",
      label: "Reverse Calc",
      icon: <ArrowRightLeft className="w-5 h-5" />,
      description: "Find total price from PSF rate",
    },
  ];

  const getInputLabel = () => {
    switch (mode) {
      case "rent":
        return "Monthly Rent";
      case "reverse":
        return "Price Per Square Foot";
      default:
        return "Total Price / Cost";
    }
  };

  const getSecondaryLabel = () => {
    switch (mode) {
      case "reverse":
        return "Square Footage";
      default:
        return "Square Feet";
    }
  };

  const getResultLabel = () => {
    switch (mode) {
      case "rent":
        return "Rent Per Square Foot (Monthly)";
      case "reverse":
        return "Total Estimated Price";
      default:
        return "Price Per Square Foot";
    }
  };

  const updateComparison = (index: number, field: "price" | "sqft" | "name", value: string) => {
    const newComparison = [...comparison];
    newComparison[index][field] = value;
    setComparison(newComparison);
  };

  const getComparisonResults = () => {
    return comparison.map((item) => {
      const price = parseFloat(item.price.replace(/,/g, ""));
      const sqft = parseFloat(item.sqft.replace(/,/g, ""));
      if (price > 0 && sqft > 0) {
        return { ...item, psf: price / sqft, valid: true };
      }
      return { ...item, psf: 0, valid: false };
    });
  };

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              setResult(null);
              setTotalPrice("");
              setSquareFeet("");
              setPricePerSqFt("");
            }}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              mode === m.id
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {m.icon}
            <span className="mt-2 text-sm font-semibold">{m.label}</span>
            <span className="text-xs text-gray-500 mt-1 hidden md:block">{m.description}</span>
          </button>
        ))}
      </div>

      {/* Main Calculator */}
      <div className="calculator-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Calculator className="w-6 h-6 text-primary-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "real-estate" && "Real Estate Price Per Square Foot Calculator"}
              {mode === "construction" && "Construction Cost Per Square Foot Calculator"}
              {mode === "flooring" && "Flooring Cost Per Square Foot Calculator"}
              {mode === "rent" && "Rent Per Square Foot Calculator"}
              {mode === "reverse" && "Reverse Price Per Square Foot Calculator"}
            </h2>
            <p className="text-sm text-gray-500">
              Enter your values below for instant calculation
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mode !== "reverse" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {getInputLabel()}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="decimal"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="e.g., 450000"
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {mode === "rent" ? "Enter the monthly rental amount" : "Enter total price or project cost"}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {getInputLabel()}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="decimal"
                  value={pricePerSqFt}
                  onChange={(e) => setPricePerSqFt(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="e.g., 250"
                  className="input-field pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter the price per square foot rate</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {getSecondaryLabel()}
            </label>
            <div className="relative">
              <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                inputMode="decimal"
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="e.g., 2000"
                className="input-field pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter the total area in square feet</p>
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-200">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-primary-700 uppercase tracking-wider mb-2">
                {getResultLabel()}
              </p>
              <p className="result-highlight">
                {mode === "reverse" ? formatCurrency(result.totalCost) : formatCurrency(result.pricePerSqFt)}
              </p>
              {mode !== "reverse" && (
                <p className="text-gray-600 mt-2">
                  Total: {formatCurrency(result.totalCost)} / {formatNumber(result.squareFeet)} sq ft
                </p>
              )}
              {mode === "reverse" && (
                <p className="text-gray-600 mt-2">
                  {formatCurrency(result.pricePerSqFt)} × {formatNumber(result.squareFeet)} sq ft
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.additionalMetrics.map((metric, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Formula Used:</p>
            {mode === "reverse" ? (
              <code className="bg-amber-100 px-2 py-1 rounded text-amber-900">
                Total Price = Price Per Sq Ft × Square Feet
              </code>
            ) : (
              <code className="bg-amber-100 px-2 py-1 rounded text-amber-900">
                Price Per Sq Ft = Total Price ÷ Square Feet
              </code>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Tool */}
      <div className="calculator-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent-100 rounded-lg">
            <ArrowRightLeft className="w-6 h-6 text-accent-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Property Comparison Tool</h3>
            <p className="text-sm text-gray-500">Compare price per square foot across multiple properties</p>
          </div>
        </div>

        <div className="space-y-4">
          {comparison.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateComparison(idx, "name", e.target.value)}
                  className="input-field py-2"
                  placeholder={`Property ${String.fromCharCode(65 + idx)}`}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price ($)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={item.price}
                  onChange={(e) => updateComparison(idx, "price", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="input-field py-2"
                  placeholder="450000"
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Sq Ft</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={item.sqft}
                  onChange={(e) => updateComparison(idx, "sqft", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="input-field py-2"
                  placeholder="2000"
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                {getComparisonResults()[idx].valid && (
                  <div className="bg-primary-50 rounded-lg p-2 text-center border border-primary-200">
                    <span className="text-xs text-primary-600 font-medium">PSF</span>
                    <p className="text-lg font-bold text-primary-700">
                      {formatCurrency(getComparisonResults()[idx].psf)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {getComparisonResults().filter((r) => r.valid).length > 1 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Comparison Analysis:</p>
            <div className="space-y-2">
              {getComparisonResults()
                .filter((r) => r.valid)
                .sort((a, b) => (a.psf as number) - (b.psf as number))
                .map((item, idx, arr) => {
                  const cheapest = arr[0];
                  const diff = idx === 0 ? 0 : (item.psf as number) - (cheapest.psf as number);
                  const pct = idx === 0 ? 0 : ((diff / (cheapest.psf as number)) * 100).toFixed(1);
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium">
                        {formatCurrency(item.psf as number)}
                        {idx > 0 && (
                          <span className="text-red-600 ml-2">(+{pct}%)</span>
                        )}
                        {idx === 0 && (
                          <span className="text-accent-600 ml-2">(Best Value)</span>
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
