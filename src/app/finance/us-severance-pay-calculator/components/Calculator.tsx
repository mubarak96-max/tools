"use client";

import type { CSSProperties } from "react";
import { useState, useCallback, useEffect } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock3,
  CopyCheck,
  DollarSign,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  Lock,
  Package,
  Printer,
  Receipt,
  Scale,
  Settings2,
  TrendingUp,
  FileText,
} from "lucide-react";

import {
  calculateSeverance,
  formatUSD,
  parseNumber,
  STATE_TAX_RATES,
  FORMULA_OPTIONS,
  FILING_OPTIONS,
  COBRA_MONTHLY,
  type SeveranceInputs,
  type SeveranceResult,
} from "../lib/severance";

const DEFAULT_INPUTS: SeveranceInputs = {
  payType: "salary",
  annualSalary: 0,
  hourlyRate: 0,
  hoursPerWeek: 40,
  yearsOfService: 0,
  formula: "two_weeks_per_year",
  customWeeks: 0,
  unpaidPtoHours: 0,
  unpaidPtoDays: 0,
  cobraMonths: 0,
  signingBonusForfeited: 0,
  bonusProRata: 0,
  filingStatus: "single",
  otherAnnualIncome: 0,
  stateCode: "CA",
};

const STATES = Object.entries(STATE_TAX_RATES)
  .map(([code, info]) => ({ code, name: info.name, hasNoTax: info.hasNoTax }))
  .sort((a, b) => a.name.localeCompare(b.name));

const LABEL_STYLE: CSSProperties = {
  display: "block",
  fontSize: "0.76rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--ink-light)",
  marginBottom: 6,
};

const ACTION_BUTTON: CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.5px solid var(--border)",
  background: "white",
  cursor: "pointer",
  fontSize: "0.79rem",
  fontWeight: 600,
  color: "var(--ink-mid)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

function Radio({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        width: 17,
        height: 17,
        borderRadius: "50%",
        border: `2px solid ${selected ? "var(--navy-light)" : "var(--border-dark)"}`,
        background: selected ? "var(--navy)" : "transparent",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: "white" }} /> : null}
    </div>
  );
}

function Field({
  label,
  prefix,
  suffix,
  id,
  value,
  placeholder,
  onChange,
  noMargin,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  id: string;
  value: number;
  placeholder: string;
  onChange: (value: string) => void;
  noMargin?: boolean;
}) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 14 }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix ? (
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--green)",
              fontWeight: 700,
              pointerEvents: "none",
            }}
          >
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className="input-field"
          style={{ paddingLeft: prefix ? 28 : 14, paddingRight: suffix ? 44 : 14 }}
          placeholder={placeholder}
          value={value === 0 ? "" : value.toLocaleString("en-US")}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-light)",
              fontSize: "0.78rem",
              pointerEvents: "none",
            }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function NegotiationTips() {
  const tips = [
    {
      icon: CalendarDays,
      title: "Do not sign immediately",
      body: "Workers 40+ have 21 days to review ADEA waivers and then a 7-day revocation window. Use the time.",
    },
    {
      icon: Scale,
      title: "Negotiate the multiplier",
      body: "If the first offer is 1 week per year, counter at 2. Senior roles can justify 1 month per year.",
    },
    {
      icon: HeartPulse,
      title: "COBRA subsidy has real value",
      body: `Three employer-paid months of individual COBRA is worth about ${formatUSD(COBRA_MONTHLY.individual * 3)}.`,
    },
    {
      icon: TrendingUp,
      title: "Push on equity acceleration",
      body: "Acceleration of RSUs or options can be worth more than the cash severance itself at growth-stage companies.",
    },
    {
      icon: Lock,
      title: "Review restrictive covenants",
      body: "Ask to narrow the scope or duration of non-competes and non-solicits before you sign the release.",
    },
    {
      icon: FileText,
      title: "Get the reference in writing",
      body: "A written reference commitment is more durable than a verbal promise from a departing manager.",
    },
    {
      icon: GraduationCap,
      title: "Ask for outplacement",
      body: "Executive career coaching and resume support can be a high-value add even when cash is fixed.",
    },
    {
      icon: BriefcaseBusiness,
      title: "File unemployment promptly",
      body: "Some states offset benefits for severance and some do not. File immediately and let the agency decide.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tips.map((tip) => {
        const Icon = tip.icon;

        return (
          <div
            key={tip.title}
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 12px",
              background: "var(--mist)",
              borderRadius: 9,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--navy)",
              }}
            >
              <Icon size={16} />
            </div>
            <div>
              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>
                {tip.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>{tip.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Calculator() {
  const [inputs, setInputs] = useState<SeveranceInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [tab, setTab] = useState<"results" | "details" | "tips">("results");
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const setField = (key: keyof SeveranceInputs, value: SeveranceInputs[keyof SeveranceInputs]) => {
    setInputs((previous) => ({ ...previous, [key]: value }));
  };

  const hasIncome = inputs.payType === "salary" ? inputs.annualSalary > 0 : inputs.hourlyRate > 0;

  const calculate = useCallback(() => {
    if (hasIncome && inputs.yearsOfService > 0) {
      setResult(calculateSeverance(inputs));
      setAnimKey((previous) => previous + 1);
      return;
    }

    setResult(null);
  }, [inputs, hasIncome]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const copyResult = () => {
    if (!result) {
      return;
    }

    const lines = [
      "US Severance Pay Estimate",
      "-".repeat(32),
      ...result.breakdown.map((item) => `${item.sign} ${item.label}: ${formatUSD(item.amount)}`),
      "-".repeat(32),
      `Gross Package: ${formatUSD(result.totalPackageGross)}`,
      `Est. Net Take-Home: ${formatUSD(result.totalPackageNet)}`,
      `Effective Tax Rate: ${result.effectiveTaxRate}`,
      "",
      "Calculated at findbest.tools/finance/us-severance-pay-calculator",
    ];

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2_000);
    });
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #0e2040 0%, #1b3a6e 100%)", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div className="icon-chip icon-chip-dark">
              <BriefcaseBusiness size={16} />
            </div>
            <h2 style={{ fontSize: "1.1rem", color: "white", fontWeight: 700 }}>Severance Pay Calculator</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "0.75rem" }}>
            2024 federal plus state tax assumptions across all 50 states
          </p>
        </div>

        <div style={{ padding: "22px" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={LABEL_STYLE}>Pay Type</label>
            <div style={{ display: "flex", gap: 4, background: "var(--mist)", padding: 4, borderRadius: 9 }}>
              {([
                { value: "salary" as const, label: "Annual Salary", icon: DollarSign },
                { value: "hourly" as const, label: "Hourly Rate", icon: Clock3 },
              ]).map((payType) => {
                const Icon = payType.icon;

                return (
                  <button
                    key={payType.value}
                    onClick={() => setField("payType", payType.value)}
                    className={`seg-btn${inputs.payType === payType.value ? " active" : ""}`}
                  >
                    <Icon size={15} />
                    {payType.label}
                  </button>
                );
              })}
            </div>
          </div>

          {inputs.payType === "salary" ? (
            <Field
              label="Annual Salary"
              prefix="$"
              id="salary"
              value={inputs.annualSalary}
              placeholder="e.g. 95,000"
              onChange={(value) => setField("annualSalary", parseNumber(value))}
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <Field
                label="Hourly Rate"
                prefix="$"
                id="hourly"
                value={inputs.hourlyRate}
                placeholder="e.g. 45"
                onChange={(value) => setField("hourlyRate", parseNumber(value))}
                noMargin
              />
              <Field
                label="Hours/Week"
                id="hours"
                value={inputs.hoursPerWeek}
                placeholder="40"
                suffix="hrs"
                onChange={(value) => setField("hoursPerWeek", parseNumber(value))}
                noMargin
              />
            </div>
          )}

          <Field
            label="Years of Service"
            id="years"
            value={inputs.yearsOfService}
            placeholder="e.g. 5"
            suffix="yrs"
            onChange={(value) => setField("yearsOfService", parseNumber(value))}
          />

          <div style={{ marginBottom: 18 }}>
            <label style={LABEL_STYLE}>Severance Formula</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {FORMULA_OPTIONS.map((formula) => (
                <button
                  key={formula.value}
                  onClick={() => setField("formula", formula.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${inputs.formula === formula.value ? "var(--navy-light)" : "var(--border)"}`,
                    background: inputs.formula === formula.value ? "var(--navy-faint)" : "white",
                    cursor: "pointer",
                    transition: "all 0.18s",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: inputs.formula === formula.value ? "var(--navy)" : "var(--ink)",
                      }}
                    >
                      {formula.label}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--ink-light)" }}>{formula.sub}</div>
                  </div>
                  <Radio selected={inputs.formula === formula.value} />
                </button>
              ))}
            </div>
            {inputs.formula === "custom" ? (
              <div style={{ marginTop: 8 }}>
                <Field
                  label="Total Severance Weeks"
                  id="customWeeks"
                  value={inputs.customWeeks}
                  placeholder="e.g. 12"
                  suffix="wks"
                  onChange={(value) => setField("customWeeks", parseNumber(value))}
                />
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setShowAdvanced((current) => !current)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "var(--mist)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--ink-mid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: showAdvanced ? 16 : 24,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Settings2 size={16} />
              Package Items and Tax Settings
            </span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced ? (
            <div style={{ marginBottom: 20 }}>
              <div style={{ background: "var(--mist)", borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                <div className="section-mini-title">
                  <Package size={15} />
                  Additional Package Components
                </div>
                <Field
                  label="Unused PTO Hours"
                  id="pto"
                  value={inputs.unpaidPtoHours}
                  placeholder="e.g. 80"
                  suffix="hrs"
                  onChange={(value) => setField("unpaidPtoHours", parseNumber(value))}
                />
                <Field
                  label="COBRA Months (Employer-Paid)"
                  id="cobra"
                  value={inputs.cobraMonths}
                  placeholder="e.g. 3"
                  suffix="mo"
                  onChange={(value) => setField("cobraMonths", parseNumber(value))}
                />
                <Field
                  label="Pro-Rata Bonus"
                  prefix="$"
                  id="bonus"
                  value={inputs.bonusProRata}
                  placeholder="e.g. 5,000"
                  onChange={(value) => setField("bonusProRata", parseNumber(value))}
                />
                <Field
                  label="Signing Bonus Clawback"
                  prefix="$"
                  id="clawback"
                  value={inputs.signingBonusForfeited}
                  placeholder="e.g. 0"
                  onChange={(value) => setField("signingBonusForfeited", parseNumber(value))}
                />
              </div>

              <div style={{ background: "var(--mist)", borderRadius: 10, padding: "16px" }}>
                <div className="section-mini-title">
                  <Receipt size={15} />
                  Tax Settings
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={LABEL_STYLE}>Filing Status</label>
                  <select
                    className="input-field"
                    value={inputs.filingStatus}
                    onChange={(event) => setField("filingStatus", event.target.value as SeveranceInputs["filingStatus"])}
                    style={{ cursor: "pointer" }}
                  >
                    {FILING_OPTIONS.map((filingOption) => (
                      <option key={filingOption.value} value={filingOption.value}>
                        {filingOption.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={LABEL_STYLE}>State</label>
                  <select
                    className="input-field"
                    value={inputs.stateCode}
                    onChange={(event) => setField("stateCode", event.target.value as SeveranceInputs["stateCode"])}
                    style={{ cursor: "pointer" }}
                  >
                    {STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                        {state.hasNoTax ? " (no income tax)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Other Annual Income (YTD Salary Etc.)"
                  prefix="$"
                  id="otherincome"
                  value={inputs.otherAnnualIncome}
                  placeholder="e.g. 60,000"
                  onChange={(value) => setField("otherAnnualIncome", parseNumber(value))}
                />
              </div>
            </div>
          ) : null}

          {result ? (
            <div key={animKey} className="animate-fade-in">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div className="result-card" style={{ padding: "14px 16px" }}>
                  <div className="result-label">Gross Package</div>
                  <div className="text-navy-gradient" style={{ fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>
                    {formatUSD(result.totalPackageGross)}
                  </div>
                  <div style={{ fontSize: "0.69rem", color: "var(--ink-light)", marginTop: 4 }}>
                    {result.severanceWeeks.toFixed(1)} weeks severance
                  </div>
                </div>
                <div
                  style={{
                    padding: "14px 16px",
                    background: "linear-gradient(160deg, #fff 0%, var(--green-faint) 100%)",
                    border: "1.5px solid rgba(10,124,78,0.2)",
                    borderRadius: 16,
                  }}
                >
                  <div className="result-label">Est. Net Take-Home</div>
                  <div className="text-green-gradient" style={{ fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>
                    {formatUSD(result.totalPackageNet)}
                  </div>
                  <div style={{ fontSize: "0.69rem", color: "var(--ink-light)", marginTop: 4 }}>
                    after about {result.effectiveTaxRate} taxes
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }}>
                {[
                  { label: "Federal Tax", value: result.federalTaxEstimate, color: "var(--red)" },
                  { label: "State Tax", value: result.stateTaxEstimate, color: "var(--amber)" },
                  { label: "FICA", value: result.ficaEstimate, color: "var(--navy-light)" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ background: "var(--mist)", borderRadius: 8, padding: "9px 10px", textAlign: "center" }}
                  >
                    <div className="mini-kicker">{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.86rem", color: item.color }}>{formatUSD(item.value)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 3, background: "var(--mist)", padding: 3, borderRadius: 8, marginBottom: 12 }}>
                {([
                  { value: "results" as const, label: "Breakdown", icon: BarChart3 },
                  { value: "details" as const, label: "Tax Detail", icon: Receipt },
                  { value: "tips" as const, label: "Tips", icon: Lightbulb },
                ]).map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.value}
                      onClick={() => setTab(item.value)}
                      className={`seg-btn${tab === item.value ? " active" : ""}`}
                      style={{ fontSize: "0.76rem" }}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {tab === "results" ? (
                <div className="stagger">
                  {result.breakdown.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "10px 12px",
                        background: "white",
                        borderRadius: 9,
                        border: `1px solid ${item.sign === "+" ? "var(--border)" : "#fee2e2"}`,
                        marginBottom: 6,
                        gap: 10,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "0.71rem", color: "var(--ink-light)", lineHeight: 1.4 }}>{item.note}</div>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: item.sign === "+" ? "var(--green)" : "var(--red)",
                          flexShrink: 0,
                        }}
                      >
                        {item.sign}
                        {formatUSD(item.amount)}
                      </div>
                    </div>
                  ))}
                  {result.notes.length > 0 ? (
                    <div
                      style={{
                        background: "var(--navy-faint)",
                        border: "1px solid #bfdbfe",
                        borderRadius: 9,
                        padding: "11px 13px",
                        marginTop: 8,
                      }}
                    >
                      <div className="section-mini-title" style={{ color: "var(--navy)", marginBottom: 8 }}>
                        <Lightbulb size={15} />
                        Notes
                      </div>
                      {result.notes.map((note, index) => (
                        <div
                          key={index}
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--navy-mid)",
                            marginBottom: 4,
                            paddingLeft: 10,
                            borderLeft: "2px solid var(--navy-light)",
                          }}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {tab === "details" ? (
                <div>
                  <div style={{ overflowX: "auto", marginBottom: 14 }}>
                    <table className="rate-table" style={{ fontSize: "0.83rem" }}>
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Weekly Pay</td>
                          <td>{formatUSD(result.weeklyPay)}</td>
                        </tr>
                        <tr>
                          <td>Severance Weeks</td>
                          <td>{result.severanceWeeks.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Base Severance</td>
                          <td>{formatUSD(result.baseSeverance)}</td>
                        </tr>
                        <tr>
                          <td>PTO Payout</td>
                          <td>{formatUSD(result.ptoPayout)}</td>
                        </tr>
                        <tr>
                          <td>Pro-Rata Bonus</td>
                          <td>{formatUSD(result.bonusProRata)}</td>
                        </tr>
                        <tr>
                          <td>COBRA Value</td>
                          <td>{formatUSD(result.cobraCost)}</td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--red)" }}>- Federal Tax</td>
                          <td style={{ color: "var(--red)" }}>{formatUSD(result.federalTaxEstimate)}</td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--red)" }}>- State Tax</td>
                          <td style={{ color: "var(--red)" }}>{formatUSD(result.stateTaxEstimate)}</td>
                        </tr>
                        <tr>
                          <td style={{ color: "var(--red)" }}>- FICA</td>
                          <td style={{ color: "var(--red)" }}>{formatUSD(result.ficaEstimate)}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700 }}>Net Severance</td>
                          <td style={{ fontWeight: 700, color: "var(--green)" }}>{formatUSD(result.netSeverance)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      background: "var(--amber-faint)",
                      borderRadius: 9,
                      padding: "11px 13px",
                      fontSize: "0.76rem",
                      color: "var(--amber)",
                      lineHeight: 1.6,
                      border: "1px solid #fde68a",
                    }}
                  >
                    This tool uses 2024 IRS brackets and simplified state rates. Actual withholding and tax due may differ materially.
                  </div>
                </div>
              ) : null}

              {tab === "tips" ? <NegotiationTips /> : null}

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={copyResult} className="no-print" style={ACTION_BUTTON}>
                  {copied ? <CopyCheck size={15} /> : <Clipboard size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button onClick={() => window.print()} className="no-print" style={ACTION_BUTTON}>
                  <Printer size={15} />
                  Print
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "28px 16px", color: "var(--ink-light)", fontSize: "0.88rem" }}>
              <div className="empty-icon">
                <BriefcaseBusiness size={24} />
              </div>
              Enter your salary and years of service to estimate your severance package.
            </div>
          )}
        </div>
      </div>

      <p style={{ marginTop: 10, fontSize: "0.68rem", color: "var(--ink-light)", textAlign: "center", lineHeight: 1.5 }}>
        Estimate only. Consult an employment attorney and CPA before signing a severance agreement.
      </p>
    </div>
  );
}
