"use client";

import { useMemo, useState } from "react";
import {
  BadgePoundSterling,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardList,
  Flag,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

const POUND = "\u00A3";
const WEEKLY_PAY_CAP_2026 = 751;
const MAX_SERVICE_YEARS = 20;
const TAX_FREE_THRESHOLD = 30_000;
const BASIC_RATE_BAND = 50_270;
const ADDITIONAL_RATE_BAND = 125_140;
const INCOME_TAX_BASIC = 0.2;
const INCOME_TAX_HIGHER = 0.4;
const INCOME_TAX_ADDITIONAL = 0.45;

type ActiveTab = "breakdown" | "notice" | "tax";

type BandBreakdown = {
  ageLabel: string;
  years: number;
  multiplier: number;
  weeks: number;
};

function money(value: number, digits = 0) {
  if (!Number.isFinite(value) || value === 0) {
    return `${POUND}0`;
  }

  return `${POUND}${Math.abs(value).toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

function weeksLabel(value: number) {
  return value === 1 ? "1 week" : `${value} weeks`;
}

function minimumNoticePeriod(years: number) {
  if (years < 1) {
    return 0;
  }
  if (years >= 12) {
    return 12;
  }
  return Math.floor(years);
}

function calcStatutoryRedundancy(age: number, yearsService: number, weeklyPay: number) {
  const cappedWeeklyPay = Math.min(weeklyPay, WEEKLY_PAY_CAP_2026);
  const years = Math.min(yearsService, MAX_SERVICE_YEARS);
  const bandBreakdown: BandBreakdown[] = [];
  let weeks = 0;

  for (let year = 1; year <= years; year += 1) {
    const ageAtYear = age - year + 1;
    if (ageAtYear < 22) {
      weeks += 0.5;
    } else if (ageAtYear <= 40) {
      weeks += 1;
    } else {
      weeks += 1.5;
    }
  }

  let remaining = years;
  let ageCursor = age;

  while (remaining > 0) {
    if (ageCursor >= 41) {
      const yearsInBand = Math.min(remaining, ageCursor - 40);
      if (yearsInBand > 0) {
        bandBreakdown.unshift({
          ageLabel: "41+",
          years: yearsInBand,
          multiplier: 1.5,
          weeks: yearsInBand * 1.5,
        });
        remaining -= yearsInBand;
        ageCursor = 40;
        continue;
      }
    }

    if (ageCursor >= 22) {
      const yearsInBand = Math.min(remaining, ageCursor - 21);
      if (yearsInBand > 0) {
        bandBreakdown.unshift({
          ageLabel: "22-40",
          years: yearsInBand,
          multiplier: 1,
          weeks: yearsInBand,
        });
        remaining -= yearsInBand;
        ageCursor = 21;
        continue;
      }
    }

    bandBreakdown.unshift({
      ageLabel: "Under 22",
      years: remaining,
      multiplier: 0.5,
      weeks: remaining * 0.5,
    });
    remaining = 0;
  }

  return { weeks, pay: weeks * cappedWeeklyPay, cappedWeeklyPay, bandBreakdown };
}

function estimateTaxOn(amount: number, baseIncome: number) {
  let tax = 0;
  let remaining = amount;
  let base = baseIncome;

  if (base < BASIC_RATE_BAND && remaining > 0) {
    const basicRoom = Math.min(remaining, BASIC_RATE_BAND - base);
    tax += basicRoom * INCOME_TAX_BASIC;
    remaining -= basicRoom;
    base += basicRoom;
  }

  if (base < ADDITIONAL_RATE_BAND && remaining > 0) {
    const higherRoom = Math.min(remaining, ADDITIONAL_RATE_BAND - base);
    tax += higherRoom * INCOME_TAX_HIGHER;
    remaining -= higherRoom;
    base += higherRoom;
  }

  if (remaining > 0) {
    tax += remaining * INCOME_TAX_ADDITIONAL;
  }

  return tax;
}

export default function UkSeveranceCalculatorClient() {
  const [age, setAge] = useState("38");
  const [yearsService, setYearsService] = useState("7");
  const [annualSalary, setAnnualSalary] = useState("45000");
  const [contractNotice, setContractNotice] = useState("4");
  const [hasPilon, setHasPilon] = useState(false);
  const [enhancedWeeks, setEnhancedWeeks] = useState("0");
  const [otherPayments, setOtherPayments] = useState("0");
  const [holidayDays, setHolidayDays] = useState("0");
  const [activeTab, setActiveTab] = useState<ActiveTab>("breakdown");

  const calc = useMemo(() => {
    const ageValue = Number.parseFloat(age) || 0;
    const yearsValue = Number.parseFloat(yearsService) || 0;
    const salaryValue = Number.parseFloat(annualSalary) || 0;
    const weeklyPay = salaryValue / 52;
    const dailyPay = salaryValue / 260;
    const srp = calcStatutoryRedundancy(ageValue, yearsValue, weeklyPay);
    const minimumNotice = minimumNoticePeriod(yearsValue);
    const contractualNotice = Number.parseFloat(contractNotice) || 0;
    const effectiveNotice = Math.max(minimumNotice, contractualNotice);
    const noticePay = effectiveNotice * weeklyPay;
    const enhancedWeeksValue = Number.parseFloat(enhancedWeeks) || 0;
    const enhancedPay = enhancedWeeksValue * Math.min(weeklyPay, WEEKLY_PAY_CAP_2026);
    const holidayPay = (Number.parseFloat(holidayDays) || 0) * dailyPay;
    const exGratia = Number.parseFloat(otherPayments) || 0;
    const redundancyPayment = srp.pay + enhancedPay;
    const taxableRedundancy = Math.max(0, redundancyPayment - TAX_FREE_THRESHOLD);
    const taxableEarnings = (hasPilon ? noticePay : 0) + holidayPay + exGratia;
    const totalGross = redundancyPayment + noticePay + holidayPay + exGratia;
    const taxOnRedundancy = estimateTaxOn(taxableRedundancy, salaryValue);
    const taxOnEarnings = estimateTaxOn(taxableEarnings, salaryValue + taxableRedundancy);
    const totalEstimatedTax = taxOnRedundancy + taxOnEarnings;
    const netPay = totalGross - totalEstimatedTax;
    const effectiveRate = totalGross > 0 ? (totalEstimatedTax / totalGross) * 100 : 0;

    return {
      weeklyPay,
      srp,
      minimumNotice,
      effectiveNotice,
      noticePay,
      enhancedWeeksValue,
      enhancedPay,
      holidayPay,
      exGratia,
      redundancyPayment,
      taxableRedundancy,
      taxableEarnings,
      totalGross,
      taxOnRedundancy,
      taxOnEarnings,
      totalEstimatedTax,
      netPay,
      effectiveRate,
    };
  }, [age, yearsService, annualSalary, contractNotice, hasPilon, enhancedWeeks, otherPayments, holidayDays]);

  return (
    <>
      <div className="uksev-page">
        <div className="uksev-shell">
          <header className="uksev-hero">
            <div className="hero-kicker"><Flag size={14} />United Kingdom · current post-6 April 2026 statutory cap</div>
            <h1>UK Severance Pay <em>Calculator</em></h1>
            <p className="hero-copy">
              Estimate statutory redundancy pay, notice entitlement, and approximate net proceeds
              using the current GOV.UK statutory redundancy cap and standard UK tax treatment.
            </p>
            <div className="hero-stats">
              <div className="hero-chip"><BadgePoundSterling size={14} />Weekly cap {money(WEEKLY_PAY_CAP_2026)}</div>
              <div className="hero-chip"><ShieldCheck size={14} />{POUND}30,000 tax-free threshold</div>
              <div className="hero-chip"><ClipboardList size={14} />20-year service cap</div>
            </div>
          </header>

          <div className="uksev-layout">
            <aside className="uksev-inputs">
              <div className="panel-head"><BriefcaseBusiness size={16} /><span>Your employment details</span></div>
              <div className="panel-body">
                <div className="section-label">Age and service</div>
                <div className="field"><label>Age at redundancy</label><input value={age} onChange={(event) => setAge(event.target.value)} /></div>
                <div className="field"><label>Complete years of service</label><input value={yearsService} onChange={(event) => setYearsService(event.target.value)} /></div>

                <div className="section-label">Salary</div>
                <div className="field">
                  <label>Annual gross salary</label>
                  <input value={annualSalary} onChange={(event) => setAnnualSalary(event.target.value)} />
                  <div className="subtle-line">Weekly pay {money(calc.weeklyPay, 2)} · statutory cap {money(WEEKLY_PAY_CAP_2026)}</div>
                </div>

                <div className="section-label">Notice period</div>
                <div className="field">
                  <label>Contractual notice (weeks)</label>
                  <input value={contractNotice} onChange={(event) => setContractNotice(event.target.value)} />
                  <div className="subtle-line">Statutory minimum {weeksLabel(calc.minimumNotice)} · effective {weeksLabel(calc.effectiveNotice)}</div>
                </div>
                <button type="button" className={`toggle-btn ${hasPilon ? "on" : ""}`} onClick={() => setHasPilon((previous) => !previous)}>
                  <span />
                  Payment in lieu of notice (PILON)
                </button>

                <div className="section-label">Enhancements and extras</div>
                <div className="field"><label>Enhanced redundancy (additional weeks)</label><input value={enhancedWeeks} onChange={(event) => setEnhancedWeeks(event.target.value)} /></div>
                <div className="field-grid">
                  <div className="field"><label>Holiday owed (days)</label><input value={holidayDays} onChange={(event) => setHolidayDays(event.target.value)} /></div>
                  <div className="field"><label>Other / ex-gratia</label><input value={otherPayments} onChange={(event) => setOtherPayments(event.target.value)} /></div>
                </div>
              </div>
            </aside>

            <div className="uksev-results">
              <section className="statement">
                <div className="statement-head">
                  <div>
                    <div className="statement-title">Redundancy pay statement</div>
                    <div className="statement-sub">Current statutory cap and standard UK tax treatment</div>
                  </div>
                  <div className="statement-total">
                    <div className="mini-label">Estimated gross package</div>
                    <div className="big-value">{money(calc.totalGross)}</div>
                    <div className="mini-sub">About {money(calc.netPay)} after estimated income tax</div>
                  </div>
                </div>

                <div className="receipt-grid">
                  <div className="receipt-col">
                    <div className="receipt-title">Statutory redundancy</div>
                    {calc.srp.bandBreakdown.map((band) => (
                      <div key={`${band.ageLabel}-${band.years}`} className="receipt-row">
                        <span>{band.years}yr × {band.multiplier} ({band.ageLabel})</span>
                        <span>{band.weeks.toFixed(1)} wks</span>
                      </div>
                    ))}
                    <div className="receipt-row"><span>Weekly pay used</span><span>{money(calc.srp.cappedWeeklyPay)}</span></div>
                    {calc.enhancedPay > 0 ? <div className="receipt-row"><span>Enhanced redundancy</span><span>{money(calc.enhancedPay)}</span></div> : null}
                    <div className="receipt-total"><span>Redundancy total</span><span>{money(calc.redundancyPayment)}</span></div>
                  </div>

                  <div className="receipt-col">
                    <div className="receipt-title">Notice and extras</div>
                    <div className="receipt-row"><span>Notice pay ({weeksLabel(calc.effectiveNotice)})</span><span>{money(calc.noticePay)}</span></div>
                    <div className="receipt-row"><span>PILON treatment</span><span>{hasPilon ? "Taxable" : "Worked / garden leave"}</span></div>
                    <div className="receipt-row"><span>Holiday pay</span><span>{calc.holidayPay > 0 ? money(calc.holidayPay) : `${POUND}0`}</span></div>
                    <div className="receipt-row"><span>Ex-gratia / other</span><span>{calc.exGratia > 0 ? money(calc.exGratia) : `${POUND}0`}</span></div>
                    <div className="receipt-total"><span>Notice total</span><span>{money(calc.noticePay + calc.holidayPay + calc.exGratia)}</span></div>
                  </div>

                  <div className="receipt-col">
                    <div className="receipt-title">Tax treatment</div>
                    <div className="receipt-row"><span>Tax-free redundancy allowance</span><span>{money(TAX_FREE_THRESHOLD)}</span></div>
                    <div className="receipt-row"><span>Taxable redundancy</span><span>{calc.taxableRedundancy > 0 ? money(calc.taxableRedundancy) : "Nil"}</span></div>
                    <div className="receipt-row"><span>Tax on redundancy</span><span>{calc.taxOnRedundancy > 0 ? money(calc.taxOnRedundancy) : "Nil"}</span></div>
                    <div className="receipt-row"><span>Tax on notice / other</span><span>{money(calc.taxOnEarnings)}</span></div>
                    <div className="receipt-total tax"><span>Estimated tax total</span><span>{money(calc.totalEstimatedTax)}</span></div>
                  </div>
                </div>

                <div className="statement-foot">
                  <div><div className="mini-label">Estimated net payment</div><div className="foot-value">{money(calc.netPay)}</div></div>
                  <div><div className="mini-label">Effective tax rate</div><div className="foot-value">{calc.effectiveRate.toFixed(1)}%</div></div>
                  <div className={`foot-pill ${calc.redundancyPayment <= TAX_FREE_THRESHOLD ? "ok" : "warn"}`}>
                    {calc.redundancyPayment <= TAX_FREE_THRESHOLD ? `Full ${POUND}30,000 tax-free redundancy allowance available` : `Above tax-free threshold by ${money(calc.redundancyPayment - TAX_FREE_THRESHOLD)}`}
                  </div>
                </div>
              </section>

              <section className="detail-card">
                <div className="tab-row">
                  {[
                    { value: "breakdown" as const, label: "Statutory SRP" },
                    { value: "notice" as const, label: "Notice rights" },
                    { value: "tax" as const, label: "Tax details" },
                  ].map((tab) => (
                    <button type="button" key={tab.value} className={`tab-btn ${activeTab === tab.value ? "active" : ""}`} onClick={() => setActiveTab(tab.value)}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "breakdown" ? (
                  <div>
                    <div className="info-box">Uses the age-weighted statutory redundancy formula, a 20-year service cap, and the current statutory weekly pay limit of {money(WEEKLY_PAY_CAP_2026)}.</div>
                    {calc.srp.bandBreakdown.map((band) => (
                      <div key={`${band.ageLabel}-${band.years}-detail`} className="summary-row">
                        <span>{band.ageLabel} · {band.years} years · ×{band.multiplier}</span>
                        <span>{money(band.weeks * calc.srp.cappedWeeklyPay)}</span>
                      </div>
                    ))}
                    <div className="receipt-total"><span>Statutory redundancy pay</span><span>{money(calc.srp.pay)}</span></div>
                  </div>
                ) : null}

                {activeTab === "notice" ? (
                  <div>
                    <div className="info-box">UK employees are generally entitled to the higher of statutory minimum notice and contractual notice.</div>
                    {[
                      { label: "Statutory minimum notice", value: weeksLabel(calc.minimumNotice) },
                      { label: "Contractual notice", value: weeksLabel(Number.parseFloat(contractNotice) || 0) },
                      { label: "Effective notice", value: weeksLabel(calc.effectiveNotice) },
                      { label: "Notice pay", value: money(calc.noticePay) },
                      { label: "PILON treatment", value: hasPilon ? "Taxable lump sum" : "Worked / garden leave" },
                    ].map((row) => (
                      <div key={row.label} className="summary-row"><span>{row.label}</span><span>{row.value}</span></div>
                    ))}
                  </div>
                ) : null}

                {activeTab === "tax" ? (
                  <div>
                    <div className="info-box">Genuine redundancy payments can use the {POUND}30,000 tax-free threshold. Notice pay, holiday pay, and similar earnings remain taxable.</div>
                    {[
                      { label: "Redundancy payment", value: money(calc.redundancyPayment) },
                      { label: "Tax-free threshold", value: money(TAX_FREE_THRESHOLD) },
                      { label: "Taxable redundancy", value: calc.taxableRedundancy > 0 ? money(calc.taxableRedundancy) : "Nil" },
                      { label: "Taxable notice / other earnings", value: money(calc.taxableEarnings) },
                      { label: "Estimated tax", value: money(calc.totalEstimatedTax) },
                      { label: "Estimated net", value: money(calc.netPay) },
                    ].map((row) => (
                      <div key={row.label} className="summary-row"><span>{row.label}</span><span>{row.value}</span></div>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
          </div>

          <section className="cards-grid">
            {[
              { icon: Scale, title: "Statutory redundancy pay", body: "Uses the current UK age-weighted formula with the current statutory cap." },
              { icon: CalendarClock, title: "Notice and PILON", body: "Shows the higher of statutory and contractual notice and keeps PILON taxable." },
              { icon: Landmark, title: "Tax treatment", body: `Separates the ${POUND}30,000 redundancy exemption from taxable notice and holiday pay.` },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="info-card">
                  <div className="info-icon"><Icon size={18} /></div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              );
            })}
          </section>

          <section className="csection" id="what-is">
            <div className="sec-badge">UK Employment Law</div>
            <h2 className="sec-title">What Is <em>Statutory Redundancy Pay?</em></h2>
            <p className="sec-lead">
              Statutory Redundancy Pay is the legal minimum payment that many UK employees can
              receive when they are made redundant after two or more years of continuous
              employment. It is a legal floor rather than a complete severance package.
            </p>
            <div className="two-col">
              <div className="cbody">
                <p>
                  In the UK, redundancy pay is not simply a flat amount based on salary. It is
                  calculated using three factors: your age, your complete years of continuous
                  service, and your weekly pay subject to the statutory cap. Because the formula is
                  age-weighted, older workers and longer-serving employees often build a larger
                  statutory entitlement.
                </p>
                <p>
                  To be eligible for statutory redundancy pay, you normally need to be an employee
                  with at least two complete years of continuous service and to have been genuinely
                  made redundant. Dismissal for misconduct or refusal of suitable alternative
                  employment can change the outcome.
                </p>
                <p>
                  The statutory formula counts each full year of service separately: 0.5 week for
                  years under age 22, 1 week for years aged 22 to 40, and 1.5 weeks for years
                  aged 41 or over. Service is capped at 20 years.
                </p>
                <h3>The Weekly Pay Cap</h3>
                <p>
                  The weekly pay used in the statutory calculation is capped. This calculator uses
                  the current post-6 April 2026 cap of <span className="pill">{money(WEEKLY_PAY_CAP_2026)} per week</span>.
                  If your actual weekly pay is higher, the statutory formula still uses the cap.
                </p>
              </div>
              <div className="cbody">
                <h3>How Many Weeks Redundancy Pay?</h3>
                <p>The number of weeks depends on the age band that applied during each year of service:</p>
                <div className="tbl-wrap" style={{ marginTop: 0 }}>
                  <table>
                    <thead><tr><th>Age at Time of Service</th><th>Weeks&apos; Pay per Year</th></tr></thead>
                    <tbody>
                      <tr><td>Under 22</td><td className="td-amber">0.5 week&apos;s pay per year</td></tr>
                      <tr><td>22 to 40</td><td className="td-amber">1 week&apos;s pay per year</td></tr>
                      <tr><td>41 or over</td><td className="td-amber">1.5 weeks&apos; pay per year</td></tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 14 }}>
                  Only the most recent 20 years count toward the statutory calculation, so very
                  long tenures stop increasing the minimum entitlement after that point.
                </p>
                <h3>Enhanced Redundancy Pay</h3>
                <p>
                  Many employers offer enhanced redundancy pay above the statutory minimum. That
                  enhancement may add extra weeks, ignore the statutory cap, or do both. Always
                  compare the statutory minimum with your contract, handbook, and any redundancy
                  policy or settlement proposal.
                </p>
              </div>
            </div>
          </section>

          <section className="csection" id="tax">
            <div className="sec-badge">HMRC Rules</div>
            <h2 className="sec-title">Is Redundancy Pay <em>Taxable in the UK?</em></h2>
            <p className="sec-lead">
              Different parts of a severance package can be taxed differently. That means the
              gross amount and the amount you actually keep can diverge materially.
            </p>
            <div className="two-col">
              <div className="cbody">
                <h3>The {POUND}30,000 Tax-Free Threshold</h3>
                <p>
                  The first <span className="pill">{POUND}30,000</span> of a genuine redundancy
                  payment can usually be exempt from income tax. That typically includes statutory
                  redundancy pay and some qualifying enhanced redundancy amounts.
                </p>
                <p>
                  If the redundancy element exceeds {POUND}30,000, the excess is generally taxed
                  as income. This is why a proper breakdown matters more than the gross headline
                  figure when you compare two offers.
                </p>
                <h3>Notice Pay and PILON</h3>
                <p>
                  Notice pay, including payment in lieu of notice, is treated as taxable earnings.
                  It does not share the {POUND}30,000 redundancy exemption.
                </p>
              </div>
              <div className="cbody">
                <h3>Holiday Pay</h3>
                <p>
                  Accrued but unused holiday paid out on termination is normally taxable as
                  earnings because it represents pay for an employment entitlement rather than a
                  genuine redundancy payment.
                </p>
                <h3>Ex-Gratia Payments</h3>
                <p>
                  Ex-gratia payments can sometimes fall within redundancy treatment if they are
                  genuinely part of the termination package rather than pay for work, benefits, or
                  some separate obligation.
                </p>
                <p>
                  For larger packages, it is worth checking how each payment is described in the
                  paperwork because tax classification often drives more value than the gross total.
                </p>
              </div>
            </div>
          </section>

          <section className="csection" id="reference">
            <div className="sec-badge">Reference</div>
            <h2 className="sec-title">Redundancy Pay <em>by Age and Service</em></h2>
            <p className="sec-lead">
              Quick reference table showing statutory redundancy pay at the current weekly pay cap.
              These figures are illustrative; the calculator above is the more precise tool.
            </p>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Age</th><th>5 Years</th><th>10 Years</th><th>15 Years</th><th>20 Years</th><th>Weeks (20yr)</th></tr></thead>
                <tbody>
                  {[
                    [21, 2.5, 5.0, 7.5, 10.0],
                    [25, 4.5, 9.0, 13.5, 18.0],
                    [30, 5.0, 10.0, 15.0, 20.0],
                    [35, 5.0, 10.0, 15.0, 20.0],
                    [40, 5.0, 10.0, 15.0, 20.0],
                    [45, 5.5, 11.0, 16.5, 22.0],
                    [50, 6.0, 12.5, 18.5, 24.0],
                    [55, 6.0, 13.5, 21.0, 26.0],
                    [60, 6.0, 13.5, 21.0, 28.0],
                    [64, 6.0, 13.5, 21.0, 30.0],
                  ].map(([ageValue, w5, w10, w15, w20]) => (
                    <tr key={`ref-${ageValue}`}>
                      <td>Age {ageValue}</td>
                      <td className="td-amber">{money(Number(w5) * WEEKLY_PAY_CAP_2026)}</td>
                      <td className="td-amber">{money(Number(w10) * WEEKLY_PAY_CAP_2026)}</td>
                      <td className="td-amber">{money(Number(w15) * WEEKLY_PAY_CAP_2026)}</td>
                      <td className="td-amber">{money(Math.min(Number(w20), 30) * WEEKLY_PAY_CAP_2026)}</td>
                      <td>{Math.min(Number(w20), 30).toFixed(1)} wks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="csection" id="notice">
            <div className="sec-badge">Notice Entitlement</div>
            <h2 className="sec-title">Notice Pay and <em>Garden Leave</em></h2>
            <p className="sec-lead">
              Notice entitlement is separate from statutory redundancy pay and can be a major part
              of the total severance package.
            </p>
            <div className="two-col">
              <div className="cbody">
                <h3>Statutory Minimum Notice</h3>
                <p>
                  UK employees are generally entitled to minimum notice based on service, with the
                  contractual period applying instead if it is longer. The calculator shows the
                  higher of the statutory minimum and the contractual notice you enter.
                </p>
                <div className="tbl-wrap" style={{ marginTop: 0 }}>
                  <table>
                    <thead><tr><th>Service Length</th><th>Minimum Notice</th></tr></thead>
                    <tbody>
                      <tr><td>Under 1 month</td><td className="td-amber">None unless contract says otherwise</td></tr>
                      <tr><td>1 month to 2 years</td><td className="td-amber">1 week</td></tr>
                      <tr><td>2 years</td><td className="td-amber">2 weeks</td></tr>
                      <tr><td>3 years</td><td className="td-amber">3 weeks</td></tr>
                      <tr><td>4 years</td><td className="td-amber">4 weeks</td></tr>
                      <tr><td>5 years</td><td className="td-amber">5 weeks</td></tr>
                      <tr><td>12 or more years</td><td className="td-amber">12 weeks maximum</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="cbody">
                <h3>Garden Leave</h3>
                <p>
                  Garden leave means you remain employed and paid during notice but do not
                  continue your normal duties. From a tax perspective it is usually ordinary
                  taxable pay rather than tax-free redundancy compensation.
                </p>
                <h3>PILON</h3>
                <p>
                  Payment in lieu of notice lets employment end immediately while a lump sum is
                  paid for notice instead. In practice it is usually taxed as earnings.
                </p>
              </div>
            </div>
          </section>

          <section className="faq-list faq-list-expanded" id="faq">
            <h2>Frequently Asked Questions</h2>
            {[
              {
                q: "How much redundancy pay am I entitled to in the UK?",
                a: "Your statutory redundancy pay depends on age, complete years of service, and capped weekly pay. The formula applies 0.5 week, 1 week, or 1.5 weeks of pay per year depending on the relevant age band.",
              },
              {
                q: "Is redundancy pay taxable in the UK?",
                a: "The first GBP 30,000 of a genuine redundancy payment can be tax-free, but notice pay, holiday pay, and similar earnings are generally taxable.",
              },
              {
                q: "What is the weekly pay cap for redundancy?",
                a: `This calculator uses the current post-6 April 2026 statutory weekly pay cap of ${money(WEEKLY_PAY_CAP_2026)} per week.`,
              },
              {
                q: "How is statutory redundancy pay calculated?",
                a: "Each complete year of service is reviewed separately, the correct age multiplier is applied, the total weeks are added up, and the result is multiplied by capped weekly pay.",
              },
              {
                q: "How much notice pay am I entitled to when made redundant?",
                a: "You are generally entitled to the higher of statutory minimum notice and contractual notice. That notice pay is separate from statutory redundancy pay.",
              },
              {
                q: "Can my employer pay less than the statutory minimum redundancy amount?",
                a: "No. If you qualify for statutory redundancy pay, the employer cannot go below the legal minimum, though they can pay more.",
              },
              {
                q: "Does redundancy pay affect benefits in the UK?",
                a: "It can affect means-tested benefits because the payment may count as capital or savings. The impact depends on the benefit and your wider circumstances.",
              },
              {
                q: "What is the difference between voluntary and compulsory redundancy?",
                a: "The legal framework is often similar, but voluntary packages can be more generous because employers may offer incentives to encourage employees to opt in.",
              },
            ].map((item) => (
              <div key={item.q} className="faq-item faq-item-open">
                <p className="faq-q">{item.q}</p>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </section>

          <div className="cta-box">
            <h2>Calculate Your <em>Severance Package</em></h2>
            <p>Use the calculator above to estimate redundancy pay, notice value, and approximate tax treatment.</p>
            <button type="button" className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Recalculate from the top
            </button>
          </div>

          <div className="footer">
            <p>UK Severance Pay Calculator - current statutory rates - guidance only, not legal or tax advice.</p>
            <p style={{ marginTop: 8 }}>
              <a href="#what-is">Statutory Redundancy Pay</a> · <a href="#tax">Tax Treatment</a> · <a href="#reference">Reference Table</a> · <a href="#notice">Notice Rights</a> · <a href="#faq">FAQ</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .uksev-page {
          --bg: #f5f3ef;
          --surface: #ffffff;
          --line: #d7d1c7;
          --line-strong: #c7beb2;
          --navy: #152139;
          --navy-2: #1d2a45;
          --ink: #222a39;
          --muted: #6e788d;
          --amber: #d48a15;
          --green: #1e6b43;
          --red: #9d2727;
          background: linear-gradient(180deg, #f6f4f0 0%, #efebe4 100%);
          color: var(--ink);
          border-radius: 28px;
          padding: 24px;
        }
        .uksev-page * { box-sizing: border-box; }
        .uksev-shell { max-width: 1180px; margin: 0 auto; }
        .uksev-hero { background: var(--navy); color: white; border-radius: 22px; padding: 28px 28px 30px; margin-bottom: 22px; position: relative; overflow: hidden; }
        .uksev-hero::after { content: "UK"; position: absolute; right: 26px; top: 8px; font-size: 7rem; color: rgba(255,255,255,0.04); font-weight: 800; pointer-events: none; }
        .hero-kicker { display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72rem; color: #c2cad8; margin-bottom: 14px; font-weight: 700; }
        .uksev-hero h1 { margin: 0 0 10px; font-size: clamp(2.2rem, 5vw, 4rem); line-height: 1.05; letter-spacing: -0.03em; }
        .uksev-hero h1 em { color: #f3b24e; font-style: italic; }
        .hero-copy { max-width: 640px; color: #b8c3d8; line-height: 1.72; margin: 0 0 18px; }
        .hero-stats { display: flex; flex-wrap: wrap; gap: 10px; }
        .hero-chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,0.08); color: #d9e1ef; font-size: 0.82rem; border: 1px solid rgba(255,255,255,0.08); }
        .uksev-layout { display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 20px; align-items: start; }
        .uksev-inputs, .statement, .detail-card, .info-card, .faq-list, .csection { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 10px 26px rgba(21,33,57,0.06); }
        .uksev-inputs { position: sticky; top: 84px; overflow: hidden; }
        .panel-head { background: var(--navy-2); color: #f3b24e; padding: 16px 20px; display: flex; align-items: center; gap: 8px; font-weight: 700; }
        .panel-body { padding: 20px; }
        .section-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 700; margin: 18px 0 12px; display: flex; align-items: center; gap: 8px; }
        .section-label::after { content: ""; flex: 1; height: 1px; background: var(--line); }
        .section-label:first-child { margin-top: 0; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 0.76rem; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .field input { width: 100%; height: 40px; border-radius: 10px; border: 1.5px solid var(--line-strong); background: #faf8f5; padding: 0 12px; font-size: 0.92rem; color: var(--ink); outline: none; }
        .subtle-line { margin-top: 4px; color: var(--muted); font-size: 0.72rem; }
        .toggle-btn { width: 100%; margin: 8px 0 6px; border-radius: 10px; border: 1px solid var(--line); background: #f4efe8; color: var(--ink); height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; position: relative; font-weight: 700; }
        .toggle-btn span { width: 18px; height: 18px; border-radius: 999px; background: white; position: absolute; left: 12px; transition: transform 0.18s ease; }
        .toggle-btn.on { background: var(--navy); color: white; }
        .toggle-btn.on span { transform: translateX(18px); }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .uksev-results { display: flex; flex-direction: column; gap: 18px; }
        .statement-head { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; padding: 20px 22px; background: var(--navy); color: white; border-radius: 18px 18px 0 0; }
        .statement-title { font-size: 1.1rem; font-weight: 700; }
        .statement-sub { color: #c4cede; font-size: 0.74rem; margin-top: 4px; }
        .mini-label { color: var(--muted); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 5px; }
        .statement-total { text-align: right; }
        .big-value { font-size: clamp(2rem, 5vw, 3rem); color: #f3b24e; line-height: 1; font-weight: 800; }
        .mini-sub { color: #c4cede; font-size: 0.76rem; margin-top: 4px; }
        .receipt-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }
        .receipt-col { padding: 18px 18px 20px; border-right: 1px solid var(--line); }
        .receipt-col:last-child { border-right: none; }
        .receipt-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--line); font-weight: 700; }
        .receipt-row, .summary-row { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; font-size: 0.82rem; border-bottom: 1px solid #efebe5; color: var(--ink); }
        .receipt-total { display: flex; justify-content: space-between; gap: 10px; padding-top: 10px; margin-top: 8px; border-top: 2px solid var(--line-strong); font-weight: 800; color: var(--navy); }
        .receipt-total.tax { color: var(--red); }
        .statement-foot { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 14px 20px; border-top: 1px solid var(--line); background: #f8f6f2; flex-wrap: wrap; border-radius: 0 0 18px 18px; }
        .foot-value { font-size: 1.22rem; font-weight: 800; color: var(--navy); }
        .foot-pill { font-size: 0.78rem; border-radius: 999px; padding: 8px 12px; font-weight: 700; }
        .foot-pill.ok { background: #eaf6ee; color: var(--green); }
        .foot-pill.warn { background: #fff0f0; color: var(--red); }
        .detail-card { padding: 18px 20px; }
        .tab-row { display: flex; gap: 4px; background: #f4efe8; border: 1px solid var(--line); border-radius: 10px; padding: 4px; margin-bottom: 14px; }
        .tab-btn { flex: 1; border: none; background: transparent; border-radius: 8px; padding: 9px 10px; cursor: pointer; font-weight: 700; color: var(--muted); font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .tab-btn.active { background: white; color: var(--navy); box-shadow: 0 4px 10px rgba(21,33,57,0.06); }
        .info-box { border-radius: 12px; padding: 12px 14px; font-size: 0.82rem; line-height: 1.65; margin-bottom: 12px; background: #fff4e0; color: #775215; border: 1px solid #f0d499; }
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; }
        .info-card { padding: 18px; }
        .info-icon { width: 38px; height: 38px; border-radius: 12px; background: #f4efe8; color: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .info-card h3 { margin: 0 0 6px; color: var(--navy); font-size: 1rem; }
        .info-card p, .faq-answer { color: var(--muted); line-height: 1.72; }
        .csection { padding: 32px 26px; margin-top: 18px; }
        .sec-badge { display: inline-block; background: var(--navy); color: #f3b24e; font-size: 0.64rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; }
        .sec-title { margin: 0 0 12px; font-size: clamp(1.9rem, 3.4vw, 2.7rem); color: var(--ink); line-height: 1.16; }
        .sec-title em { color: var(--navy); font-style: italic; }
        .sec-lead { max-width: 760px; margin: 0 0 24px; color: var(--muted); line-height: 1.8; font-size: 0.95rem; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .cbody { color: var(--muted); font-size: 0.92rem; line-height: 1.82; }
        .cbody p { margin: 0 0 14px; }
        .cbody h3 { margin: 22px 0 8px; color: var(--ink); font-size: 1.14rem; }
        .pill { display: inline-block; background: #fff4e0; color: var(--navy); border: 1px solid #f0d499; border-radius: 6px; padding: 1px 8px; font-size: 0.82rem; }
        .tbl-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 14px; margin-top: 16px; }
        .tbl-wrap table { width: 100%; border-collapse: collapse; }
        .tbl-wrap thead { background: var(--navy); }
        .tbl-wrap thead th { padding: 10px 14px; text-align: left; color: #f3b24e; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .tbl-wrap tbody td { padding: 10px 14px; border-top: 1px solid var(--line); color: var(--ink); font-size: 0.84rem; }
        .td-amber { color: var(--amber) !important; font-weight: 700; }
        .faq-list { margin-top: 18px; padding: 20px; }
        .faq-list h2 { margin: 0 0 12px; color: var(--navy); font-size: 1.7rem; }
        .faq-item + .faq-item { border-top: 1px solid var(--line); }
        .faq-item-open { padding: 18px 0; }
        .faq-q { margin: 0 0 8px; font-size: 1rem; font-weight: 700; color: var(--ink); }
        .faq-answer { padding: 0 0 14px; font-size: 0.84rem; }
        .cta-box { margin: 34px 0 28px; padding: 42px 34px; border-radius: 18px; background: var(--navy); color: white; text-align: center; position: relative; overflow: hidden; }
        .cta-box::before { content: ""; position: absolute; inset: 0 auto auto 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #f3b24e, transparent); }
        .cta-box h2 { margin: 0 0 10px; font-size: 2rem; }
        .cta-box h2 em { color: #f3b24e; font-style: italic; }
        .cta-box p { margin: 0 0 18px; color: #c4cede; }
        .cta-btn { border: none; border-radius: 8px; padding: 11px 24px; background: #d48a15; color: #152139; font-weight: 800; cursor: pointer; }
        .footer { border-top: 1px solid var(--line); padding: 24px 0 4px; text-align: center; color: var(--muted); font-size: 0.8rem; }
        .footer a { color: var(--muted); text-decoration: none; }
        @media (max-width: 980px) {
          .uksev-layout, .receipt-grid, .cards-grid, .two-col { grid-template-columns: 1fr; }
          .uksev-inputs { position: static; }
        }
        @media (max-width: 760px) {
          .field-grid { grid-template-columns: 1fr; }
          .uksev-page { padding: 18px; }
          .statement-total { text-align: left; }
          .csection { padding: 24px 18px; }
        }
      `}</style>
    </>
  );
}
