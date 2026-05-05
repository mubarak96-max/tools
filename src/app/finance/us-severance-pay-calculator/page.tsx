import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Bolt,
  BriefcaseBusiness,
  Calendar,
  CalendarDays,
  CalendarRange,
  FileText,
  HeartPulse,
  Landmark,
  Layers3,
  Lightbulb,
  Receipt,
  TriangleAlert,
} from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import Calculator from "./components/Calculator";

export const revalidate = 43_200;

const PAGE_PATH = "/finance/us-severance-pay-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faqItems = [
  {
    question: "How is severance pay calculated in the US?",
    answer:
      "There is no federal severance formula. Most employers use one or two weeks of base pay per year of service, while executive packages may use one month per year. Multiply weekly pay by severance weeks to estimate the base cash severance amount.",
  },
  {
    question: "Is severance pay taxable in the United States?",
    answer:
      "Yes. Severance is taxed as ordinary income and is typically subject to federal income tax, Social Security, Medicare, and state income tax where applicable.",
  },
  {
    question: "Am I automatically entitled to severance if I am laid off?",
    answer:
      "Usually not under federal law. You may be entitled if your contract, handbook, severance plan, collective bargaining agreement, or company practice promises it.",
  },
  {
    question: "Can I collect unemployment while receiving severance?",
    answer:
      "It depends on your state. Some states delay unemployment benefits when severance is paid, while others allow both at the same time.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "US Severance Pay Calculator | Estimate Net Pay After Tax",
    description:
      "Estimate your US severance package with base pay, PTO payout, COBRA value, and net take-home after federal and state taxes. Free tool on FindBest Tools.",
    path: PAGE_PATH,
  }),
  keywords: [
    "us severance pay calculator",
    "severance pay calculator after tax",
    "severance package calculator",
    "layoff severance calculator",
    "severance tax calculator",
    "cobra severance calculator",
    "pto payout calculator severance",
    "how much severance should i get",
  ],
};

function quickGuideCards() {
  return [
    {
      icon: Calendar,
      title: "1 week / year",
      color: "#1b3a6e",
      background: "#ebf0fa",
      body: "Common floor for individual contributor and hourly roles. Five years of service usually means five weeks of pay.",
    },
    {
      icon: CalendarDays,
      title: "2 weeks / year",
      color: "#065f46",
      background: "#d1fae5",
      body: "Typical white-collar and manager package. Five years of service usually means ten weeks of pay.",
    },
    {
      icon: CalendarRange,
      title: "1 month / year",
      color: "#78350f",
      background: "#fffbeb",
      body: "Executive-style structure that is usually negotiated, not policy-default.",
    },
    {
      icon: FileText,
      title: "Custom terms",
      color: "#4c1d95",
      background: "#f5f3ff",
      body: "Offer letters, employment contracts, or separation agreements can override the standard multipliers.",
    },
  ];
}

function packageRows() {
  return [
    {
      item: "Base severance pay",
      sign: "+",
      description: "Weeks of salary multiplied by the severance formula.",
    },
    {
      item: "Accrued PTO payout",
      sign: "+",
      description: "Unused vacation or PTO hours paid out at your wage rate where applicable.",
    },
    {
      item: "COBRA health coverage",
      sign: "+",
      description: "Employer-paid continuation coverage can add real non-cash value.",
    },
    {
      item: "Pro-rata bonus",
      sign: "+",
      description: "Partial-year bonus for work completed before separation.",
    },
    {
      item: "Outplacement support",
      sign: "+",
      description: "Career coaching and resume support are often negotiable additions.",
    },
    {
      item: "Signing bonus clawback",
      sign: "-",
      description: "Some offer letters require repayment if you leave within a defined window.",
    },
  ];
}

function featurePills() {
  return [
    { icon: Bolt, label: "Instant results" },
    { icon: Receipt, label: "Tax breakdown" },
    { icon: Lightbulb, label: "Negotiation tips" },
    { icon: Layers3, label: "All formulas" },
  ];
}

function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "US Severance Pay Calculator",
        description:
          "Estimate severance cash, PTO payout, COBRA value, and after-tax take-home for US layoffs and negotiated exits.",
      },
      {
        "@type": "SoftwareApplication",
        name: "US Severance Pay Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        url: PAGE_URL,
        featureList: [
          "Severance formula comparison",
          "Federal and state tax estimate",
          "PTO payout estimate",
          "COBRA value estimate",
          "Negotiation guidance",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Finance", path: "/finance" },
        { name: "US Severance Pay Calculator", path: PAGE_PATH },
      ]),
    ],
  };
}

function QuickGuide() {
  return (
    <div>
      <h2 style={{ fontSize: "1.55rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
        How US Severance Pay Works
      </h2>
      <p style={{ color: "var(--ink-light)", fontSize: "0.93rem", marginBottom: 22, lineHeight: 1.7 }}>
        There is no federal law requiring severance. What you receive depends on employer policy, your contract,
        and how well you negotiate.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {quickGuideCards().map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              style={{
                background: card.background,
                borderRadius: 12,
                padding: "14px",
                border: "1px solid transparent",
              }}
            >
              <div className="guide-card-icon" style={{ color: card.color }}>
                <Icon size={18} />
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: card.color, marginBottom: 5 }}>{card.title}</div>
              <div style={{ fontSize: "0.76rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>{card.body}</div>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--ink)", marginBottom: 10 }}>
        What Is Usually Included
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
        {packageRows().map((row) => (
          <div
            key={row.item}
            style={{
              display: "flex",
              gap: 10,
              padding: "9px 12px",
              background: "white",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <span style={{ fontWeight: 700, color: row.sign === "+" ? "var(--green)" : "var(--red)", flexShrink: 0, width: 14 }}>
              {row.sign}
            </span>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.86rem", color: "var(--ink)" }}>{row.item}</span>
              <span style={{ color: "var(--ink-light)", fontSize: "0.78rem" }}> - {row.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          border: "1.5px solid #f59e0b",
          borderRadius: 12,
          padding: "16px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#78350f", fontSize: "0.85rem", marginBottom: 8 }}>
          <TriangleAlert size={16} />
          Severance is taxable
        </div>
        <p style={{ fontSize: "0.82rem", color: "#92400e", lineHeight: 1.6, margin: 0 }}>
          Severance is generally taxed as ordinary income. Federal withholding, Social Security, Medicare, and
          state tax can all apply depending on the package structure and your location.
        </p>
      </div>
    </div>
  );
}

function EditorialContent() {
  return (
    <article className="prose">
      <div style={{ maxWidth: 860 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span
            style={{
              color: "var(--navy-light)",
              fontWeight: 700,
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Complete Guide
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <h2>The Complete US Severance Pay Guide</h2>
        <p>
          Losing a job is stressful enough without having to reverse-engineer what your package is worth. This guide
          explains the usual severance formulas, how taxes affect the cash portion, and what terms are worth
          negotiating before you sign.
        </p>
        <p>
          In the United States there is no universal federal severance formula. Your outcome depends on company policy,
          contract language, state rules, and leverage at the point of separation.
        </p>

        <h2>Is your employer required to pay severance?</h2>
        <p>
          Usually no under federal law. You may still be entitled to severance if your offer letter, employment
          agreement, employee handbook, ERISA plan, or collective bargaining agreement promises it.
        </p>

        <ul>
          <li>Your offer letter or contract explicitly includes severance terms.</li>
          <li>The employer has a written severance policy or plan.</li>
          <li>A collective bargaining agreement covers the role.</li>
          <li>The company has created a consistent severance practice that employees reasonably rely on.</li>
        </ul>

        <h2>How severance is usually calculated</h2>
        <p>
          Most employers quote severance in weeks of pay per year of service. One week per year is common for baseline
          roles, two weeks per year is common for managers, and one month per year tends to appear in executive exits.
        </p>
        <p>
          Weekly pay is normally base salary divided by 52. Bonuses, commissions, and equity are often excluded unless
          the agreement says otherwise.
        </p>

        <h2>How severance is taxed</h2>
        <p>
          Severance is generally treated as supplemental wage income. Employers may withhold at a flat supplemental
          rate, but your actual tax due depends on your full-year income when you file.
        </p>
        <blockquote>
          Your withholding can be lower or higher than your final liability. A large package late in the year can still
          leave you owing more at filing time.
        </blockquote>

        <h2>What to negotiate beyond cash</h2>
        <div className="timeline-item">
          <strong>COBRA subsidy.</strong> Employer-paid COBRA can add meaningful non-cash value to the package.
        </div>
        <div className="timeline-item">
          <strong>Reference language.</strong> Ask for a written neutral or positive reference commitment.
        </div>
        <div className="timeline-item">
          <strong>Equity treatment.</strong> Review whether RSUs or options can vest, extend, or accelerate.
        </div>
        <div className="timeline-item">
          <strong>Release scope.</strong> Understand exactly what claims you are waiving before you sign.
        </div>

        <h2>COBRA and PTO can materially change value</h2>
        <p>
          Two packages with the same severance weeks can be very different once you factor in unused PTO, bonus
          treatment, and who pays for health coverage after separation.
        </p>

        <h2>Use the calculator as an estimate, not a final answer</h2>
        <p>
          This tool is meant to frame the conversation and help you compare scenarios. It does not replace a lawyer,
          CPA, or benefits advisor when the package is material or the separation is contentious.
        </p>
      </div>
    </article>
  );
}

function FAQ() {
  return (
    <div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
        Frequently Asked Questions
      </h2>
      <p style={{ color: "var(--ink-light)", marginBottom: 28, fontSize: "0.93rem" }}>
        Answers to common severance questions in the US.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {faqItems.map((faq, index) => (
          <details key={index} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 11, overflow: "hidden" }}>
            <summary
              style={{
                padding: "14px 18px",
                cursor: "pointer",
                fontWeight: 600,
                color: "var(--ink)",
                fontSize: "0.93rem",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
              }}
            >
              <span>{faq.question}</span>
              <span style={{ color: "var(--navy-light)", fontWeight: 700, fontSize: "1rem", flexShrink: 0, marginLeft: 12 }}>
                +
              </span>
            </summary>
            <div style={{ padding: "14px 18px", color: "var(--ink-mid)", fontSize: "0.88rem", lineHeight: 1.7, borderTop: "1px solid var(--border)" }}>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function USSeverancePayCalculatorPage() {
  return (
    <>
      <JsonLd data={serializeJsonLd(buildSchema())} />
      <div className="severance-page">


        <header className="hero-wrap">
          <div className="shell" style={{ position: "relative" }}>
            <nav aria-label="Breadcrumb" style={{ marginBottom: 22 }}>
              <ol className="crumbs">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/finance">Finance</Link>
                </li>
                <li>/</li>
                <li>US Severance Pay Calculator</li>
              </ol>
            </nav>

            <div style={{ maxWidth: 700 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span className="badge badge-green">2026 tax inputs</span>
                <span className="badge badge-dark">
                  <Landmark size={13} />
                  All 50 states
                </span>
                <span className="badge badge-dark">Free</span>
              </div>

              <h1 className="hero-title">
                US Severance Pay Calculator
                <br />
                <span className="hero-title-accent">Estimate Your Net Package</span>
              </h1>
              <p className="hero-copy">
                Calculate base severance, PTO payout, COBRA value, and estimated after-tax take-home with a route built
                for layoffs, negotiated exits, and offer review.
              </p>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {featurePills().map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.label} className="hero-feature">
                      <Icon size={14} />
                      {feature.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="shell">
          <div id="calculator" style={{ paddingTop: 48 }}>
            <div className="calc-layout">
              <div className="calc-sticky">
                <Calculator />
              </div>
              <div>
                <QuickGuide />
              </div>
            </div>
          </div>

          <div id="guide" style={{ paddingTop: 64 }}>
            <EditorialContent />
          </div>

          <div id="faq" style={{ paddingTop: 64, paddingBottom: 56 }}>
            <FAQ />
          </div>

          <div className="related-wrap">
            <RelatedToolsSection
              category="Finance"
              categoryHref="/finance"
              currentPath="/finance/us-severance-pay-calculator"
            />
          </div>
        </main>

        <footer className="no-print severance-footer">
          <div className="shell footer-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>
                <BriefcaseBusiness size={16} />
                FindBest Tools
              </div>
              <p style={{ fontSize: "0.78rem", maxWidth: 360, lineHeight: 1.6 }}>
                Informational estimate only. Review severance agreements with a qualified employment attorney and CPA
                before signing.
              </p>
            </div>
            <div style={{ fontSize: "0.78rem" }}>
              <div style={{ color: "white", fontWeight: 600, marginBottom: 8 }}>Official references</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="https://www.irs.gov/publications/p15" target="_blank" rel="noopener noreferrer">
                  IRS - Supplemental Wages
                </a>
                <a href="https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/cobra" target="_blank" rel="noopener noreferrer">
                  DOL - COBRA Continuation
                </a>
                <a href="https://www.eeoc.gov/statutes/age-discrimination-employment-act-1967" target="_blank" rel="noopener noreferrer">
                  EEOC - ADEA
                </a>
              </div>
            </div>
            <div style={{ fontSize: "0.72rem", alignSelf: "flex-end" }}>
              {new Date().getFullYear()} FindBest Tools
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .severance-page {
          --off-white: #f6f8fc;
          --mist: #eff4fb;
          --border: #d7e0eb;
          --border-dark: #b8c5d7;
          --navy: #0e2040;
          --navy-mid: #244a86;
          --navy-light: #3a74c9;
          --navy-faint: #e8f0ff;
          --green: #0a7c4e;
          --green-faint: #eaf8f2;
          --red: #b42318;
          --amber: #b96b00;
          --amber-faint: #fff6dd;
          --ink: #142133;
          --ink-mid: #44546a;
          --ink-light: #718196;
          --font-body: "Segoe UI", "Helvetica Neue", sans-serif;
          background: var(--off-white);
          color: var(--ink);
        }

        .severance-page,
        .severance-page * {
          box-sizing: border-box;
        }

        .severance-page .shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .severance-page .severance-nav {
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .severance-page .nav-inner {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .severance-page .hero-wrap {
          background: linear-gradient(160deg, #0e2040 0%, #1b3a6e 60%, #2a4e8c 100%);
          padding: 48px 0 62px;
          position: relative;
          overflow: hidden;
        }

        .severance-page .hero-wrap::after {
          content: "";
          position: absolute;
          top: -140px;
          right: -80px;
          width: 440px;
          height: 440px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(110, 159, 245, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .severance-page .crumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.8rem;
        }

        .severance-page .crumbs a {
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
        }

        .severance-page .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.73rem;
          font-weight: 700;
        }

        .severance-page .badge-green {
          background: #d9f5e8;
          color: #0d6b46;
        }

        .severance-page .badge-dark {
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.8);
        }

        .severance-page .hero-title {
          font-size: clamp(2rem, 4.4vw, 3.2rem);
          font-weight: 800;
          color: white;
          line-height: 1.12;
          margin: 0 0 18px;
        }

        .severance-page .hero-title-accent {
          background: linear-gradient(135deg, #7bb3ff 0%, #b7d5ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .severance-page .hero-copy {
          color: rgba(255, 255, 255, 0.74);
          font-size: 1.03rem;
          line-height: 1.72;
          margin: 0 0 24px;
          max-width: 560px;
        }

        .severance-page .hero-feature {
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.84rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .severance-page .calc-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
          gap: 40px;
          align-items: start;
        }

        .severance-page .calc-sticky {
          position: sticky;
          top: 88px;
        }

        .severance-page .card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(14, 32, 64, 0.08);
        }

        .severance-page .input-field {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: white;
          padding: 0 14px;
          font-size: 0.9rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .severance-page .input-field:focus {
          border-color: var(--navy-light);
          box-shadow: 0 0 0 3px rgba(58, 116, 201, 0.12);
        }

        .severance-page .seg-btn {
          flex: 1;
          min-width: 0;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--ink-mid);
          font-weight: 600;
          padding: 10px 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.16s ease;
        }

        .severance-page .seg-btn.active {
          background: white;
          color: var(--navy);
          box-shadow: 0 2px 10px rgba(14, 32, 64, 0.08);
        }

        .severance-page .result-card {
          background: linear-gradient(160deg, #fff 0%, #f3f7fd 100%);
          border: 1.5px solid var(--border);
          border-radius: 16px;
        }

        .severance-page .result-label,
        .severance-page .mini-kicker {
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-light);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .severance-page .mini-kicker {
          font-size: 0.64rem;
          margin-bottom: 3px;
        }

        .severance-page .text-navy-gradient {
          background: linear-gradient(135deg, #10284d 0%, #3a74c9 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .severance-page .text-green-gradient {
          background: linear-gradient(135deg, #0a7c4e 0%, #3cb27d 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .severance-page .animate-fade-in {
          animation: severance-fade 0.28s ease;
        }

        .severance-page .rate-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .severance-page .rate-table thead th {
          background: var(--mist);
          color: var(--ink-mid);
          text-align: left;
          padding: 10px 12px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .severance-page .rate-table td {
          padding: 10px 12px;
          border-top: 1px solid var(--border);
          color: var(--ink-mid);
        }

        .severance-page .section-mini-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .severance-page .icon-chip {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: var(--mist);
          color: var(--navy);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .severance-page .icon-chip-dark {
          background: rgba(255, 255, 255, 0.16);
          color: white;
        }

        .severance-page .empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: var(--mist);
          color: var(--navy);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .severance-page .guide-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.72);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .severance-page .prose {
          color: var(--ink-mid);
          font-size: 0.94rem;
          line-height: 1.78;
        }

        .severance-page .prose h2 {
          color: var(--ink);
          font-size: 1.8rem;
          line-height: 1.2;
          margin: 0 0 14px;
        }

        .severance-page .prose h3 {
          color: var(--ink);
          font-size: 1.08rem;
          margin: 22px 0 10px;
        }

        .severance-page .prose p,
        .severance-page .prose ul,
        .severance-page .prose blockquote {
          margin: 0 0 16px;
        }

        .severance-page .prose ul {
          padding-left: 20px;
        }

        .severance-page .prose li {
          margin-bottom: 8px;
        }

        .severance-page .prose a {
          color: var(--navy-light);
        }

        .severance-page .prose blockquote {
          background: white;
          border-left: 4px solid var(--navy-light);
          padding: 14px 16px;
          border-radius: 0 12px 12px 0;
        }

        .severance-page .timeline-item {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }

        .severance-page .related-wrap {
          border-top: 1px solid var(--border);
          margin-top: 40px;
          padding-top: 32px;
          padding-bottom: 24px;
        }

        .severance-page .severance-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: var(--navy);
          color: rgba(255, 255, 255, 0.5);
          padding: 36px 0;
        }

        .severance-page .severance-footer a {
          color: rgba(255, 255, 255, 0.54);
          text-decoration: none;
        }

        .severance-page .footer-grid {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .severance-page details summary::-webkit-details-marker {
          display: none;
        }

        @keyframes severance-fade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .severance-page .calc-layout {
            grid-template-columns: 1fr;
          }

          .severance-page .calc-sticky {
            position: static;
          }

          .severance-page .nav-inner {
            height: auto;
            padding: 14px 0;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .severance-page .shell {
            padding: 0 16px;
          }

          .severance-page .hero-wrap {
            padding: 36px 0 46px;
          }
        }
      `}</style>
    </>
  );
}
