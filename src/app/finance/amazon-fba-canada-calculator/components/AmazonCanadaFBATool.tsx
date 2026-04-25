'use client'

import { useState, useMemo } from 'react'
import { 
  Package, Truck, Warehouse, DollarSign, Copy, Check, ChevronDown,
  TrendingUp, AlertTriangle, Info, Calculator, Ruler, Weight
} from 'lucide-react'

type SizeTier = 'envelope' | 'standard' | 'small_oversize' | 'medium_oversize' | 'large_oversize' | 'special_oversize'

interface Category {
  name: string
  rate: number
  minFee: number
}

const CATEGORIES: Category[] = [
  { name: 'Electronics / Computers', rate: 0.08, minFee: 0.30 },
  { name: 'Home & Kitchen', rate: 0.15, minFee: 0.30 },
  { name: 'Toys & Games', rate: 0.15, minFee: 0.30 },
  { name: 'Sports & Outdoors', rate: 0.15, minFee: 0.30 },
  { name: 'Clothing & Accessories', rate: 0.17, minFee: 0.30 },
  { name: 'Jewelry', rate: 0.20, minFee: 0.30 },
  { name: 'Books', rate: 0.15, minFee: 0.30 },
  { name: 'Beauty & Personal Care', rate: 0.15, minFee: 0.30 },
  { name: 'Health & Household', rate: 0.15, minFee: 0.30 },
  { name: 'Automotive', rate: 0.15, minFee: 0.30 },
  { name: 'Tools & Home Improvement', rate: 0.15, minFee: 0.30 },
  { name: 'Grocery & Gourmet', rate: 0.15, minFee: 0.30 },
  { name: 'Pet Supplies', rate: 0.15, minFee: 0.30 },
  { name: 'Office Products', rate: 0.15, minFee: 0.30 },
  { name: 'Musical Instruments', rate: 0.15, minFee: 0.30 },
]

const GST_RATES: Record<string, number> = {
  'AB': 0.05, 'BC': 0.12, 'MB': 0.12, 'NB': 0.15, 'NL': 0.15,
  'NS': 0.15, 'NT': 0.05, 'NU': 0.05, 'ON': 0.13, 'PE': 0.15,
  'QC': 0.14975, 'SK': 0.11, 'YT': 0.05,
}

function determineSizeTier(length: number, width: number, height: number, weight: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a)
  const longest = dims[0]
  const median = dims[1]
  const shortest = dims[2]

  if (longest <= 33 && median <= 23 && shortest <= 2.5 && weight <= 500) return 'envelope'
  if (longest <= 45 && median <= 35 && shortest <= 20 && weight <= 9000) return 'standard'
  if (longest <= 61 && median <= 46 && shortest <= 46) return 'small_oversize'
  if (longest <= 120 && median <= 60 && shortest <= 60) return 'medium_oversize'
  if (longest <= 150) return 'large_oversize'
  return 'special_oversize'
}

function calculateFulfillmentFee(tier: SizeTier, weight: number): number {
  // weight in grams
  switch (tier) {
    case 'envelope': {
      if (weight <= 100) return 4.73
      if (weight <= 200) return 4.99
      if (weight <= 300) return 5.31
      if (weight <= 400) return 5.60
      if (weight <= 500) return 5.95
      return 5.95
    }
    case 'standard': {
      if (weight <= 100) return 6.28
      if (weight <= 200) return 6.49
      if (weight <= 300) return 6.74
      if (weight <= 400) return 7.13
      if (weight <= 500) return 7.65
      if (weight <= 600) return 7.84
      if (weight <= 700) return 8.17
      if (weight <= 800) return 8.43
      if (weight <= 900) return 8.74
      if (weight <= 1000) return 8.99
      if (weight <= 1100) return 9.10
      if (weight <= 1200) return 9.37
      if (weight <= 1300) return 9.58
      if (weight <= 1400) return 9.85
      if (weight <= 1500) return 10.17
      // 1500+ to 9000g: $11.00 + $0.09 per additional 100g
      const additional100g = Math.ceil((weight - 1500) / 100)
      return 11.00 + (additional100g * 0.09)
    }
    case 'small_oversize': {
      const additional500g = Math.max(0, Math.ceil((weight - 500) / 500))
      return 16.77 + (additional500g * 0.46)
    }
    case 'medium_oversize': {
      const additional500g = Math.max(0, Math.ceil((weight - 500) / 500))
      return 41.64 + (additional500g * 0.52)
    }
    case 'large_oversize': {
      const additional500g = Math.max(0, Math.ceil((weight - 500) / 500))
      return 89.59 + (additional500g * 0.58)
    }
    case 'special_oversize': {
      const additional500g = Math.max(0, Math.ceil((weight - 500) / 500))
      return 166.85 + (additional500g * 0.58)
    }
    default:
      return 0
  }
}

export function AmazonCanadaFBATool() {
  const [length, setLength] = useState(25)
  const [width, setWidth] = useState(15)
  const [height, setHeight] = useState(5)
  const [weight, setWeight] = useState(400)
  const [sellingPrice, setSellingPrice] = useState(35)
  const [productCost, setProductCost] = useState(8)
  const [shippingToAmazon, setShippingToAmazon] = useState(1.50)
  const [categoryIndex, setCategoryIndex] = useState(1)
  const [unitsStored, setUnitsStored] = useState(100)
  const [daysStored, setDaysStored] = useState(90)
  const [province, setProvince] = useState('ON')
  const [includeTax, setIncludeTax] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const category = CATEGORIES[categoryIndex]

  const results = useMemo(() => {
    // Dimensional weight
    const dimWeight = (length * width * height) / 5
    const shippingWeight = Math.max(weight, dimWeight)
    
    // Size tier
    const tier = determineSizeTier(length, width, height, shippingWeight)
    
    // Fulfillment fee
    let fulfillmentFee = calculateFulfillmentFee(tier, shippingWeight)
    
    // GST/HST on fulfillment
    const gstRate = includeTax ? (GST_RATES[province] || 0.13) : 0
    const fulfillmentWithTax = fulfillmentFee * (1 + gstRate)
    
    // Referral fee
    const referralFee = Math.max(sellingPrice * category.rate, category.minFee)
    
    // Storage estimate
    const cubicFt = (length * width * height) / 28316.8 // cm³ to ft³
    const monthlyStoragePerUnit = cubicFt * 0.78 // off-peak estimate
    const totalMonthlyStorage = monthlyStoragePerUnit * unitsStored
    
    // Aged inventory surcharge (simplified)
    let agedSurcharge = 0
    if (daysStored > 365) {
      agedSurcharge = unitsStored * 0.30 // ~CAD $0.30/unit for 12-15 months
    } else if (daysStored > 271) {
      agedSurcharge = unitsStored * 0.15 // estimate for 271-365 days
    }
    
    const totalFees = referralFee + fulfillmentWithTax
    const totalCost = productCost + shippingToAmazon + totalFees + (totalMonthlyStorage / unitsStored)
    const netProfit = sellingPrice - totalCost
    const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0
    
    return {
      dimWeight,
      shippingWeight,
      tier,
      fulfillmentFee,
      fulfillmentWithTax,
      gstRate,
      referralFee,
      cubicFt,
      monthlyStoragePerUnit,
      totalMonthlyStorage,
      agedSurcharge,
      totalFees,
      totalCost,
      netProfit,
      margin
    }
  }, [length, width, height, weight, sellingPrice, productCost, shippingToAmazon, categoryIndex, unitsStored, daysStored, province, includeTax])

  const tierNames: Record<SizeTier, string> = {
    envelope: 'Envelope',
    standard: 'Standard',
    small_oversize: 'Small Oversize',
    medium_oversize: 'Medium Oversize',
    large_oversize: 'Large Oversize',
    special_oversize: 'Special Oversize'
  }

  const handleCopy = async () => {
    const text = `AMAZON.CA FBA FEE CALCULATION
Product: ${length}x${width}x${height} cm, ${weight}g
Size Tier: ${tierNames[results.tier]}
Selling Price: CAD $${sellingPrice.toFixed(2)}
Category: ${category.name}

FEES:
Referral Fee (${(category.rate*100).toFixed(0)}%): CAD $${results.referralFee.toFixed(2)}
FBA Fulfillment: CAD $${results.fulfillmentFee.toFixed(2)}
FBA + GST/HST (${(results.gstRate*100).toFixed(2)}%): CAD $${results.fulfillmentWithTax.toFixed(2)}
Est. Monthly Storage: CAD $${results.totalMonthlyStorage.toFixed(2)}

COSTS:
Product Cost: CAD $${productCost.toFixed(2)}
Shipping to Amazon: CAD $${shippingToAmazon.toFixed(2)}

NET PROFIT: CAD $${results.netProfit.toFixed(2)}
MARGIN: ${results.margin.toFixed(1)}%`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isProfitable = results.netProfit > 0

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Dimensions */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Ruler className="h-4 w-4 text-orange-600" />
              Product Dimensions (cm) & Weight (g)
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Length</label>
                <input
                  type="number"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Width</label>
                <input
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Unit Weight (g)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-8 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Dim. Weight (g)</label>
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {Math.round(results.dimWeight)}g
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${
                results.shippingWeight === results.dimWeight 
                  ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                Shipping Weight: {Math.round(results.shippingWeight)}g
              </span>
              {results.shippingWeight === results.dimWeight && (
                <span className="text-yellow-600 dark:text-yellow-400">Dimensional weight applies</span>
              )}
            </div>
          </div>

          {/* Pricing & Category */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Pricing & Category
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Selling Price (CAD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
                  <select
                    value={categoryIndex}
                    onChange={(e) => setCategoryIndex(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                  >
                    {CATEGORIES.map((c, i) => (
                      <option key={i} value={i}>{c.name} ({(c.rate*100).toFixed(0)}%)</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Product Cost (CAD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productCost}
                      onChange={(e) => setProductCost(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Shipping to FBA (CAD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingToAmazon}
                      onChange={(e) => setShippingToAmazon(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage & Tax */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-orange-600" />
                Storage & Tax
              </h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                {showAdvanced ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Units Stored</label>
                <input
                  type="number"
                  value={unitsStored}
                  onChange={(e) => setUnitsStored(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Days in Storage</label>
                <input
                  type="number"
                  value={daysStored}
                  onChange={(e) => setDaysStored(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {showAdvanced && (
              <div className="mt-3 space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-orange-500 outline-none"
                    >
                      {Object.entries(GST_RATES).map(([code, rate]) => (
                        <option key={code} value={code}>{code} ({(rate*100).toFixed(2)}%)</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={(e) => setIncludeTax(e.target.checked)}
                        className="rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">Include GST/HST on fees</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Net Profit */}
          <div className={`rounded-2xl border p-6 text-center ${isProfitable ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'}`}>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Net Profit Per Unit</p>
            <p className={`text-4xl font-bold ${isProfitable ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              CAD ${results.netProfit.toFixed(2)}
            </p>
            <p className={`text-sm font-medium mt-1 ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
              {results.margin.toFixed(1)}% margin
            </p>
          </div>

          {/* Size Tier */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-neutral-500">Detected Size Tier</span>
            </div>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{tierNames[results.tier]}</p>
            <p className="text-xs text-neutral-400">Shipping weight: {Math.round(results.shippingWeight)}g</p>
          </div>

          {/* Fee Breakdown */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Fee Breakdown (CAD)</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Selling Price</span>
                <span className="text-neutral-900 dark:text-white font-medium">${sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Referral Fee ({(category.rate*100).toFixed(0)}%)</span>
                <span>-${results.referralFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>FBA Fulfillment</span>
                <span>-${results.fulfillmentFee.toFixed(2)}</span>
              </div>
              {includeTax && (
                <div className="flex justify-between text-sm text-red-400">
                  <span>GST/HST on FBA ({(results.gstRate*100).toFixed(2)}%)</span>
                  <span>-${(results.fulfillmentFee * results.gstRate).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-red-600">
                <span>Product Cost</span>
                <span>-${productCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Shipping to FBA</span>
                <span>-${shippingToAmazon.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Est. Storage/Unit</span>
                <span>-${(results.totalMonthlyStorage / unitsStored).toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Net Profit</span>
                <span className={isProfitable ? 'text-emerald-600' : 'text-red-600'}>${results.netProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Storage Warning */}
          {daysStored > 271 && (
            <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                Inventory over 271 days may incur aged inventory surcharges (~CAD $0.15–$0.35/unit/month) .
              </p>
            </div>
          )}

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Breakdown'}
          </button>
        </div>
      </div>
    </div>
  )
}
