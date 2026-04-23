import type { Metadata } from "next";
import AmazonFbaCalculator from "@/components/AmazonFbaCalculator";
import { Landmark, TrendingUp, Package, Box, Truck, ShieldCheck, HelpCircle } from "lucide-react";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Amazon FBA Calculator UK — Fees, Profit & ROI",
  description:
    "Free Amazon FBA calculator UK. Calculate referral fees, FBA fulfilment costs, storage fees, VAT, and net profit per unit. Accurate 2024/2025 Amazon seller fees.",
  keywords: [
    "amazon fba calculator uk",
    "amazon seller fees calculator uk",
    "amazon profit calculator uk",
    "fba uk calculator",
    "amazon referral fee calculator uk",
    "amazon fba fees 2024 uk",
    "amazon seller profit calculator",
  ],
  openGraph: {
    title: "Amazon FBA Calculator UK — Seller Fees & Profit 2024",
    description:
      "Calculate exact Amazon UK seller fees — referral, FBA fulfilment, storage, and VAT — and see your true net profit per unit.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Amazon FBA Calculator UK",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  description:
    "Free Amazon FBA UK calculator for seller fees, FBA fulfilment costs, storage fees, VAT, and net profit.",
};

// ─── Fee table data ────────────────────────────────────────────────
const REFERRAL_FEE_TABLE = [
  { category: "Electronics, Computers, Camera, Mobile Phones", rate: "7%", note: "One of the lowest rates on Amazon UK" },
  { category: "Video Game Consoles", rate: "7%", note: "" },
  { category: "Books, Music, DVD, Software, Video Games", rate: "15%", note: "Media category" },
  { category: "Toys & Games, Baby, Beauty, Health", rate: "15%", note: "Standard consumer goods" },
  { category: "Clothing, Shoes & Bags", rate: "15%", note: "" },
  { category: "Kitchen & Home, Garden, Sports", rate: "15%", note: "" },
  { category: "Pet Supplies, Stationery, Office", rate: "15%", note: "" },
  { category: "DIY & Tools, Automotive, Industrial", rate: "12%", note: "" },
  { category: "Musical Instruments", rate: "12%", note: "" },
  { category: "Furniture & Décor", rate: "15% (≤£100) / 10% (>£100)", note: "Tiered by price" },
  { category: "Jewellery", rate: "20% (≤£225) / 5% (>£225)", note: "High-value pieces favourable" },
  { category: "Watches", rate: "15% (≤£225) / 5% (>£225)", note: "Tiered by price" },
  { category: "Grocery & Gourmet", rate: "8% (≤£10) / 15% (>£10)", note: "Tiered by price" },
];

const FULFILMENT_FEE_TABLE = [
  { tier: "Small envelope", dims: "≤33×23×2.5cm", weight: "≤80g", fee: "£1.86" },
  { tier: "Standard envelope", dims: "≤33×23×2.5cm", weight: "81–150g", fee: "£2.04" },
  { tier: "Large envelope (small)", dims: "≤33×23×3.2cm", weight: "151–400g", fee: "£2.44" },
  { tier: "Large envelope", dims: "≤33×23×3.2cm", weight: "401–900g", fee: "£2.83" },
  { tier: "Small parcel", dims: "≤45×34×26cm", weight: "≤200g", fee: "£2.70" },
  { tier: "Small parcel", dims: "≤45×34×26cm", weight: "201–500g", fee: "£3.00" },
  { tier: "Small parcel", dims: "≤45×34×26cm", weight: "501g–1kg", fee: "£3.31" },
  { tier: "Small parcel", dims: "≤45×34×26cm", weight: "1–2kg", fee: "£3.77–£4.17" },
  { tier: "Standard parcel", dims: "≤45×34×26cm", weight: "2–5kg", fee: "£4.80–£5.87" },
  { tier: "Standard parcel", dims: "≤45×34×26cm", weight: "5–12kg", fee: "£7.12–£10.06" },
  { tier: "Oversize", dims: "≤61×46×46cm", weight: ">12kg", fee: "£10.06 + £0.49/kg" },
];

const FAQS = [
  {
    q: "How are Amazon UK seller fees calculated?",
    a: "Amazon UK charges three main types of fees: a referral fee (a percentage of the total sale price including VAT, typically 7–20% depending on category), an FBA fulfilment fee (a flat fee based on weight and dimensions, ranging from £1.86 to £10+ per unit), and monthly storage fees (charged per cubic foot based on how long your inventory sits in Amazon's warehouse). There is also either a £0.75 per-item fee (Individual plan) or £25/month (Professional plan). This Amazon seller fees calculator UK shows you all four components in one place.",
  },
  {
    q: "Does Amazon charge VAT on its fees in the UK?",
    a: "Yes — Amazon charges 20% VAT on its referral fees and FBA fulfilment fees for UK sellers. If you are VAT registered, you can reclaim this VAT as input tax on your VAT return, so it is not a net cost for VAT-registered businesses. For non-VAT-registered sellers, Amazon's fees are effectively 20% higher than the headline rates suggest. This FBA UK calculator shows fees at face value; VAT-registered sellers should factor in the reclaim.",
  },
  {
    q: "What is the difference between Individual and Professional seller plans?",
    a: "The Individual plan charges £0.75 per item sold and has no monthly fee, but restricts access to bulk listing tools, advertising, and some categories. The Professional plan costs £25 per month (inc. VAT) regardless of how many items you sell, but gives full access to all selling tools, sponsored ads, and category approvals. The Professional plan becomes cheaper on a per-unit basis once you sell more than 33 units per month (£25 ÷ £0.75). If you plan to run a serious FBA business, the Professional plan is almost always the right choice.",
  },
  {
    q: "How do Amazon UK storage fees work?",
    a: "Amazon charges monthly storage fees based on the cubic volume your inventory occupies in their fulfilment centres. Standard-size products cost £0.50 per cubic foot from January to September, rising to £1.50 per cubic foot from October to December (the peak period ahead of Christmas). For context, a 20×15×8cm product occupies 0.085 cubic feet and costs roughly £0.04/month in standard season. Products that have been in the warehouse for more than 365 days may also incur long-term storage fees — a key reason FBA sellers focus on fast-turning inventory.",
  },
  {
    q: "What is a good profit margin for Amazon FBA UK?",
    a: "Most experienced FBA sellers target a minimum net margin of 20–30% after all fees and costs. Below 15% net margin, the business becomes very sensitive to fee increases, PPC cost rises, or supplier price changes. ROI on cost of goods is also important: a 50%+ ROI means you double your money on each unit cycle, which matters for cash flow and restocking. Use this amazon profit calculator UK to model different price points and find the margin that works for your business.",
  },
  {
    q: "Do Amazon referral fees apply to the full selling price or just the product price?",
    a: "In the UK, Amazon calculates the referral fee on the total transaction price including VAT. This is an important detail that catches many new sellers off guard — if you sell a product for £24.99 including 20% VAT, Amazon's 15% referral fee is calculated on the full £24.99, not on the ex-VAT price of £20.83. This means Amazon takes a cut of money that technically belongs to HMRC, effectively increasing your net cost of selling.",
  },
  {
    q: "Can I use this calculator for Merchant Fulfilled (MFN) orders?",
    a: "The referral fee component applies equally to both FBA and Merchant Fulfilled (MFN) orders — Amazon takes its percentage cut regardless of who ships the item. For MFN, simply enter £0 for the FBA fulfilment fee and storage costs, and add your own fulfilment costs (packaging, postage, labour) into the 'Other costs' field. This gives you an accurate comparison of FBA versus self-fulfilment economics.",
  },
  {
    q: "How does this FBA UK calculator handle dimensional weight?",
    a: "Amazon UK uses actual weight to determine FBA fulfilment fees for most product sizes, but applies dimensional weight for large or oversize items. Dimensional weight = (length × width × height in cm) ÷ 5000. If the dimensional weight exceeds the actual weight, Amazon uses the higher figure. Enter your actual product dimensions in the calculator and it will apply the correct fee tier based on both weight and size constraints.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function SectionHeading({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-16">
      {Icon && <div className="p-2 bg-orange-50 rounded-lg"><Icon className="w-6 h-6 text-orange-600" /></div>}
      <h2 className="text-2xl font-bold text-stone-900">{children}</h2>
    </div>
  );
}
function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold text-stone-800 mb-3 mt-8">{children}</h3>;
}
function Prose({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-5 text-[15px]">{children}</p>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function AmazonFbaCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="mb-12 max-w-3xl">

          <h1 className="text-5xl font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
            Amazon FBA <span className="text-orange-500">Calculator</span> UK
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed font-medium">
            Master your margins with the definitive Amazon seller fees calculator UK.
            Accurately model referral fees, FBA fulfilment, storage, and VAT to reveal your
            true net profit per unit.
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-20">
          <AmazonFbaCalculator />
        </div>

        {/* ── CONTENT SECTIONS ── */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          <div>
            <SectionHeading icon={Landmark}>Amazon UK seller fees explained</SectionHeading>
            <Prose>
              Understanding your true cost to sell on Amazon UK is the single most important skill
              for any FBA seller. Many sellers — especially those new to the platform — focus on
              the referral fee percentage and underestimate or ignore the cumulative impact of
              fulfilment fees, storage fees, inbound shipping, prep costs, and the seller plan fee.
              An accurate <strong>amazon profit calculator UK</strong> must account for all of these to give you a
              number you can actually base purchasing decisions on.
            </Prose>
            <Prose>
              Amazon charges four categories of fees directly: a referral fee on every sale, an FBA
              fulfilment fee for picking, packing, and shipping each unit, a monthly storage fee for
              holding your inventory in their warehouses, and a seller plan subscription. On top of
              this, you have your own costs: the price you paid your supplier, inbound shipping to
              Amazon&apos;s fulfilment centres, labelling and prep, and any advertising spend.
            </Prose>

            <SubHeading>Referral fees: The cost of the customer</SubHeading>
            <Prose>
              The referral fee is Amazon&apos;s most visible charge — a percentage of the total selling
              price (including VAT) taken on every transaction. Rates range from 7% for electronics
              to 20% for jewellery under £225. Most everyday consumer goods attract a 15% referral
              fee. Some categories — jewellery, watches, furniture, and grocery — use tiered rates
              that change depending on the sale price.
            </Prose>

            <div className="overflow-x-auto my-8 rounded-2xl border border-stone-200 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Category</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Rate</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERRAL_FEE_TABLE.map((row) => (
                    <tr key={row.category} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 text-stone-700 text-xs font-medium">{row.category}</td>
                      <td className="py-3 px-4 text-orange-600 text-xs font-bold">{row.rate}</td>
                      <td className="py-3 px-4 text-stone-400 text-[11px]">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionHeading icon={Truck}>FBA fulfilment fees 2024</SectionHeading>
            <Prose>
              FBA fulfilment fees are charged per unit shipped and are determined by the size and weight
              of your product. Amazon uses whichever is greater between actual weight and dimensional
              weight (length × width × height ÷ 5,000) for oversize items. Getting these numbers right
              matters: a product that weighs 450g but has bulky dimensions may be classified into a
              higher fee tier than its weight alone would suggest.
            </Prose>

            <div className="overflow-x-auto my-8 rounded-2xl border border-stone-200 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Size tier</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Dimensions</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Weight</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold text-stone-500 uppercase">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {FULFILMENT_FEE_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-4 text-stone-700 text-xs font-medium">{row.tier}</td>
                      <td className="py-2.5 px-4 text-stone-500 text-[11px]">{row.dims}</td>
                      <td className="py-2.5 px-4 text-stone-500 text-[11px]">{row.weight}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-stone-800 text-xs tabular-nums">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionHeading icon={Box}>Storage: The Silent Profit Killer</SectionHeading>
            <Prose>
              Monthly inventory storage fees are charged based on the volume of space your products
              occupy, measured in cubic feet. Standard-size rates are
              £0.50/ft³ from January to September and £1.50/ft³ from October to December. The peak
              season rate is <strong>three times the standard rate</strong> — a significant cost if
              you are carrying slow-moving inventory into Q4.
            </Prose>
            <Prose>
              Products stored for longer than 365 days are subject to <strong>long-term storage fees</strong>,
              which can be devastating for margins. Successful FBA sellers treat inventory turnover
              as a key operational metric, aiming for at least 4-6 turns per year to avoid
              unnecessary storage overhead.
            </Prose>

            <SectionHeading icon={TrendingUp}>Calculating Amazon FBA profit correctly</SectionHeading>
            <Prose>
              The formula for true FBA profit is:
              <code className="block my-4 p-4 bg-stone-100 rounded-xl text-stone-800 font-mono text-xs leading-relaxed">
                Profit = (Net Sale Price) - (COGS) - (Inbound Shipping) - (Prep) - (Referral Fee) - (Fulfilment Fee) - (Storage) - (Plan Fee)
              </code>
              The two numbers that matter most beyond raw profit are <strong>Margin</strong> (profit as % of net price)
              and <strong>ROI</strong> (profit as % of cost of goods). Margin tells you how resilient your pricing
              is to fee changes, while ROI tells you how efficiently you are deploying capital.
            </Prose>

            <SectionHeading icon={ShieldCheck}>VAT and Amazon UK: The Essential Nuance</SectionHeading>
            <Prose>
              If you are VAT registered, you collect 20% VAT from the buyer, but this money is
              remitted to HMRC — it is not your income. Critically, <strong>Amazon calculates its
                referral fee on the total sale price including VAT</strong>. This means Amazon takes
              a percentage of the tax you collect, effectively increasing your cost of selling.
            </Prose>
            <Prose>
              However, VAT-registered sellers can reclaim the VAT on Amazon&apos;s fees. This
              &quot;Input VAT&quot; reclaim can improve your effective margin compared to non-registered
              sellers who must treat the VAT on Amazon fees as a pure cost.
            </Prose>
          </div>

          {/* Sidebar / FAQ Highlights */}
          <div className="space-y-8">
            <div className="p-6 bg-stone-900 rounded-3xl text-white">
              <h4 className="text-lg font-bold mb-4">Quick Benchmarks</h4>
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-primary text-2xl font-black mb-1">15%</p>
                  <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Target Net Margin</p>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">Minimum safety threshold for a sustainable FBA business.</p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-primary text-2xl font-black mb-1">100%</p>
                  <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Target ROI</p>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">Doubling your money on unit cost allows for aggressive scaling.</p>
                </div>
                <div>
                  <p className="text-primary text-2xl font-black mb-1">33</p>
                  <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Break-even Units</p>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">Sales per month where Professional plan beats Individual.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <h4 className="text-orange-900 font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Pro Tip
              </h4>
              <p className="text-xs text-orange-800 leading-relaxed italic">
                &quot;Always weigh and measure your product in its <strong>Amazon-ready</strong> packaging,
                not the raw product. Even a 5mm difference in height can push you into a higher
                fulfilment fee tier and wipe out 10% of your margin.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Full Section */}
        <SectionHeading icon={HelpCircle}>Frequently asked questions</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="p-6 border border-stone-200 rounded-2xl hover:border-orange-200 transition-colors bg-white group"
            >
              <h4 className="text-sm font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">{faq.q}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <RelatedToolsSection 
            category="Finance" 
            categoryHref="/finance" 
            currentPath="/finance/amazon-fba-calculator-uk" 
          />
          <RelatedToolsSection 
            category="Marketing" 
            categoryHref="/marketing" 
            currentPath="/finance/amazon-fba-calculator-uk" 
          />
        </div>

        {/* Disclaimer */}
        <div className="mt-20 p-8 bg-stone-50 rounded-3xl border border-stone-200">
          <p className="text-[11px] text-stone-400 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This Amazon FBA calculator
            UK uses fee data sourced from Amazon Seller Central as of 2024/2025. Amazon updates
            its fee schedules periodically — always verify current fees at{" "}
            <a 
              href="https://sellercentral.amazon.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-700 underline decoration-stone-300 underline-offset-2 hover:text-orange-600 hover:decoration-orange-400 transition-all"
            >
              sellercentral.amazon.co.uk
            </a>{" "}
            before making
            sourcing or pricing decisions. This tool is for informational purposes only and does
            not constitute financial or business advice. VAT guidance is simplified — consult a
            UK accountant for advice specific to your business situation.
          </p>
        </div>

      </main>
    </>
  );
}
