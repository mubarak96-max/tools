import type { Metadata } from "next";

import SingaporeBuyersStampDutyCalculator from "@/app/real-estate/singapore-buyers-stamp-duty-calculator/components/SingaporeBuyersStampDutyCalculator";
import { ABSD_TABLE, BSD_TABLE } from "@/app/real-estate/singapore-buyers-stamp-duty-calculator/lib/stampDuty";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/singapore-buyers-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-04T00:00:00.000Z";

const faq = [
  {
    question: "How much stamp duty does a foreigner pay in Singapore?",
    answer:
      "Under the supplied April 2023 schedule, a foreigner buying any residential property pays 60% ABSD plus progressive BSD. Nationals of Iceland, Liechtenstein, Norway, Switzerland, and the United States may be treated as Singapore Citizens for ABSD purposes under the relevant free trade agreements.",
  },
  {
    question: "What is ABSD in Singapore and how is it calculated?",
    answer:
      "ABSD is Additional Buyer's Stamp Duty, a flat-rate surcharge on residential acquisitions. This calculator applies the selected buyer profile's ABSD percentage to the full purchase price, then adds BSD calculated on progressive bands.",
  },
  {
    question: "Do Singapore PRs pay stamp duty on their first property?",
    answer:
      "Yes. A Singapore PR still pays progressive BSD on the purchase price and, under this schedule, 5% ABSD on a first residential property purchase.",
  },
  {
    question: "Is there stamp duty on commercial property in Singapore?",
    answer:
      "Yes. Non-residential property still attracts BSD in this calculator, but ABSD is not applied to commercial or industrial property.",
  },
  {
    question: "Should I still verify the result with IRAS or a conveyancer?",
    answer:
      "Yes. This page is for planning and comparison. Final duty is normally assessed on the higher of purchase price or market value, and remission or exemption rules can materially change the outcome.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Singapore Buyer's Stamp Duty Calculator | BSD and ABSD",
    description:
      "Calculate Singapore BSD and ABSD for residential and non-residential purchases using the supplied BSD bands effective 15 Feb 2023 and ABSD schedule effective 27 Apr 2023.",
    path: PAGE_PATH,
  }),
  keywords: [
    "singapore buyers stamp duty calculator",
    "singapore BSD calculator",
    "singapore ABSD calculator",
    "buyer stamp duty singapore",
    "additional buyer stamp duty singapore",
    "singapore property buyer duty",
    "singapore commercial stamp duty calculator",
  ],
  openGraph: {
    title: "Singapore Buyer's Stamp Duty Calculator",
    description:
      "Model Singapore BSD and ABSD across buyer profiles, including citizens, PRs, foreigners, and entities.",
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
    name: "Singapore Buyer's Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SGD",
    },
    description:
      "Free Singapore buyer stamp duty calculator covering BSD and ABSD for residential and non-residential purchase scenarios.",
  };
}

export default function SingaporeBuyersStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Singapore Buyer's Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Singapore Buyer's Stamp Duty Calculator"
        description="Calculate Singapore BSD and ABSD across citizen, PR, foreigner, entity, and commercial-property scenarios using the supplied post-April 2023 buyer-duty schedule."
        faqs={faq}
        learn={
          <div className="space-y-10">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-600">
                Rates modeled on this page: BSD bands effective 15 February 2023 and ABSD rates effective 27 April 2023.
              </p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2>How Singapore stamp duty works</h2>
              <p>
                Singapore property buyers usually need to plan for two taxes at acquisition. The first is standard
                Buyer&apos;s Stamp Duty, which applies on progressive tiers. The second is Additional Buyer&apos;s Stamp Duty,
                which only applies to residential property and depends on the buyer&apos;s profile.
              </p>
              <p>
                That buyer-profile sensitivity is why this page is useful before making an offer. The same purchase
                price can lead to dramatically different cash requirements depending on whether the buyer is a first-time
                Singapore Citizen, a Permanent Resident, a foreigner, or an entity.
              </p>

              <h2>BSD bands used in this calculator</h2>
              <p>The page uses the following BSD schedule across the property price:</p>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
              <table className="w-full border-collapse bg-white text-sm">
                <thead className="bg-slate-900 text-left text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Band</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {BSD_TABLE.map((row) => (
                    <tr key={row.range} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-700">{row.range}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2>ABSD rates used in this calculator</h2>
              <p>
                For residential purchases, the calculator adds ABSD as a flat percentage of the full property price.
                The schedule below reflects the supplied 27 April 2023 revision.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
              <table className="w-full border-collapse bg-white text-sm">
                <thead className="bg-slate-900 text-left text-white">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Buyer Profile</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {ABSD_TABLE.map((row) => (
                    <tr key={row.profile} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-700">{row.profile}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2>Where the page is most useful</h2>
              <ul>
                <li>Comparing first-home, second-property, and third-property residential scenarios.</li>
                <li>Estimating the cash impact of ABSD before negotiating a purchase.</li>
                <li>Checking whether a non-residential purchase avoids ABSD entirely.</li>
                <li>Preparing a cleaner budget before legal fees, loan costs, and CPF planning are layered in.</li>
              </ul>

              <h2>Important assumptions</h2>
              <p>
                The calculator uses a single price input and therefore assumes the chargeable value equals the purchase
                price. In practice, duty is often assessed on the higher of the purchase price and market value.
              </p>
              <p>
                Remission rules for replacement homes, married couples, developers, and trust arrangements can materially
                change the result. Use this page to frame the economics, then confirm the final duty treatment with IRAS
                guidance and a conveyancing professional.
              </p>
            </div>
          </div>
        }
      >
        <SingaporeBuyersStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
