"use client";

import { useState, useCallback, useMemo } from "react";
import { ProfitChart } from "./ProfitChart";
import { ROITimeline } from "./ROITimeline";
import { ResultsPanel } from "./ResultsPanel";

interface MiningConfig {
  coin: string;
  hashRate: number;
  hashUnit: string;
  power: number;
  powerCost: number;
  poolFee: number;
  hardwareCost: number;
  coinPrice: number;
  blockReward: number;
  networkDifficulty: number;
}

interface DailyResult {
  day: number;
  revenue: number;
  electricityCost: number;
  poolFeeCost: number;
  netProfit: number;
  cumulativeProfit: number;
  btcMined: number;
}

const COIN_DATA: Record<string, { price: number; blockReward: number; difficulty: number; blockTime: number }> = {
  BTC: { price: 87500, blockReward: 3.125, difficulty: 72000000000000000, blockTime: 600 },
  ETH: { price: 3850, blockReward: 2.0, difficulty: 58000000000000000, blockTime: 12 },
  LTC: { price: 92, blockReward: 6.25, difficulty: 9200000000, blockTime: 150 },
  DOGE: { price: 0.18, blockReward: 10000, difficulty: 8500000, blockTime: 60 },
  XMR: { price: 168, blockReward: 0.6, difficulty: 380000000000, blockTime: 120 },
  KAS: { price: 0.12, blockReward: 207.65, difficulty: 85000000000000, blockTime: 1 },
};

const HARDWARE_PRESETS = {
  asic: [
    { name: "Bitmain Antminer S21", hashRate: 234, hashUnit: "TH/s", power: 3510, cost: 4500 },
    { name: "Bitmain Antminer T21", hashRate: 190, hashUnit: "TH/s", power: 3610, cost: 3200 },
    { name: "MicroBT Whatsminer M60S", hashRate: 186, hashUnit: "TH/s", power: 3340, cost: 3800 },
    { name: "Bitmain Antminer S19k Pro", hashRate: 120, hashUnit: "TH/s", power: 2760, cost: 2100 },
    { name: "Custom ASIC", hashRate: 100, hashUnit: "TH/s", power: 3000, cost: 2500 },
  ],
  gpu: [
    { name: "NVIDIA RTX 4090", hashRate: 125, hashUnit: "MH/s", power: 450, cost: 1600 },
    { name: "NVIDIA RTX 4080", hashRate: 92, hashUnit: "MH/s", power: 320, cost: 1200 },
    { name: "AMD RX 7900 XTX", hashRate: 105, hashUnit: "MH/s", power: 355, cost: 1000 },
    { name: "NVIDIA RTX 3090 Ti", hashRate: 115, hashUnit: "MH/s", power: 480, cost: 1100 },
    { name: "6x GPU Mining Rig", hashRate: 600, hashUnit: "MH/s", power: 2400, cost: 7000 },
    { name: "Custom GPU Setup", hashRate: 300, hashUnit: "MH/s", power: 1200, cost: 3500 },
  ],
};

const ELECTRICITY_PRESETS = [
  { region: "USA Average", rate: 0.16 },
  { region: "USA - Texas", rate: 0.12 },
  { region: "USA - Washington", rate: 0.10 },
  { region: "Canada", rate: 0.13 },
  { region: "Germany", rate: 0.40 },
  { region: "China", rate: 0.08 },
  { region: "Russia", rate: 0.06 },
  { region: "Kazakhstan", rate: 0.04 },
  { region: "Iceland", rate: 0.05 },
  { region: "Custom", rate: 0.12 },
];

export function Calculator() {
  const [config, setConfig] = useState<MiningConfig>({
    coin: "BTC",
    hashRate: 234,
    hashUnit: "TH/s",
    power: 3510,
    powerCost: 0.12,
    poolFee: 2.5,
    hardwareCost: 4500,
    coinPrice: COIN_DATA.BTC.price,
    blockReward: COIN_DATA.BTC.blockReward,
    networkDifficulty: COIN_DATA.BTC.difficulty,
  });

  const [activeTab, setActiveTab] = useState<"asic" | "gpu" | "custom">("asic");
  const [showResults, setShowResults] = useState(false);

  const handleCoinChange = (coin: string) => {
    const data = COIN_DATA[coin];
    setConfig((prev) => ({
      ...prev,
      coin,
      coinPrice: data.price,
      blockReward: data.blockReward,
      networkDifficulty: data.difficulty,
    }));
  };

  const handlePresetSelect = (preset: (typeof HARDWARE_PRESETS.asic)[0]) => {
    setConfig((prev) => ({
      ...prev,
      hashRate: preset.hashRate,
      hashUnit: preset.hashUnit,
      power: preset.power,
      hardwareCost: preset.cost,
    }));
  };

  const handleElectricityPreset = (rate: number) => {
    setConfig((prev) => ({ ...prev, powerCost: rate }));
  };

  const calculateMining = useCallback((): DailyResult[] => {
    const results: DailyResult[] = [];
    let cumulativeProfit = -config.hardwareCost;
    const days = 365;

    // Hash rate in H/s
    let hashRateHs = config.hashRate;
    if (config.hashUnit === "TH/s") hashRateHs *= 1e12;
    else if (config.hashUnit === "GH/s") hashRateHs *= 1e9;
    else if (config.hashUnit === "MH/s") hashRateHs *= 1e6;
    else if (config.hashUnit === "KH/s") hashRateHs *= 1e3;

    const dailyPowerKwh = (config.power * 24) / 1000;
    const dailyElectricityCost = dailyPowerKwh * config.powerCost;

    for (let day = 1; day <= days; day++) {
      // Simplified block finding probability
      const networkHash = config.networkDifficulty * Math.pow(2, 32);
      const blocksPerDay = (hashRateHs * 86400) / networkHash;
      const coinsPerDay = blocksPerDay * config.blockReward;
      
      // Apply pool fee
      const grossRevenue = coinsPerDay * config.coinPrice;
      const poolFeeCost = grossRevenue * (config.poolFee / 100);
      const netRevenue = grossRevenue - poolFeeCost;
      const netProfit = netRevenue - dailyElectricityCost;
      
      cumulativeProfit += netProfit;

      results.push({
        day,
        revenue: netRevenue,
        electricityCost: dailyElectricityCost,
        poolFeeCost,
        netProfit,
        cumulativeProfit,
        btcMined: coinsPerDay,
      });
    }

    return results;
  }, [config]);

  const results = useMemo(() => calculateMining(), [calculateMining]);

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    
    const daily = results[0];
    const monthly = {
      revenue: daily.revenue * 30,
      electricity: daily.electricityCost * 30,
      poolFees: daily.poolFeeCost * 30,
      profit: daily.netProfit * 30,
      coins: daily.btcMined * 30,
    };
    const yearly = {
      revenue: daily.revenue * 365,
      electricity: daily.electricityCost * 365,
      poolFees: daily.poolFeeCost * 365,
      profit: daily.netProfit * 365,
      coins: daily.btcMined * 365,
    };

    // Break-even day
    const breakEvenDay = results.find((r) => r.cumulativeProfit >= 0)?.day || null;
    
    // ROI percentage after 1 year
    const roi = ((results[364].cumulativeProfit + config.hardwareCost) / config.hardwareCost) * 100;

    return { daily, monthly, yearly, breakEvenDay, roi, powerCostMonthly: daily.electricityCost * 30 };
  }, [results, config.hardwareCost]);

  const downloadCSV = () => {
    const headers = ["Day", "Revenue ($)", "Electricity ($)", "Pool Fee ($)", "Net Profit ($)", "Cumulative Profit ($)", "Coins Mined"];
    const rows = results.map((r) => [
      r.day,
      r.revenue.toFixed(2),
      r.electricityCost.toFixed(2),
      r.poolFeeCost.toFixed(2),
      r.netProfit.toFixed(2),
      r.cumulativeProfit.toFixed(2),
      r.btcMined.toFixed(8),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mining-projection-${config.coin}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700 shadow-2xl backdrop-blur-sm">
        <div className="border-b border-slate-700 bg-slate-800/80 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Mining Configuration</h2>
          <p className="text-sm text-slate-400">
            Configure your hardware, electricity costs, and pool settings
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Coin Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Cryptocurrency</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(COIN_DATA).map((coin) => (
                <button
                  key={coin}
                  onClick={() => handleCoinChange(coin)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    config.coin === coin
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Presets */}
          <div>
            <div className="flex gap-2 mb-3">
              {(["asic", "gpu", "custom"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab !== "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {HARDWARE_PRESETS[activeTab].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-left transition-all hover:border-emerald-500/50 hover:bg-slate-750"
                  >
                    <div className="font-medium text-sm text-slate-200">{preset.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {preset.hashRate} {preset.hashUnit} • {preset.power}W • ${preset.cost}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Hash Rate</label>
              <div className="flex">
                <input
                  type="number"
                  value={config.hashRate}
                  onChange={(e) => setConfig((p) => ({ ...p, hashRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full rounded-l-lg border-y border-l border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
                <select
                  value={config.hashUnit}
                  onChange={(e) => setConfig((p) => ({ ...p, hashUnit: e.target.value }))}
                  className="rounded-r-lg border border-slate-600 bg-slate-800 px-2 text-sm text-slate-300 focus:border-emerald-500 focus:outline-none"
                >
                  <option>H/s</option>
                  <option>KH/s</option>
                  <option>MH/s</option>
                  <option>GH/s</option>
                  <option>TH/s</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Power Consumption (W)</label>
              <input
                type="number"
                value={config.power}
                onChange={(e) => setConfig((p) => ({ ...p, power: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Hardware Cost ($)</label>
              <input
                type="number"
                value={config.hardwareCost}
                onChange={(e) => setConfig((p) => ({ ...p, hardwareCost: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Pool Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.poolFee}
                onChange={(e) => setConfig((p) => ({ ...p, poolFee: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          {/* Electricity & Market */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Electricity ($/kWh)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={config.powerCost}
                  onChange={(e) => setConfig((p) => ({ ...p, powerCost: parseFloat(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {ELECTRICITY_PRESETS.slice(0, 5).map((ep) => (
                  <button
                    key={ep.region}
                    onClick={() => handleElectricityPreset(ep.rate)}
                    className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200 transition-colors"
                  >
                    {ep.region.split(" - ")[1] || ep.region}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Coin Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={config.coinPrice}
                onChange={(e) => setConfig((p) => ({ ...p, coinPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Block Reward</label>
              <input
                type="number"
                step="0.001"
                value={config.blockReward}
                onChange={(e) => setConfig((p) => ({ ...p, blockReward: parseFloat(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 px-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowResults(true)}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 active:scale-[0.98]"
              >
                Calculate Mining Profitability
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && stats && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ResultsPanel stats={stats} config={config} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <ProfitChart results={results} />
            <ROITimeline results={results} hardwareCost={config.hardwareCost} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-medium text-white border border-slate-600 transition-all hover:bg-slate-600 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Projections (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
