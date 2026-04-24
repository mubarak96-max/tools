'use client'

import { useState, useMemo } from 'react'
import { 
  DollarSign, ShoppingCart, Truck, Receipt, TrendingUp, Target,
  Percent, AlertCircle, CheckCircle2, XCircle, Copy, Check, RefreshCcw,
  ChevronDown, ChevronUp, Info, BarChart3
} from 'lucide-react'

interface CalculationResult {
  profitPerUnit: number
  contributionMargin: number
  contributionMarginRatio: number
  breakEvenUnits: number
  breakEvenRevenue: number
  breakEvenROAS: number
  breakEvenCPA: number
  expectedSales: number
  expectedRevenue: number
  expectedProfit: number
  actualROAS: number
  actualCPA: number
  requiredConversionRate: number
  isProfitable: boolean
  profitMargin: number
}

export function BreakEvenTool() {
  // Product economics
  const [sellingPrice, setSellingPrice] = useState(30)
  const [productCost, setProductCost] = useState(15)
  const [shippingCost, setShippingCost] = useState(5)
  const [paymentFeePercent, setPaymentFeePercent] = useState(2.9)
  const [otherPerUnitCost, setOtherPerUnitCost] = useState(0.90)
  
  // Fixed costs
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(300)
  
  // Ad & traffic
  const [monthlyAdSpend, setMonthlyAdSpend] = useState(500)
  const [conversionRate, setConversionRate] = useState(2.5)
  const [cpc, setCpc] = useState(1.16)
  
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const results: CalculationResult = useMemo(() => {
    const paymentFee = sellingPrice * (paymentFeePercent / 100)
    const variableCost = productCost + shippingCost + paymentFee + otherPerUnitCost
    const profitPerUnit = sellingPrice - variableCost
    const contributionMargin = profitPerUnit
    const contributionMarginRatio = sellingPrice > 0 ? contributionMargin / sellingPrice : 0
    
    // Break-even without ads (product-only)
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(monthlyFixedCosts / contributionMargin) : 0
    const breakEvenRevenue = contributionMarginRatio > 0 ? monthlyFixedCosts / contributionMarginRatio : 0
    
    // Break-even ROAS (ads only, ignoring fixed costs for quick campaign check)
    const variableCostExclAds = productCost + shippingCost + paymentFee + otherPerUnitCost
    const breakEvenROAS = variableCostExclAds > 0 && sellingPrice > variableCostExclAds 
      ? sellingPrice / (sellingPrice - variableCostExclAds) 
      : 0
    
    // Traffic & sales projections
    const monthlyVisitors = cpc > 0 ? Math.floor(monthlyAdSpend / cpc) : 0
    const expectedSales = Math.floor(monthlyVisitors * (conversionRate / 100))
    const expectedRevenue = expectedSales * sellingPrice
    
    // Total costs
    const totalVariableCosts = expectedSales * variableCost
    const totalCosts = totalVariableCosts + monthlyFixedCosts + monthlyAdSpend
    const expectedProfit = expectedRevenue - totalCosts
    
    // Actual metrics
    const actualROAS = monthlyAdSpend > 0 ? expectedRevenue / monthlyAdSpend : 0
    const actualCPA = expectedSales > 0 ? monthlyAdSpend / expectedSales : 0
    
    // Break-even CPA (max you can pay per acquisition while covering all costs)
    const breakEvenCPA = expectedSales > 0 
      ? sellingPrice - variableCost - (monthlyFixedCosts / expectedSales)
      : sellingPrice - variableCost
    
    // Required conversion rate to hit break-even with current ad spend
    const requiredSales = contributionMargin > 0 ? (monthlyFixedCosts + monthlyAdSpend) / contributionMargin : 0
    const requiredVisitors = cpc > 0 ? monthlyAdSpend / cpc : 0
    const requiredConversionRate = requiredVisitors > 0 ? (requiredSales / requiredVisitors) * 100 : 0
    
    const profitMargin = expectedRevenue > 0 ? (expectedProfit / expectedRevenue) * 100 : 0
    const isProfitable = expectedProfit > 0 && actualROAS >= breakEvenROAS
    
    return {
      profitPerUnit,
      contributionMargin,
      contributionMarginRatio,
      breakEvenUnits,
      breakEvenRevenue,
      breakEvenROAS,
      breakEvenCPA,
      expectedSales,
      expectedRevenue,
      expectedProfit,
      actualROAS,
      actualCPA,
      requiredConversionRate,
      isProfitable,
      profitMargin
    }
  }, [sellingPrice, productCost, shippingCost, paymentFeePercent, otherPerUnitCost, monthlyFixedCosts, monthlyAdSpend, conversionRate, cpc])

  const handleCopy = async () => {
    const report = `DROPSHIPPING BREAK-EVEN REPORT
Selling Price: $${sellingPrice}
Product Cost: $${productCost}
Shipping: $${shippingCost}
Payment Fee: ${paymentFeePercent}%
Other/Unit: $${otherPerUnitCost}

Fixed Costs/Month: $${monthlyFixedCosts}
Ad Spend/Month: $${monthlyAdSpend}
Conversion Rate: ${conversionRate}%
CPC: $${cpc}

RESULTS:
Profit/Unit: $${results.profitPerUnit.toFixed(2)}
Contribution Margin: ${(results.contributionMarginRatio * 100).toFixed(1)}%
Break-Even Units: ${results.breakEvenUnits}
Break-Even Revenue: $${results.breakEvenRevenue.toFixed(2)}
Break-Even ROAS: ${results.breakEvenROAS.toFixed(2)}x
Break-Even CPA: $${results.breakEvenCPA.toFixed(2)}

PROJECTED:
Expected Sales: ${results.expectedSales}
Expected Revenue: $${results.expectedRevenue.toFixed(2)}
Expected Profit: $${results.expectedProfit.toFixed(2)}
Actual ROAS: ${results.actualROAS.toFixed(2)}x
Actual CPA: $${results.actualCPA.toFixed(2)}
Required CVR: ${results.requiredConversionRate.toFixed(2)}%
Profit Margin: ${results.profitMargin.toFixed(1)}%`

    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (n: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const getStatusColor = (isGood: boolean) => isGood ? 'text-green-600' : 'text-red-600'
  const getStatusBg = (isGood: boolean) => isGood ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Inputs */}
        <div className="space-y-6">
          
          {/* Product Economics */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-amber-600" />
              Product Economics (Per Unit)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Product Cost ($)</label>
                  <input
                    type="number"
                    value={productCost}
                    onChange={(e) => setProductCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Shipping ($)</label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Payment Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={paymentFeePercent}
                    onChange={(e) => setPaymentFeePercent(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Other/Unit ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={otherPerUnitCost}
                    onChange={(e) => setOtherPerUnitCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Costs */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-amber-600" />
              Fixed Costs (Monthly)
            </h3>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Total Fixed Costs ($)</label>
              <input
                type="number"
                value={monthlyFixedCosts}
                onChange={(e) => setMonthlyFixedCosts(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
              <p className="mt-1 text-xs text-neutral-500">Shopify, apps, domain, tools, VA, etc.</p>
            </div>
          </div>

          {/* Ad & Traffic */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              Ad Spend & Traffic
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Monthly Ad Spend ($)</label>
                  <input
                    type="number"
                    value={monthlyAdSpend}
                    onChange={(e) => setMonthlyAdSpend(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Conversion Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>
              </div>
              
              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced (CPC, Fees)'}
              </button>
              
              {showAdvanced && (
                <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Average CPC ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cpc}
                      onChange={(e) => setCpc(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-neutral-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                    <p className="mt-1 text-xs text-neutral-500">Ecommerce avg: $1.16 </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Results Dashboard */}
        <div className="space-y-6">
          
          {/* Profit Per Unit Card */}
          <div className={`rounded-2xl border p-6 shadow-sm ${getStatusBg(results.profitPerUnit > 0)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Profit Per Unit</span>
              {results.profitPerUnit > 0 ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
            </div>
            <div className={`text-3xl font-bold ${getStatusColor(results.profitPerUnit > 0)}`}>
              {formatCurrency(results.profitPerUnit)}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Contribution margin: {(results.contributionMarginRatio * 100).toFixed(1)}%
            </p>
          </div>

          {/* Break-Even Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-neutral-500">Break-Even Units</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{results.breakEvenUnits}</div>
              <p className="text-[10px] text-neutral-400">per month</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-neutral-500">Break-Even Revenue</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{formatCurrency(results.breakEvenRevenue)}</div>
              <p className="text-[10px] text-neutral-400">per month</p>
            </div>
            <div className={`rounded-xl border p-4 ${results.actualROAS >= results.breakEvenROAS && results.breakEvenROAS > 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-neutral-500">Break-Even ROAS</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{results.breakEvenROAS.toFixed(2)}x</div>
              <p className="text-[10px] text-neutral-400">minimum to profit</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Percent className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-neutral-500">Break-Even CPA</span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{formatCurrency(results.breakEvenCPA)}</div>
              <p className="text-[10px] text-neutral-400">max per acquisition</p>
            </div>
          </div>

          {/* Projected Performance */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-600" />
                Projected Performance
              </h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                results.isProfitable 
                  ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
              }`}>
                {results.isProfitable ? 'PROFITABLE' : 'LOSING MONEY'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Expected Sales</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{results.expectedSales} units</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Expected Revenue</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{formatCurrency(results.expectedRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Actual ROAS</span>
                <span className={`text-sm font-semibold ${results.actualROAS >= results.breakEvenROAS ? 'text-green-600' : 'text-red-600'}`}>
                  {results.actualROAS.toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Actual CPA</span>
                <span className={`text-sm font-semibold ${results.actualCPA <= results.breakEvenCPA ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.actualCPA)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Required CVR</span>
                <span className={`text-sm font-semibold ${results.requiredConversionRate <= conversionRate ? 'text-green-600' : 'text-red-600'}`}>
                  {results.requiredConversionRate.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Net Profit Margin</span>
                <span className={`text-sm font-semibold ${results.profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Net Profit Big Number */}
            <div className={`mt-4 rounded-xl p-4 text-center ${getStatusBg(results.expectedProfit > 0)}`}>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Expected Monthly Profit</p>
              <p className={`text-4xl font-bold ${getStatusColor(results.expectedProfit > 0)}`}>
                {formatCurrency(results.expectedProfit)}
              </p>
            </div>
          </div>

          {/* ROAS Comparison Bar */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">ROAS vs. Break-Even</h3>
            <div className="relative h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              {/* Break-even marker */}
              <div 
                className="absolute top-0 h-full border-r-2 border-dashed border-red-500"
                style={{ left: `${Math.min((results.breakEvenROAS / 6) * 100, 95)}%` }}
              />
              {/* Actual ROAS bar */}
              <div 
                className={`absolute top-0 h-full rounded-full transition-all duration-500 ${
                  results.actualROAS >= results.breakEvenROAS ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((results.actualROAS / 6) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0x</span>
              <span className="text-red-500 font-medium">Break-Even: {results.breakEvenROAS.toFixed(2)}x</span>
              <span>6x</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              {results.actualROAS >= results.breakEvenROAS 
                ? `✅ Your ROAS (${results.actualROAS.toFixed(2)}x) exceeds break-even. Safe to scale.` 
                : `⚠️ Your ROAS (${results.actualROAS.toFixed(2)}x) is below break-even (${results.breakEvenROAS.toFixed(2)}x). Cut or optimize.`}
            </p>
          </div>

          {/* Copy Report */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Report Copied!' : 'Copy Full Report'}
          </button>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          Quick Sensitivity: What If Scenarios
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Price +10%', priceMod: 1.1, cvrMod: 1 },
            { label: 'Price -10%', priceMod: 0.9, cvrMod: 1 },
            { label: 'CVR +50%', priceMod: 1, cvrMod: 1.5 },
          ].map((scenario, i) => {
            const adjPrice = sellingPrice * scenario.priceMod
            const adjCvr = conversionRate * scenario.cvrMod
            const adjVisitors = cpc > 0 ? monthlyAdSpend / cpc : 0
            const adjSales = Math.floor(adjVisitors * (adjCvr / 100))
            const adjRevenue = adjSales * adjPrice
            const adjVarCost = (productCost + shippingCost + (adjPrice * paymentFeePercent / 100) + otherPerUnitCost) * adjSales
            const adjProfit = adjRevenue - adjVarCost - monthlyFixedCosts - monthlyAdSpend
            const adjROAS = monthlyAdSpend > 0 ? adjRevenue / monthlyAdSpend : 0
            
            return (
              <div key={i} className="rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4">
                <p className="text-xs font-medium text-neutral-500 mb-2">{scenario.label}</p>
                <p className={`text-lg font-bold ${adjProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(adjProfit)}
                </p>
                <p className="text-[10px] text-neutral-400">ROAS: {adjROAS.toFixed(2)}x</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
