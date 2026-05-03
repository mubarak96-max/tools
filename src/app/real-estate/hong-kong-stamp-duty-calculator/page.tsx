import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import {
  Ban,
  FileText,
  Globe2,
  Home,
  Landmark,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";

import Calculator from "@/app/real-estate/hong-kong-stamp-duty-calculator/components/Calculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/hong-kong-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-04T00:00:00.000Z";

const faq = [
  {
    question: "What stamp duty do I pay as a first-time buyer in Hong Kong?",
    answer:
      "As a Hong Kong permanent resident buying a first residential property, this route models Scale 1 AVD only. No BSD or Additional AVD is added in that scenario.",
  },
  {
    question: "Was Buyer's Stamp Duty abolished in Hong Kong?",
    answer:
      "No. The provided schedule treats BSD as reduced from 15% to 7.5% from 26 February 2024 for non-resident and company residential buyers.",
  },
  {
    question: "What is Additional AVD and when does it apply?",
    answer:
      "This route applies a 7.5% Additional AVD charge when a Hong Kong permanent resident buys a second or additional residential property.",
  },
  {
    question: "Is stamp duty different for commercial property in Hong Kong?",
    answer:
      "Yes. Under this calculator, commercial and other non-residential property pays Scale 2 AVD only, with no BSD and no Additional AVD.",
  },
  {
    question: "Should I still verify the result with the IRD or a solicitor?",
    answer:
      "Yes. Use this route for planning, then confirm the final treatment with the Inland Revenue Department and your solicitor before signing.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Hong Kong Stamp Duty Calculator | AVD, BSD and Additional AVD",
    description:
      "Calculate Hong Kong AVD, BSD, and Additional AVD using the supplied 2024 and 2025 post-policy-change schedule for residential and commercial property purchases.",
    path: PAGE_PATH,
  }),
  keywords: [
    "hong kong stamp duty calculator",
    "hong kong AVD calculator",
    "hong kong BSD calculator",
    "hong kong additional avd",
    "hong kong first time buyer stamp duty",
    "hong kong commercial property stamp duty",
  ],
  openGraph: {
    title: "Hong Kong Stamp Duty Calculator",
    description:
      "Estimate Hong Kong AVD, BSD, and Additional AVD across first-home, additional-home, non-resident, and commercial property scenarios.",
    url: PAGE_URL,
    type: "website",
  },
  other: {
    "article:modified_time": LAST_UPDATED_ISO,
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hong Kong Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "HKD",
    },
    description:
      "Free Hong Kong property stamp duty calculator covering AVD Scale 1 and Scale 2, BSD, and Additional AVD.",
  };
}

export default function HongKongStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Hong Kong Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Hong Kong Stamp Duty Calculator"
        description="Calculate Hong Kong AVD, BSD, and Additional AVD across first-home, additional-home, non-resident, and commercial property scenarios using the supplied 2024 policy-change schedule."
        faqs={faq}
        learn={<EditorialContent />}
      >
        <div className="space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-[#ddd5c8] bg-[linear-gradient(160deg,#1a1612_0%,#2e2520_60%,#3d3530_100%)] px-6 py-12 text-white shadow-[0_28px_70px_rgba(26,22,18,0.18)] sm:px-8 lg:px-10">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <HeroBadge icon={Sparkles}>2024 policy updated</HeroBadge>
                <HeroBadge icon={Zap}>Free calculator</HeroBadge>
                <HeroBadge icon={Globe2}>All buyer types</HeroBadge>
              </div>

              <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                Hong Kong stamp duty calculation with the post-February 2024 schedule
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
                Calculate a Hong Kong property purchase across AVD Scale 1, AVD Scale 2, BSD, and Additional
                AVD. This route reflects the supplied policy framing after BSD and Additional AVD were cut to
                7.5% and Special Stamp Duty was abolished.
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/68">
                <Feature icon={Zap} label="Instant results" />
                <Feature icon={Home} label="Residential and commercial" />
                <Feature icon={Globe2} label="Resident and non-resident scenarios" />
                <Feature icon={Landmark} label="2024 and 2025 use cases" />
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <div className="lg:sticky lg:top-24">
              <Calculator />
            </div>
            <QuickGuide />
          </section>
        </div>
      </ToolPageScaffold>
    </>
  );
}

function QuickGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">How stamp duty works in Hong Kong</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Hong Kong stamp duty can involve up to three acquisition layers depending on who is buying and what
          type of property is involved. The quick guide below keeps the structure explicit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <GuideCard
          icon={FileText}
          tone="blue"
          title="Ad Valorem Duty (AVD)"
          body="Payable by all buyers. Scale 1 is the lower schedule for Hong Kong permanent residents buying a first residential property. Scale 2 applies to other cases."
        />
        <GuideCard
          icon={Globe2}
          tone="rose"
          title="Buyer's Stamp Duty (BSD)"
          body="Modeled here at 7.5% for non-Hong Kong permanent residents and companies buying residential property."
        />
        <GuideCard
          icon={TrendingDown}
          tone="emerald"
          title="Additional AVD"
          body="Modeled here at 7.5% for Hong Kong permanent residents buying a second or additional residential property."
        />
        <GuideCard
          icon={Ban}
          tone="slate"
          title="Special Stamp Duty (SSD)"
          body="The supplied content treats SSD as abolished for residential property from 26 February 2024 and for non-residential property from October 2023."
        />
      </div>

      <div className="rounded-[1.75rem] border border-[#ddd5c8] bg-white p-6 shadow-[0_18px_50px_rgba(26,22,18,0.06)]">
        <h4 className="text-lg font-semibold text-slate-950">Quick comparison: what do you pay?</h4>
        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[#ddd5c8]">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#1a1612] text-left text-white">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Buyer Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">AVD</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">BSD</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Additional AVD</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <ComparisonRow buyer="HK PR - First Home" avd="Scale 1" avdTone="green" bsd="None" bsdTone="slate" extra="None" extraTone="slate" />
              <ComparisonRow buyer="HK PR - 2nd+ Home" avd="Scale 2" avdTone="gold" bsd="None" bsdTone="slate" extra="7.5%" extraTone="red" />
              <ComparisonRow buyer="Non-Resident / Company" avd="Scale 2" avdTone="gold" bsd="7.5%" bsdTone="red" extra="None*" extraTone="slate" />
              <ComparisonRow buyer="Commercial (any buyer)" avd="Scale 2" avdTone="gold" bsd="None" bsdTone="slate" extra="None" extraTone="slate" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-500">*BSD replaces Additional AVD for non-resident residential scenarios in this route.</p>
      </div>

      <div className="rounded-[1.75rem] border border-amber-200 bg-[linear-gradient(135deg,#fff8e7_0%,#fff3d0_100%)] p-6 shadow-[0_16px_40px_rgba(184,151,58,0.14)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <Sparkles className="h-4 w-4" />
          Key changes - 26 February 2024
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-amber-950">
          <li>Special Stamp Duty on residential property fully abolished.</li>
          <li>Buyer&apos;s Stamp Duty reduced from 15% to 7.5%.</li>
          <li>Additional AVD reduced from 15% to 7.5%.</li>
          <li>Special Stamp Duty on non-residential property already abolished in October 2023.</li>
        </ul>
      </div>
    </div>
  );
}

function EditorialContent() {
  const timeline = [
    { date: "November 2010", text: "Special Stamp Duty introduced to discourage short-term residential flipping." },
    { date: "October 2012", text: "Buyer's Stamp Duty introduced and the system moved into the era of stronger demand-side controls." },
    { date: "February 2013", text: "Double Stamp Duty and what later became the Additional AVD framework were introduced for non-first-time residential buyers." },
    { date: "November 2016", text: "Additional AVD was pushed up to 15% at the peak of the cooling-measures era." },
    { date: "October 2023", text: "Special Stamp Duty on non-residential property was abolished." },
    { date: "26 February 2024", text: "Residential Special Stamp Duty was abolished and both BSD and Additional AVD were cut to 7.5% under the supplied schedule." },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-[1.5rem] border border-[#ddd5c8] bg-[#f9f6f0] p-5">
        <p className="text-sm font-medium text-slate-700">
          This route uses the supplied post-February 2024 policy framing for Hong Kong AVD, BSD, and Additional AVD.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#ddd5c8]" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8973a]">Complete Guide</span>
          <div className="h-px flex-1 bg-[#ddd5c8]" />
        </div>

        <h2>Complete guide to Hong Kong stamp duty in 2024 and 2025</h2>
        <p>
          Stamp duty remains one of the most important transaction costs in a Hong Kong property purchase. The supplied
          schedule creates a sharp difference between a first-home Hong Kong permanent resident, an additional-home
          resident buyer, and a non-resident or corporate buyer.
        </p>
        <p>
          At HK$8 million, a first-time Hong Kong permanent resident may sit around HK$240,000 of duty under Scale 1,
          while a non-resident may face AVD plus BSD totaling about HK$840,000. That gap is exactly why route-level
          modeling matters before offer stage and before completion funds are finalized.
        </p>

        <h2>What this route includes</h2>
        <p>
          The calculator focuses on three acquisition layers. First, it applies Ad Valorem Duty using either Scale 1
          or Scale 2 depending on the buyer and property context. Second, it applies Buyer&apos;s Stamp Duty to the
          non-resident and company residential scenario. Third, it applies Additional AVD to a Hong Kong permanent
          resident buying a second or additional residential property.
        </p>

        <h2>AVD Scale 1 versus Scale 2</h2>
        <p>
          Scale 1 is the favorable schedule for a Hong Kong permanent resident buying a sole residential property.
          Scale 2 is the standard schedule used for commercial property and for residential situations outside that
          first-home case. Both scales include marginal relief ranges so the duty does not jump abruptly at bracket
          boundaries.
        </p>

        <blockquote>
          Marginal relief matters because a price just above a threshold should not create a disproportional tax cliff.
          The supplied schedule handles those ranges through fixed-duty or incremental formulas between major brackets.
        </blockquote>

        <h2>BSD for non-residents and companies</h2>
        <p>
          Under the supplied content, BSD remains relevant after February 2024 but at a lower 7.5% rate rather than
          the earlier 15% regime. This route applies that BSD only to residential purchases by non-Hong Kong permanent
          residents and by companies.
        </p>

        <h2>Additional AVD for second-plus residential purchases</h2>
        <p>
          Hong Kong permanent residents buying another residential property are modeled here with Scale 2 plus an
          additional 7.5% surcharge. In practice, this is often the make-or-break budget item for investors and
          homeowners who are buying before selling an existing residence.
        </p>

        <h2>Commercial property treatment</h2>
        <p>
          Commercial and other non-residential property are simpler in this route. They use Scale 2 AVD only, with no
          BSD and no Additional AVD. That distinction makes commercial acquisitions materially more duty-efficient than
          residential acquisitions for many buyer profiles.
        </p>

        <h2>Timeline of policy change</h2>
      </article>

      <div className="space-y-4 rounded-[1.75rem] border border-[#ddd5c8] bg-white p-6 shadow-[0_18px_50px_rgba(26,22,18,0.06)]">
        {timeline.map((item, index) => (
          <div key={item.date} className="relative pl-8">
            {index < timeline.length - 1 ? <div className="absolute left-[9px] top-5 h-[calc(100%+12px)] w-0.5 bg-[#ddd5c8]" /> : null}
            <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-[#f9f6f0] bg-[#b8973a]" />
            <p className="text-sm font-semibold text-slate-950">{item.date}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>Worked scenarios</h2>
        <p>
          A first-time Hong Kong permanent resident at HK$6 million is modeled around HK$150,000 under Scale 1. A
          non-resident buying HK$10 million of residential property is modeled at roughly HK$300,000 of Scale 2 AVD
          plus HK$750,000 of BSD, for about HK$1.05 million total duty. Commercial property at the same price point
          remains materially lighter because it avoids the residential surcharges.
        </p>

        <h2>How buyers legally reduce duty exposure</h2>
        <ul>
          <li>Sell an existing residential property before acquiring another if you need to avoid the additional residential surcharge.</li>
          <li>Evaluate whether the transaction is genuinely commercial rather than residential where planning flexibility exists.</li>
          <li>Confirm whether later permanent-resident treatment could support a BSD refund application in the non-resident case.</li>
          <li>Coordinate purchase structure with counsel early, especially where companies or mixed-status co-buyers are involved.</li>
        </ul>

        <h2>Important assumptions and limits</h2>
        <p>
          This route is a planning tool. It assumes the chargeable value matches the entered purchase price and it uses
          the schedule exactly as supplied in your brief. Actual stamping treatment depends on the legal structure,
          agreement timing, buyer status, and any relief or refund rules that may apply.
        </p>
      </article>
    </div>
  );
}

function HeroBadge({ children, icon: Icon }: { children: ReactNode; icon: ComponentType<{ className?: string }> }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function Feature({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function GuideCard({
  icon: Icon,
  tone,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: "blue" | "rose" | "emerald" | "slate";
  title: string;
  body: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-900",
    rose: "bg-rose-50 text-rose-900",
    emerald: "bg-emerald-50 text-emerald-900",
    slate: "bg-slate-100 text-slate-900",
  }[tone];

  return (
    <div className="rounded-[1.5rem] border border-[#ddd5c8] bg-white p-5 shadow-[0_14px_34px_rgba(26,22,18,0.05)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-base font-semibold text-slate-950">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function ComparisonRow({
  buyer,
  avd,
  avdTone,
  bsd,
  bsdTone,
  extra,
  extraTone,
}: {
  buyer: string;
  avd: string;
  avdTone: "green" | "gold";
  bsd: string;
  bsdTone: "red" | "slate";
  extra: string;
  extraTone: "red" | "slate";
}) {
  return (
    <tr className="border-t border-[#ddd5c8]">
      <td className="px-4 py-3 font-medium text-slate-900">{buyer}</td>
      <td className="px-4 py-3"><TableBadge tone={avdTone}>{avd}</TableBadge></td>
      <td className="px-4 py-3"><TableBadge tone={bsdTone}>{bsd}</TableBadge></td>
      <td className="px-4 py-3"><TableBadge tone={extraTone}>{extra}</TableBadge></td>
    </tr>
  );
}

function TableBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "green" | "gold" | "red" | "slate";
}) {
  const styles = {
    green: "bg-emerald-100 text-emerald-800",
    gold: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
    slate: "bg-slate-200 text-slate-700",
  }[tone];

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${styles}`}>{children}</span>;
}
