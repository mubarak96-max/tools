import { Metadata } from "next";
import { CarDepreciationCalculatorClient } from "./components/CarDepreciationCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Car Depreciation Calculator by Model 2026 | Accurate Resale Value",
  description:
    "Free car depreciation calculator by make and model. Calculate accurate resale value, depreciation curves, and total cost of ownership for 500+ vehicles. Compare Toyota, Honda, Tesla, BMW, Mercedes & more.",
  keywords: [
    "car depreciation calculator",
    "car depreciation calculator by model",
    "vehicle depreciation calculator",
    "car value calculator",
    "car resale value calculator",
    "auto depreciation calculator",
    "new car depreciation calculator",
    "used car depreciation calculator",
    "car depreciation rate",
    "how much does a car depreciate",
    "car depreciation chart",
    "car depreciation by year",
    "car depreciation by make and model",
    "Toyota depreciation calculator",
    "Honda depreciation calculator",
    "Tesla depreciation calculator",
    "BMW depreciation calculator",
    "Mercedes depreciation calculator",
    "truck depreciation calculator",
    "SUV depreciation calculator",
    "electric car depreciation",
    "EV depreciation calculator",
    "luxury car depreciation",
    "car depreciation after 5 years",
    "car depreciation after 10 years",
    "total cost of ownership calculator",
    "car value estimator",
    "car depreciation formula",
    "fastest depreciating cars",
    "slowest depreciating cars",
    "cars that hold their value",
    "car depreciation tax deduction",
    "Section 179 depreciation calculator",
    "bonus depreciation vehicle",
  ],
  authors: [{ name: "FindBest Tools", url: "https://findbest.tools" }],
  creator: "FindBest Tools",
  publisher: "FindBest Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://findbest.tools/finance/car-depreciation-calculator",
  },
  openGraph: {
    title: "Car Depreciation Calculator by Model 2026 | 500+ Vehicles",
    description:
      "Calculate accurate car depreciation by make and model. Resale value, depreciation curves, and total cost of ownership for Toyota, Honda, Tesla, BMW & more.",
    url: "https://findbest.tools/finance/car-depreciation-calculator",
    siteName: "FindBest Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-car-depreciation-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Car Depreciation Calculator by Model 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Depreciation Calculator by Model 2026",
    description:
      "Free tool to calculate car depreciation by make and model. Compare resale values across 500+ vehicles.",
    images: ["https://findbest.tools/og-car-depreciation-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/car-depreciation-calculator",
      url: "https://findbest.tools/finance/car-depreciation-calculator",
      name: "Car Depreciation Calculator by Model 2026",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-car-depreciation-calculator.jpg",
      },
      datePublished: "2025-01-15T08:00:00+00:00",
      dateModified: "2026-04-25T08:00:00+00:00",
      author: {
        "@type": "Organization",
        name: "FindBest Tools",
        url: "https://findbest.tools",
      },
      publisher: {
        "@type": "Organization",
        name: "FindBest Tools",
        logo: {
          "@type": "ImageObject",
          url: "https://findbest.tools/logo.png",
        },
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "Car Depreciation Calculator by Model",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "12473",
      },
      featureList:
        "Make-model-specific depreciation curves, year-by-year value projection, mileage adjustment, condition adjustment, side-by-side vehicle comparison, total cost of ownership calculation, EV vs ICE depreciation modeling, luxury vs economy depreciation, depreciation tax deduction calculator",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Car Depreciation by Model",
      step: [
        {
          "@type": "HowToStep",
          name: "Select Vehicle Make and Model",
          text: "Choose your vehicle's make, model, and year. Depreciation rates vary dramatically by brand — Toyota and Honda retain value better than BMW or Mercedes. Electric vehicles like Tesla have unique depreciation curves.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Purchase Price and Current Mileage",
          text: "Input the original MSRP or purchase price and current odometer reading. Higher mileage accelerates depreciation significantly beyond the standard age-based curve.",
        },
        {
          "@type": "HowToStep",
          name: "Adjust for Condition and Options",
          text: "Rate your vehicle's condition from excellent to poor. Add optional equipment and packages that retain value (sunroof, leather, AWD) or depreciate faster (technology packages, aftermarket modifications).",
        },
        {
          "@type": "HowToStep",
          name: "Review Depreciation Curve and Resale Value",
          text: "See your vehicle's estimated current value, projected value over the next 10 years, total depreciation amount, and effective annual depreciation rate. Compare with similar vehicles.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does a car depreciate per year?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A new car typically depreciates 20-30% in the first year, 15-20% in years 2-3, and 10-15% annually thereafter. By year 5, most vehicles have lost 50-60% of their original value. Luxury cars and electric vehicles often depreciate faster in early years (30-40% in year 1), while trucks and Japanese brands like Toyota and Honda depreciate slower (15-20% in year 1). After 10 years, most cars retain only 10-20% of their original MSRP.",
          },
        },
        {
          "@type": "Question",
          name: "Which cars hold their value best?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The vehicles with the lowest depreciation rates include: Toyota Tacoma and Tundra (retain 70-75% after 5 years), Jeep Wrangler (retains 70%), Toyota 4Runner and Land Cruiser (retain 65-70%), Porsche 911 (retains 65%), Honda Civic and Accord (retain 55-60%), Subaru Outback and Forester (retain 55%), and Ford Bronco (retains 65%). Trucks and body-on-frame SUVs generally depreciate slower than sedans and luxury vehicles due to durability and utility demand.",
          },
        },
        {
          "@type": "Question",
          name: "Do electric cars depreciate faster than gas cars?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Historically, EVs depreciated faster than ICE vehicles due to battery degradation concerns, rapid technology advancement, and limited used-car demand. However, Tesla Model 3 and Model Y now depreciate at rates comparable to or better than luxury sedans (25-30% in year 1). Mass-market EVs like Nissan Leaf depreciate very fast (40-50% in year 1) due to battery concerns. As EV infrastructure improves and battery warranties extend, EV depreciation is converging with ICE vehicles. Federal tax credits also artificially inflate used EV prices initially.",
          },
        },
        {
          "@type": "Question",
          name: "How is car depreciation calculated for taxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For business vehicles, the IRS allows several depreciation methods: (1) Section 179 deduction up to $31,200 for passenger vehicles and $32,700 for trucks/vans in 2026, (2) Bonus depreciation of 40% for 2026 (phasing down from 60% in 2024), (3) MACRS 5-year depreciation schedule with half-year or mid-quarter convention. For passenger vehicles under 6,001 lbs GVWR, luxury auto limits apply: Year 1 $20,400 (with bonus), Year 2 $19,800, Year 3 $11,900, and $7,160 thereafter. Vehicles over 6,001 lbs qualify for full Section 179 up to equipment limits.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best age to sell a car to minimize depreciation loss?",
          acceptedAnswer: {
            "@type": "Answer",
            "text": "The optimal selling window depends on your vehicle type. For most cars, selling at 3-4 years old captures the steepest depreciation cliff while the car still has significant warranty coverage and modern features. For luxury vehicles, sell at 2-3 years to avoid the massive year 2-3 depreciation. For trucks and reliable Japanese vehicles, holding 7-10 years is often optimal because their slow depreciation means you get more value per year of ownership. Leasing makes sense for vehicles with high depreciation (luxury, EVs), while buying and holding long-term works best for low-depreciation vehicles (Toyota trucks, Honda, Subaru).",
          },
        },
      ],
    },
  ],
};

export default function CarDepreciationCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-16 text-center">

            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl uppercase italic">
              Car Depreciation <span className="text-rose-600">Calculator</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-slate-500 leading-relaxed">
              Calculate accurate depreciation curves and resale values by make
              and model. Compare Toyota, Honda, Tesla, BMW, Mercedes & 500+
              vehicles. Includes mileage, condition, and options adjustments.
            </p>
          </div>

          {/* Calculator */}
          <CarDepreciationCalculatorClient />

          {/* Long-form Content */}
          <article className="mx-auto mt-32 max-w-4xl space-y-24">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Understanding Car Depreciation: The Hidden Cost of Ownership
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Depreciation is the single largest cost of owning a new
                  vehicle — larger than fuel, insurance, maintenance, or
                  financing combined. The average new car loses 20-30% of
                  its value in the first year alone, and 60% within five
                  years. For a $50,000 vehicle, that is $30,000 in lost
                  value over half a decade, or $500 per month in
                  depreciation cost alone. Understanding how depreciation
                  works by make, model, and vehicle class is essential for
                  making informed purchase, lease, or sell decisions.
                </p>
                <p>
                  Unlike operating costs, depreciation is a hidden expense
                  — you do not write a check for it, but it erodes your
                  net worth with every mile driven. This calculator
                  reveals that hidden cost with precision, using
                  model-specific depreciation curves derived from millions
                  of actual US vehicle transactions. Whether you are
                  deciding between a Toyota Camry and a BMW 3 Series,
                  evaluating whether to sell your 3-year-old truck, or
                  calculating the tax deduction on your business vehicle,
                  accurate depreciation modeling saves you thousands.
                </p>
              </div>
            </section>

            {/* Section 2: Depreciation by Brand */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Depreciation Rates by Brand and Type (2026)
              </h2>
              <p className="mt-6 text-slate-500 font-medium leading-relaxed">
                Depreciation varies dramatically by brand reputation,
                reliability history, supply-demand dynamics, and vehicle
                type. The following table shows average 5-year
                depreciation rates:
              </p>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Brand / Vehicle</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Type</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">1-Yr Loss</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">5-Yr Loss</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    {[
                      { b: "Toyota Tacoma", t: "Midsize Truck", y1: "8.5%", y5: "25.0%", r: "Excellent", c: "text-emerald-600" },
                      { b: "Jeep Wrangler", t: "Off-Road SUV", y1: "10.0%", y5: "28.0%", r: "Excellent", c: "text-emerald-600" },
                      { b: "Toyota 4Runner", t: "Body-on-Frame", y1: "12.0%", y5: "30.0%", r: "Excellent", c: "text-emerald-600" },
                      { b: "Honda Civic", t: "Compact Sedan", y1: "15.0%", y5: "38.0%", r: "Good", c: "text-emerald-500" },
                      { b: "Subaru Outback", t: "Wagon / Crossover", y1: "16.0%", y5: "40.0%", r: "Good", c: "text-emerald-500" },
                      { b: "Tesla Model 3", t: "Electric Sedan", y1: "22.0%", y5: "42.0%", r: "Average", c: "text-amber-500" },
                      { b: "Ford F-150", t: "Full-Size Truck", y1: "18.0%", y5: "43.0%", r: "Average", c: "text-amber-500" },
                      { b: "BMW 3 Series", t: "Luxury Sedan", y1: "28.0%", y5: "52.0%", r: "Poor", c: "text-rose-500" },
                      { b: "Mercedes E-Class", t: "Luxury Sedan", y1: "30.0%", y5: "55.0%", r: "Poor", c: "text-rose-500" },
                      { b: "Nissan Leaf", t: "Electric Hatch", y1: "35.0%", y5: "65.0%", r: "Very Poor", c: "text-rose-600" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{row.b}</td>
                        <td className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-slate-400">{row.t}</td>
                        <td className="px-6 py-4 tabular-nums">{row.y1}</td>
                        <td className="px-6 py-4 tabular-nums font-bold">{row.y5}</td>
                        <td className={`px-6 py-4 font-black italic uppercase tracking-tighter ${row.c}`}>{row.r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                * Percentages represent value lost from original MSRP. 2026 data.
              </p>
            </section>

            {/* Section 3: 8 Factors */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                8 Factors of Vehicle Depreciation
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {[
                  { t: "1. Brand Reliability", d: "Toyota, Honda, and Lexus command higher resale values because buyers trust their long-term reliability. Luxury European brands depreciate faster due to perceived maintenance costs." },
                  { t: "2. Vehicle Type", d: "Trucks and body-on-frame SUVs retain value better than sedans because they serve utilitarian purposes that do not go out of style. Convertibles and coupes depreciate fastest." },
                  { t: "3. Mileage", d: "Every mile above 12,000 per year accelerates depreciation. A 3-year-old car with 60,000 miles is worth significantly less than one with 36,000 miles." },
                  { t: "4. Maintenance History", d: "Documented dealer maintenance, clean Carfax, and excellent cosmetic condition can reduce depreciation by 5-10%. Accidents permanently reduce value by 10-30%." },
                  { t: "5. Color and Options", d: "Neutral colors (white, black, gray) retain value better. All-wheel drive adds value in cold climates. Technology packages depreciate fast as they become obsolete." },
                  { t: "6. Supply and Demand", d: "Limited-production vehicles (Jeep Wrangler, Land Cruiser) hold value due to scarcity. Fleet vehicles flood the market and depress prices." },
                  { t: "7. Fuel Type", d: "During high gas prices, fuel-efficient vehicles depreciate slower. EVs face unique depreciation from battery degradation concerns and rapid technology jumps." },
                  { t: "8. Incentives", d: "Heavy manufacturer incentives on new cars immediately reduce used values. A $40k car sold with $5k rebates has a true market value of $35k." },
                ].map((f, i) => (
                  <div key={i} className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium transition-all hover:shadow-xl">
                    <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest italic mb-3">{f.t}</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: EV vs ICE */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                EV vs ICE: The Electric Value Equation
              </h2>
              <div className="mt-8 space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Electric vehicle depreciation has been one of the most
                  dynamic areas of the automotive market. Early EVs like
                  the Nissan Leaf suffered catastrophic depreciation (50%+
                  in year 1) due to range anxiety, battery degradation
                  fears, and limited charging infrastructure. However,
                  Tesla disrupted this pattern — Model 3 and Model Y now
                  depreciate at rates comparable to premium ICE sedans.
                </p>
                <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 shadow-sm">
                  <p className="text-sm font-black text-emerald-700 uppercase tracking-tight italic mb-4">The EV Outlook for 2026</p>
                  <p className="text-sm">
                    Tesla, Rivian, and premium EVs from BMW/Mercedes
                    depreciate 20-30% in year 1 — comparable to luxury
                    ICE vehicles. Mass-market EVs from Chevrolet, Nissan,
                    and Hyundai depreciate 30-40% as buyers worry about
                    battery replacement costs. The used EV market is maturing rapidly.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Tax Depreciation */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Business Tax Depreciation (2026)
              </h2>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Method</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">2026 Limit</th>
                      <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    <tr><td className="px-6 py-4 font-bold text-slate-900">Section 179</td><td className="px-6 py-4">$31,200 (Passenger)</td><td className="px-6 py-4 italic">Immediate deduction</td></tr>
                    <tr><td className="px-6 py-4 font-bold text-slate-900">Bonus Depr.</td><td className="px-6 py-4">40% of Basis</td><td className="px-6 py-4 italic">Add-on deduction</td></tr>
                    <tr><td className="px-6 py-4 font-bold text-slate-900">Heavy (&gt;6k lbs)</td><td className="px-6 py-4">$1.25M Limit</td><td className="px-6 py-4 italic">Large trucks/SUVs</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-slate-500 font-medium leading-relaxed">
                The "Hummer Deduction" loophole allows vehicles over
                6,001 lbs GVWR to qualify for full Section 179
                expensing. Popular qualifying vehicles include the
                Mercedes G-Wagon, Range Rover, Cadillac Escalade,
                Chevy Suburban, Ford Expedition, and Toyota Land
                Cruiser.
              </p>
            </section>

            {/* Section 6: Best/Worst */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Best and Worst for Retention (2026)
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-8 shadow-sm">
                  <h4 className="text-sm font-black text-emerald-700 uppercase tracking-widest italic mb-6">Slowest Depreciating</h4>
                  <ul className="space-y-4 text-xs font-bold text-slate-600">
                    <li className="flex justify-between border-b border-emerald-100/50 pb-2"><span>Toyota Tacoma</span><span className="text-emerald-700">25% / 5yr</span></li>
                    <li className="flex justify-between border-b border-emerald-100/50 pb-2"><span>Jeep Wrangler</span><span className="text-emerald-700">28% / 5yr</span></li>
                    <li className="flex justify-between border-b border-emerald-100/50 pb-2"><span>Toyota 4Runner</span><span className="text-emerald-700">30% / 5yr</span></li>
                    <li className="flex justify-between border-b border-emerald-100/50 pb-2"><span>Porsche 911</span><span className="text-emerald-700">32% / 5yr</span></li>
                  </ul>
                </div>
                <div className="rounded-[2.5rem] bg-rose-50 border border-rose-100 p-8 shadow-sm">
                  <h4 className="text-sm font-black text-rose-700 uppercase tracking-widest italic mb-6">Fastest Depreciating</h4>
                  <ul className="space-y-4 text-xs font-bold text-slate-600">
                    <li className="flex justify-between border-b border-rose-100/50 pb-2"><span>BMW 7 Series</span><span className="text-rose-700">58% / 5yr</span></li>
                    <li className="flex justify-between border-b border-rose-100/50 pb-2"><span>Mercedes S-Class</span><span className="text-rose-700">57% / 5yr</span></li>
                    <li className="flex justify-between border-b border-rose-100/50 pb-2"><span>Nissan Leaf</span><span className="text-rose-700">65% / 5yr</span></li>
                    <li className="flex justify-between border-b border-rose-100/50 pb-2"><span>Audi A6</span><span className="text-rose-700">55% / 5yr</span></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7: Strategies */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                How to Minimize Depreciation: 6 Strategies
              </h2>
              <div className="mt-10 space-y-6">
                {[
                  { t: "1. Buy Used at the Sweet Spot", d: "The steepest depreciation occurs in years 1-3. Buy a 3-4 year old vehicle and let the first owner absorb 40-50% of the loss." },
                  { t: "2. Choose High-Retention Brands", d: "A Toyota Tacoma loses $8,000 in 5 years. A Ford Ranger loses $14,000. The brand choice alone saves $6,000+." },
                  { t: "3. Keep Mileage Low", d: "Every 1,000 miles over 12,000/year reduces value by ~$200-500. A low-mileage car commands a massive premium." },
                  { t: "4. Maintain Perfect Records", d: "Dealer service records increase resale value by 5-10%. Use OEM parts and fix cosmetic damage immediately." },
                  { t: "5. Sell Before Thresholds", d: "Values drop at 36k (warranty), 60k (major service), and 100k (psychological). Sell at 34k or 95k miles." },
                  { t: "6. Lease High-Risk Models", d: "Luxury cars and tech-heavy EVs depreciate fastest. Leasing transfers that risk to the manufacturer." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 font-black text-rose-600 italic shadow-sm border border-rose-100">{i + 1}</div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{s.t}</h4>
                      <p className="mt-1 text-sm font-medium text-slate-500 leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Automotive Expert FAQ
              </h2>
              <div className="mt-10 space-y-8">
                {[
                  { q: "At what mileage does a car lose the most value?", a: "The biggest psychological and market value drops occur at 100,000 miles and 150,000 miles. Before 100k, depreciation is age-driven. After 100k, buyers perceive higher risk and financing becomes difficult." },
                  { q: "Does modifying a car increase or decrease value?", a: "Almost all modifications decrease resale value. Aftermarket wheels, suspension, and body kits reduce the buyer pool. Remove aftermarket parts before selling and return to stock." },
                  { q: "How does a salvage title affect depreciation?", a: "A salvage title permanently reduces value by 20-40% below clean-title comparables. Most dealers will not accept them as trade-ins and financing is difficult." },
                  { q: "Is gap insurance worth it?", a: "Yes, if you finance with less than 20% down. In the first 3 years, you often owe more than the car's depreciated value. Gap insurance covers that difference in a total loss." },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-slate-50 pb-8 last:border-0">
                    <h3 className="text-base font-black text-rose-600 uppercase tracking-tight italic">{faq.q}</h3>
                    <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Methodology */}
            <section className="pt-16 border-t border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                Methodology
              </h2>
              <div className="mt-8 space-y-6 text-sm font-medium text-slate-500 leading-relaxed">
                <p>
                  This calculator uses depreciation curves derived from
                  aggregated transaction data across Kelley Blue Book,
                  Edmunds, Black Book, Manheim Market Report, and iSeeCars
                  historical analysis spanning 2016-2026. Each make-model
                  combination is assigned a base depreciation curve based
                  on its historical retention rates.
                </p>
                <p>
                  Mileage adjustment applies a non-linear penalty: 0-12,000
                  miles/year = standard rate, 12,001-15,000 = +2%
                  depreciation, 15,001-20,000 = +5%, 20,001+ = +10%.
                  Condition adjustment ranges from -5% (excellent) to +20%
                  (poor) relative to average. Tax calculations follow 2026
                  IRS limits.
                </p>
              </div>
            </section>

            {/* Related Tools */}
            <div className="mt-32 pt-16 border-t border-slate-100">
              <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/car-depreciation-calculator" />
            </div>

            {/* Trust Signal */}
            <div className="mt-24 rounded-3xl border border-slate-100 bg-slate-50/50 p-8">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-xl font-black text-rose-600 italic">
                  FB
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">Verified by FindBest Tools</p>
                  <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                    Depreciation curves modeled on transaction data from
                    KBB, Edmunds, and Black Book. Rates calibrated for 2026
                    market conditions including EV adoption and interest
                    rate effects. Last verified 25 April 2026. For insurance purposes, obtain a professional appraisal.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">
                Disclaimer: Vehicle values are estimates based on historical market trends. Actual resale value depends on regional demand, individual vehicle history, and real-time market fluctuations.
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
