"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do you calculate price per square foot accurately?",
    answer:
      "To calculate price per square foot accurately, divide the total price by the total livable or usable square footage. The formula is: Price Per Square Foot = Total Price ÷ Total Square Feet. For real estate, use the heated/cooled square footage listed on the appraisal or tax records, not the total lot size. For construction, include all buildable area including walls. Always verify measurements independently rather than relying solely on listing data, as square footage discrepancies are common and can significantly affect your calculated price per square foot.",
  },
  {
    question: "What is the average price per square foot in the United States in 2024?",
    answer:
      "As of 2024, the median price per square foot for existing single-family homes in the United States ranges between $150 and $220, depending on the source and methodology. However, this varies dramatically by region. Major metropolitan areas like San Francisco ($1,100+), New York City ($800+), and Los Angeles ($650+) command premium prices, while markets in the Midwest and South such as Houston ($180+), San Antonio ($160+), and Atlanta ($200+) offer significantly lower price per square foot values. New construction typically ranges from $100 to $400 per square foot depending on finish level and location.",
  },
  {
    question: "Is price per square foot a reliable metric for comparing property values?",
    answer:
      "Price per square foot is a useful comparative metric but should never be used in isolation. It works best when comparing similar properties within the same neighborhood, built around the same time, with comparable lot sizes, finishes, and conditions. Price per square foot breaks down when comparing properties with vastly different lot values, unique architectural features, premium views, or significant condition differences. For example, a waterfront property and an inland property may have the same square footage but completely different valuations. Always supplement PSF analysis with comparable sales data (comps), market trends, and professional appraisal.",
  },
  {
    question: "How do you calculate construction cost per square foot for a new build?",
    answer:
      "Construction cost per square foot is calculated by dividing your total construction budget by the total buildable square footage. The total budget should include hard costs (materials, labor, site work, landscaping) and soft costs (architectural fees, engineering, permits, inspections, financing costs, and contingency reserves). National averages in 2024 range from $100-$150 per square foot for economy construction, $150-$250 for mid-range, and $250-$400+ for luxury or custom builds. Regional labor costs, material availability, and site conditions (slope, soil type, accessibility) can significantly impact your actual construction cost per square foot.",
  },
  {
    question: "How do you calculate commercial rent per square foot?",
    answer:
      "Commercial rent per square foot is calculated by dividing the annual base rent by the total leasable square footage. For example, if a 2,500 sq ft retail space has an annual rent of $75,000, the rent per square foot is $30.00 NNN (triple net). In commercial leasing, understand the difference between usable square footage (the actual space you occupy) and rentable square footage (which includes your pro-rata share of common areas). Commercial leases may be structured as NNN (tenant pays taxes, insurance, maintenance), gross (landlord pays operating expenses), or modified gross. Always calculate your total occupancy cost including CAM charges, utilities, and percentage rent when evaluating commercial space.",
  },
  {
    question: "What is the difference between price per square foot and cost per square foot?",
    answer:
      "While often used interchangeably, 'price per square foot' typically refers to the market value or purchase price divided by square footage—what a buyer pays. 'Cost per square foot' usually refers to the actual expense to construct or renovate a property—what a builder spends. For example, a home might have a construction cost of $200 per square foot but sell for $350 per square foot due to land value, location premium, and market demand. Understanding this distinction is crucial for investors analyzing development pro formas and evaluating profit margins on new construction projects.",
  },
  {
    question: "How do flooring costs per square foot vary by material?",
    answer:
      "Flooring costs per square foot vary dramatically by material and installation complexity. In 2024, carpet ranges from $3-$11 installed, laminate from $4-$14, vinyl plank (LVP/LVT) from $5-$20, engineered hardwood from $8-$25, solid hardwood from $12-$40, tile from $8-$30, and natural stone from $15-$50+ per square foot. These prices include materials and professional installation. DIY installation can reduce costs by 40-60%. Additional factors affecting flooring cost per square foot include subfloor preparation, removal of existing flooring, room layout complexity, and geographic labor rates. Always add 10-15% extra material for waste and pattern matching.",
  },
  {
    question: "How do you calculate the price per square foot of a lot or land?",
    answer:
      "Land price per square foot is calculated by dividing the total land cost by the total lot size in square feet. For example, a $200,000 lot that is 10,000 square feet has a land price of $20 per square foot. In real estate development, analysts often convert this to price per acre (43,560 sq ft) for larger parcels. When evaluating land value, consider zoning restrictions, utility access, topography, soil conditions, and entitlement status. Raw land typically trades at lower per-square-foot values than entitled or developed lots. Location and permitted density (units per acre) are the primary drivers of land value per square foot.",
  },
  {
    question: "Why do price per square foot calculations differ between finished and unfinished basements?",
    answer:
      "Finished basements are typically included in total square footage calculations for price per square foot, while unfinished basements may be excluded or valued at a discount. Appraisers and MLS systems have varying standards—some count above-grade square footage only, while others include below-grade finished space at reduced value. When comparing properties, verify whether basement square footage is included in the stated total. A home with a finished basement may show a lower price per square foot than a similar home without one if the basement area is included, potentially creating a misleading comparison. Always request a breakdown of above-grade vs. below-grade square footage.",
  },
  {
    question: "How do property taxes relate to price per square foot?",
    answer:
      "Property tax assessments often use price per square foot as a valuation method, comparing your property to similar sold properties on a per-square-foot basis. Tax assessors apply adjustment factors for location, condition, and features, then multiply the adjusted price per square foot by your property's square footage to determine assessed value. If you believe your assessed price per square foot exceeds comparable properties, you may have grounds for a tax appeal. Monitor your assessment ratio (assessed value ÷ market value) and compare your price per square foot assessment to recent sales in your area to identify potential over-assessment.",
  },
  {
    question: "What is the price per square foot formula for remodeling projects?",
    answer:
      "For remodeling, calculate price per square foot by dividing the total project cost by the square footage of the affected area. Kitchen remodels typically range from $150-$450 per square foot, bathroom remodels from $200-$600 per square foot, and whole-home renovations from $75-$200 per square foot. Unlike new construction, remodeling costs per square foot are higher due to demolition, working within existing structures, and the concentration of expensive systems (plumbing, electrical) in smaller spaces. Always distinguish between price per square foot of the remodeled room versus the entire home when comparing project values.",
  },
  {
    question: "How do you use price per square foot to evaluate rental property investments?",
    answer:
      "Real estate investors use price per square foot to compare acquisition costs across markets and property types. Calculate rent per square foot (monthly rent ÷ square footage) and compare it to the purchase price per square foot to assess cash flow potential. A property purchased at $150 per square foot that rents for $1.50 per square foot monthly offers a stronger gross rent multiplier than one purchased at $300 per square foot renting for $1.75 per square foot. Additionally, track price per square foot trends over time to identify emerging markets where values are appreciating but remain below regional averages.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-xl bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-5 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
