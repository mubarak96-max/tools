'use client'

import { useState, useMemo } from 'react'
import { 
  Store, ShoppingBag, Truck, DollarSign, Percent, ArrowRightLeft,
  Copy, Check, RefreshCcw, ChevronDown, TrendingUp, AlertCircle,
  CheckCircle2, Globe, Calculator
} from 'lucide-react'

type Platform = 'shopify' | 'etsy' | 'amazon'
type Mode = 'forward' | 'reverse'
type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY'

interface FeeBreakdown {
  platformFee: number
  paymentProcessing: number
  listingFee: number
  fulfillmentFee: number
  storageFee: number
  otherFees: number
  totalFees: number
  netProfit: number
  netMargin: number
  breakEvenPrice: number
}

const CURRENCIES: { code: Currency; symbol: string; rate: number }[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CAD', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 },
  { code: 'JPY', symbol: '¥', rate: 151 },
]

const SHOPIFY_PLANS = [
  { name: 'Basic', monthly: 39, ccRate: 2.9, ccFixed: 0.30, thirdPartyFee: 2.0 },
  { name: 'Shopify', monthly: 105, ccRate: 2.7, ccFixed: 0.30, thirdPartyFee: 1.0 },
  { name: 'Advanced', monthly: 399, ccRate: 2.5, ccFixed: 0.30, thirdPartyFee: 0.6 },
]

const ETSY_REGIONS = [
  { name: 'United States', paymentRate: 3.0, paymentFixed: 0.25, regulatoryRate: 0 },
  { name: 'United Kingdom', paymentRate: 4.0, paymentFixed: 0.20, regulatoryRate: 0.32 },
  { name: 'Eurozone', paymentRate: 4.0, paymentFixed: 0.30, regulatoryRate: 0 },
  { name: 'Canada', paymentRate: 3.0, paymentFixed: 0.25, regulatoryRate: 1.15 },
  { name: 'Australia', paymentRate: 3.0, paymentFixed: 0.25, regulatoryRate: 0 },
  { name: 'Turkey', paymentRate: 6.5, paymentFixed: 3.0, regulatoryRate: 2.24 },
]

const AMAZON_CATEGORIES = [
  { name: 'Home & Kitchen', referralRate: 15 },
  { name: 'Electronics', referralRate: 8 },
  { name: 'Clothing', referralRate: 17 },
  { name: 'Jewelry', referralRate: 20 },
  { name: 'Books', referralRate: 15 },
  { name: 'Toys', referralRate: 15 },
  { name: 'Beauty', referralRate: 15 },
  { name: 'Health & Personal Care', referralRate: 15 },
]

function formatMoney(amount: number, symbol: string, currency: Currency) {
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`
  }
  return `${symbol}${amount.toFixed(2)}`
}

export function PricingTool() {
  const [platform, setPlatform] = useState<Platform>('shopify')
  const [mode, setMode] = useState<Mode>('reverse')
  const [currency, setCurrency] = useState<Currency>('USD')
  
  // Costs
  const [productCost, setProductCost] = useState(6)
  const [shippingCost, setShippingCost] = useState(4)
  const [packagingCost, setPackagingCost] = useState(0.50)
  const [otherCost, setOtherCost] = useState(0)
  
  // Pricing
  const [sellingPrice, setSellingPrice] = useState(24.99)
  const [targetMargin, setTargetMargin] = useState(30)
  
  // Platform-specific
  const [shopifyPlan, setShopifyPlan] = useState(0)
  const [usesShopifyPayments, setUsesShopifyPayments] = useState(true)
  const [etsyRegion, setEtsyRegion] = useState(0)
  const [etsyOffsiteAds, setEtsyOffsiteAds] = useState(false)
  const [amazonCategory, setAmazonCategory] = useState(0)
  const [amazonWeightOz, setAmazonWeightOz] = useState(12)
  const [amazonStorageMonths, setAmazonStorageMonths] = useState(1)
  const [amazonIsQ4, setAmazonIsQ4] = useState(false)
  
  const [copied, setCopied] = useState(false)

  const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  
  // Convert USD base to selected currency
  const toCur = (usd: number) => usd * cur.rate
  // const fromCur = (val: number) => val / cur.rate

  // Fee calculation
  const breakdown: FeeBreakdown = useMemo(() => {
    const price = sellingPrice
    const totalProductCost = productCost + shippingCost + packagingCost + otherCost
    
    let platformFee = 0
    let paymentProcessing = 0
    let listingFee = 0
    let fulfillmentFee = 0
    let storageFee = 0
    let otherFees = 0

    if (platform === 'shopify') {
      const plan = SHOPIFY_PLANS[shopifyPlan]
      if (usesShopifyPayments) {
        paymentProcessing = (price * (plan.ccRate / 100)) + plan.ccFixed
      } else {
        platformFee = price * (plan.thirdPartyFee / 100)
        paymentProcessing = (price * 2.9 / 100) + 0.30 // Assume PayPal/Stripe
      }
    } else if (platform === 'etsy') {
      const region = ETSY_REGIONS[etsyRegion]
      listingFee = 0.20
      platformFee = price * 0.065 // 6.5% transaction fee
      paymentProcessing = (price * (region.paymentRate / 100)) + region.paymentFixed
      otherFees = price * (region.regulatoryRate / 100)
      if (etsyOffsiteAds) {
        otherFees += price * 0.15 // 15% offsite ads
      }
    } else if (platform === 'amazon') {
      const cat = AMAZON_CATEGORIES[amazonCategory]
      platformFee = price * (cat.referralRate / 100)
      
      // Simplified FBA fulfillment estimate based on weight
      const weight = amazonWeightOz
      if (weight <= 4) fulfillmentFee = 3.22
      else if (weight <= 8) fulfillmentFee = 3.86
      else if (weight <= 12) fulfillmentFee = 4.75
      else if (weight <= 16) fulfillmentFee = 5.45
      else fulfillmentFee = 6.50 + (weight - 16) * 0.20
      
      // Storage estimate (simplified)
      const cubicFt = 0.18 // Assume standard small item
      const rate = amazonIsQ4 ? 2.40 : 0.78
      storageFee = cubicFt * rate * amazonStorageMonths
      
      // Inbound placement
      otherFees = 0.30
      
      // Returns amortized (~5% return rate)
      otherFees += fulfillmentFee * 0.05
    }

    const totalFees = platformFee + paymentProcessing + listingFee + fulfillmentFee + storageFee + otherFees
    const netProfit = price - totalProductCost - totalFees
    const netMargin = price > 0 ? (netProfit / price) * 100 : 0
    
    // Break-even price calculation
    const feePercent = price > 0 ? totalFees / price : 0
    const breakEvenPrice = (1 - feePercent) > 0 ? totalProductCost / (1 - feePercent) : 0

    return {
      platformFee,
      paymentProcessing,
      listingFee,
      fulfillmentFee,
      storageFee,
      otherFees,
      totalFees,
      netProfit,
      netMargin,
      breakEvenPrice
    }
  }, [platform, sellingPrice, productCost, shippingCost, packagingCost, otherCost, shopifyPlan, usesShopifyPayments, etsyRegion, etsyOffsiteAds, amazonCategory, amazonWeightOz, amazonStorageMonths, amazonIsQ4])

  // Forward mode: calculate required price for target margin
  const requiredPrice = useMemo(() => {
    if (mode !== 'forward') return 0
    const totalCost = productCost + shippingCost + packagingCost + otherCost
    
    // Iterative solve for price where (price - fees - cost) / price = targetMargin
    let price = totalCost * 1.5
    for (let i = 0; i < 50; i++) {
      // Estimate fees at this price (simplified)
      let fees = 0
      if (platform === 'shopify') {
        const plan = SHOPIFY_PLANS[shopifyPlan]
        if (usesShopifyPayments) {
          fees = (price * plan.ccRate / 100) + plan.ccFixed
        } else {
          fees = price * plan.thirdPartyFee / 100 + (price * 2.9 / 100) + 0.30
        }
      } else if (platform === 'etsy') {
        const region = ETSY_REGIONS[etsyRegion]
        fees = 0.20 + price * 0.065 + (price * region.paymentRate / 100) + region.paymentFixed + price * (region.regulatoryRate / 100)
        if (etsyOffsiteAds) fees += price * 0.15
      } else if (platform === 'amazon') {
        const cat = AMAZON_CATEGORIES[amazonCategory]
        let fba = 0
        const w = amazonWeightOz
        if (w <= 4) fba = 3.22
        else if (w <= 8) fba = 3.86
        else if (w <= 12) fba = 4.75
        else if (w <= 16) fba = 5.45
        else fba = 6.50 + (w - 16) * 0.20
        
        const cubicFt = 0.18
        const storage = cubicFt * (amazonIsQ4 ? 2.40 : 0.78) * amazonStorageMonths
        fees = price * (cat.referralRate / 100) + fba + storage + 0.30 + fba * 0.05
      }
      
      const profit = price - totalCost - fees
      const margin = price > 0 ? profit / price : 0
      const diff = margin - (targetMargin / 100)
      
      if (Math.abs(diff) < 0.001) break
      price = price + (diff * price * 0.5)
    }
    return price
  }, [mode, targetMargin, platform, productCost, shippingCost, packagingCost, otherCost, shopifyPlan, usesShopifyPayments, etsyRegion, etsyOffsiteAds, amazonCategory, amazonWeightOz, amazonStorageMonths, amazonIsQ4])

  const handleCopy = async () => {
    const text = `PRICING REPORT - ${platform.toUpperCase()}
Currency: ${currency}
Selling Price: ${formatMoney(sellingPrice, cur.symbol, currency)}
Product Cost: ${formatMoney(productCost, cur.symbol, currency)}
Shipping: ${formatMoney(shippingCost, cur.symbol, currency)}

FEES:
Platform Fee: ${formatMoney(breakdown.platformFee, cur.symbol, currency)}
Payment Processing: ${formatMoney(breakdown.paymentProcessing, cur.symbol, currency)}
Listing/Fulfillment: ${formatMoney(breakdown.listingFee + breakdown.fulfillmentFee, cur.symbol, currency)}
Storage/Other: ${formatMoney(breakdown.storageFee + breakdown.otherFees, cur.symbol, currency)}
Total Fees: ${formatMoney(breakdown.totalFees, cur.symbol, currency)}

NET PROFIT: ${formatMoney(breakdown.netProfit, cur.symbol, currency)}
NET MARGIN: ${breakdown.netMargin.toFixed(1)}%
BREAK-EVEN: ${formatMoney(breakdown.breakEvenPrice, cur.symbol, currency)}`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isProfitable = breakdown.netProfit > 0
  const marginColor = breakdown.netMargin >= 20 ? 'text-green-600' : breakdown.netMargin >= 10 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="mx-auto max-w-5xl">
      {/* Platform Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-1">
          {([
            { id: 'shopify' as Platform, label: 'Shopify', icon: Store },
            { id: 'etsy' as Platform, label: 'Etsy', icon: ShoppingBag },
            { id: 'amazon' as Platform, label: 'Amazon FBA', icon: Truck },
          ]).map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                platform === p.id 
                  ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <p.icon className="h-4 w-4" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => setMode('reverse')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === 'reverse' 
                ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Reverse: Price → Margin
          </button>
          <button
            onClick={() => setMode('forward')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === 'forward' 
                ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Forward: Margin → Price
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Currency & Basic Costs */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-violet-600" />
                Currency & Costs
              </h3>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Product Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">{cur.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={productCost}
                    onChange={(e) => setProductCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Shipping to Customer</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">{cur.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Packaging</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">{cur.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Other/Unit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">{cur.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={otherCost}
                    onChange={(e) => setOtherCost(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Input */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-violet-600" />
              {mode === 'reverse' ? 'Selling Price' : 'Target Margin'}
            </h3>
            
            {mode === 'reverse' ? (
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Your Selling Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">{cur.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-3 text-lg font-semibold text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Target Net Margin (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-3 text-lg font-semibold text-neutral-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
                </div>
                <div className="mt-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30">
                  <p className="text-sm text-violet-800 dark:text-violet-300">
                    Required Price: <span className="font-bold text-lg">{formatMoney(requiredPrice, cur.symbol, currency)}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Platform-Specific Settings */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              {platform === 'shopify' && <Store className="h-4 w-4 text-violet-600" />}
              {platform === 'etsy' && <ShoppingBag className="h-4 w-4 text-violet-600" />}
              {platform === 'amazon' && <Truck className="h-4 w-4 text-violet-600" />}
              {platform === 'shopify' && 'Shopify Settings'}
              {platform === 'etsy' && 'Etsy Settings'}
              {platform === 'amazon' && 'Amazon FBA Settings'}
            </h3>

            {platform === 'shopify' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Plan</label>
                  <select
                    value={shopifyPlan}
                    onChange={(e) => setShopifyPlan(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                  >
                    {SHOPIFY_PLANS.map((p, i) => (
                      <option key={i} value={i}>{p.name} (${p.monthly}/mo)</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usesShopifyPayments}
                    onChange={(e) => setUsesShopifyPayments(e.target.checked)}
                    className="rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Use Shopify Payments (no extra transaction fee)</span>
                </label>
              </div>
            )}

            {platform === 'etsy' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Seller Region</label>
                  <select
                    value={etsyRegion}
                    onChange={(e) => setEtsyRegion(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                  >
                    {ETSY_REGIONS.map((r, i) => (
                      <option key={i} value={i}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={etsyOffsiteAds}
                    onChange={(e) => setEtsyOffsiteAds(e.target.checked)}
                    className="rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Include Offsite Ads fee (12–15%)</span>
                </label>
              </div>
            )}

            {platform === 'amazon' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Category</label>
                  <select
                    value={amazonCategory}
                    onChange={(e) => setAmazonCategory(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                  >
                    {AMAZON_CATEGORIES.map((c, i) => (
                      <option key={i} value={i}>{c.name} ({c.referralRate}%)</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Weight (oz)</label>
                    <input
                      type="number"
                      value={amazonWeightOz}
                      onChange={(e) => setAmazonWeightOz(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Storage (months)</label>
                    <input
                      type="number"
                      value={amazonStorageMonths}
                      onChange={(e) => setAmazonStorageMonths(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={amazonIsQ4}
                    onChange={(e) => setAmazonIsQ4(e.target.checked)}
                    className="rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Q4 season (3× storage rates)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Net Profit Card */}
          <div className={`rounded-2xl border p-6 shadow-sm ${isProfitable ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Net Profit Per Unit</span>
              {isProfitable ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
            </div>
            <div className={`text-4xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
              {formatMoney(breakdown.netProfit, cur.symbol, currency)}
            </div>
            <div className={`text-sm font-medium mt-1 ${marginColor}`}>
              {breakdown.netMargin.toFixed(1)}% net margin
            </div>
            {!isProfitable && (
              <p className="text-xs text-red-600 mt-2">You lose money on every sale at this price.</p>
            )}
          </div>

          {/* Break-even */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-medium text-neutral-500">Break-Even Price</span>
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">
              {formatMoney(breakdown.breakEvenPrice, cur.symbol, currency)}
            </div>
            <p className="text-[10px] text-neutral-400">Minimum to cover all costs</p>
          </div>

          {/* Fee Breakdown */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Fee Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Platform Fee</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.platformFee, cur.symbol, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Payment Processing</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.paymentProcessing, cur.symbol, currency)}</span>
              </div>
              {breakdown.listingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Listing Fee</span>
                  <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.listingFee, cur.symbol, currency)}</span>
                </div>
              )}
              {breakdown.fulfillmentFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Fulfillment</span>
                  <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.fulfillmentFee, cur.symbol, currency)}</span>
                </div>
              )}
              {breakdown.storageFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Storage</span>
                  <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.storageFee, cur.symbol, currency)}</span>
                </div>
              )}
              {breakdown.otherFees > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Other Fees</span>
                  <span className="text-neutral-900 dark:text-white">{formatMoney(breakdown.otherFees, cur.symbol, currency)}</span>
                </div>
              )}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Total Fees</span>
                <span className="text-red-600">{formatMoney(breakdown.totalFees, cur.symbol, currency)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-neutral-500">Fee % of Revenue</span>
                <span className="text-neutral-900 dark:text-white">{sellingPrice > 0 ? ((breakdown.totalFees / sellingPrice) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Cost Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Product</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(productCost, cur.symbol, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(shippingCost, cur.symbol, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Packaging</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(packagingCost, cur.symbol, currency)}</span>
              </div>
              {otherCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Other</span>
                  <span className="text-neutral-900 dark:text-white">{formatMoney(otherCost, cur.symbol, currency)}</span>
                </div>
              )}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Total Cost</span>
                <span className="text-neutral-900 dark:text-white">{formatMoney(productCost + shippingCost + packagingCost + otherCost, cur.symbol, currency)}</span>
              </div>
            </div>
          </div>

          {/* Copy Report */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Report Copied!' : 'Copy Report'}
          </button>
        </div>
      </div>

      {/* Platform Comparison */}
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-violet-600" />
          Quick Platform Comparison (Same Product)
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {(['shopify', 'etsy', 'amazon'] as Platform[]).map(p => {
            // Calculate simplified net for each platform at current price
            let fees = 0
            if (p === 'shopify') {
              fees = (sellingPrice * 2.9 / 100) + 0.30
            } else if (p === 'etsy') {
              fees = 0.20 + sellingPrice * 0.065 + (sellingPrice * 3 / 100) + 0.25
            } else {
              fees = sellingPrice * 0.15 + 4.75 + 0.30 // Home & Kitchen, ~12oz
            }
            const totalCost = productCost + shippingCost + packagingCost + otherCost
            const net = sellingPrice - totalCost - fees
            const margin = sellingPrice > 0 ? (net / sellingPrice) * 100 : 0
            
            return (
              <div key={p} className={`rounded-xl border p-4 ${net > 0 ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/10' : 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {p === 'shopify' && <Store className="h-4 w-4 text-violet-600" />}
                  {p === 'etsy' && <ShoppingBag className="h-4 w-4 text-violet-600" />}
                  {p === 'amazon' && <Truck className="h-4 w-4 text-violet-600" />}
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white capitalize">{p}</span>
                </div>
                <p className={`text-2xl font-bold ${net > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatMoney(net, cur.symbol, currency)}
                </p>
                <p className="text-xs text-neutral-500">{margin.toFixed(1)}% margin</p>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-neutral-500 mt-3">
          *Comparison uses simplified fee estimates. Use the full calculator above for precise platform-specific calculations.
        </p>
      </div>
    </div>
  )
}
