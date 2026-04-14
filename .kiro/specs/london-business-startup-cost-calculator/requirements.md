# London Business Startup Cost Calculator — Requirements

## Overview

A free, interactive web calculator that helps entrepreneurs estimate the real cost of starting a business in London / the UK. It separates required government fees (with exact official values) from optional launch costs, and outputs a minimum / likely / upper cost range in GBP (£).

---

## User Stories

### US-1: Business Structure Selection

As a prospective business owner,
I want to select my business structure (Sole Trader, Limited Company, LLP, Partnership),
so that the calculator applies the correct Companies House and HMRC registration fees.

**Acceptance Criteria:**
- User can select one of: Sole Trader, Private Limited Company (Ltd), LLP, Partnership
- Ltd and LLP: Companies House incorporation fee = £100 (online)
- Ltd and LLP: Confirmation Statement fee = £50 (first in 12-month period, online)
- Sole Trader and Partnership: Companies House fee = £0 (no registration required)
- Sole Trader and Partnership: HMRC Self Assessment registration = £0
- Changing structure immediately updates all dependent cost calculations

---

### US-2: VAT Registration

As a business owner,
I want to indicate my VAT registration status,
so that the calculator includes the correct VAT advisory and shows the £0 registration fee.

**Acceptance Criteria:**
- User selects one of: Mandatory (turnover > £90,000), Voluntary (below threshold), No
- VAT registration fee = always £0 (HMRC)
- If Mandatory or Voluntary: show line item "VAT registration" at £0 with "Required by law" or "Optional" tag
- Show advisory: "VAT registration threshold is £90,000 taxable turnover in any 12-month period (from April 2024, HMRC)"
- If No: VAT line item not shown

---

### US-3: Industry Selection

As a business owner,
I want to select my industry,
so that the calculator shows relevant licence and permit advisories for my business type.

**Acceptance Criteria:**
- User selects one of: Online/E-commerce, Restaurant/Food service, Pub/Bar/Nightclub, Salon/Beauty, Contractor/Trades, Retail shop, Consulting/Agency, Professional practice, Other
- Industry selection triggers relevant advisory messages
- Food/restaurant: food business registration advisory (free, local council, 28 days notice)
- Pub/Bar/Nightclub: premises licence advisory with fee bands
- Professional practice: professional body registration advisory
- All advisories link to relevant GOV.UK pages

---

### US-4: Location Selection

As a business owner,
I want to specify whether I'm in London or outside London,
so that the calculator shows location-relevant cost context.

**Acceptance Criteria:**
- User selects: "London" or "Outside London (England & Wales)"
- Location affects advisory messages (London-specific cost notes)
- London selection shows note about typically higher rateable values affecting premises licence band

---

### US-5: Premises Licence

As a business that needs to sell alcohol or provide regulated entertainment,
I want to indicate whether I need a premises licence and select my rateable value band,
so that the calculator includes the correct Licensing Act 2003 application fee.

**Acceptance Criteria:**
- Toggle: "Will you need a premises licence?" (Yes / No / Not sure)
- If Yes: show band selector (A–E) with rateable value ranges
- Band A (up to £4,300): £100 application fee
- Band B (£4,301–£33,000): £190 application fee
- Band C (£33,001–£87,000): £315 application fee
- Band D (£87,001–£125,000): £450 application fee
- Band E (£125,001+): £635 application fee
- Annual charge shown as compliance note (not in startup total): Band A £70/yr, B £180/yr, C £295/yr, D £320/yr, E £350/yr
- If Yes and pub/bar/nightclub industry: show personal licence advisory (£37 for DPS)
- If No or Not sure: premises licence line item = £0 / not shown

---

### US-6: Food Business Registration

As a business that will sell food or drink,
I want to know about the food business registration requirement,
so that I register with my local council before opening.

**Acceptance Criteria:**
- Toggle: "Will you sell food or drink?" (Yes / No)
- If Yes: show food business registration line item at £0 with "Required by law" tag
- Show advisory: "Must register with your local council at least 28 days before opening. Registration is free and cannot be refused."
- Link to food.gov.uk
- If No: line item not shown

---

### US-7: Optional Launch Costs

As a business owner planning my full launch budget,
I want to enter optional startup costs,
so that I get a complete picture of my total startup investment beyond government fees.

**Acceptance Criteria:**
- User can enter amounts for: Insurance, Rent / deposit, Equipment, Inventory, Website / domain, Marketing / launch, Accounting / legal help, Payroll setup, Other
- All fields default to £0
- All fields accept only non-negative numbers
- Empty fields treated as £0 in calculations
- Each field labeled "Optional but common"
- Optional costs subtotal shown separately from government costs

---

### US-8: Results — Three Output Boxes

As a user who has filled in the calculator,
I want to see my costs broken into three clear sections,
so that I understand what I must pay vs. what I'm choosing to spend.

**Acceptance Criteria:**
- Box A: Required government setup costs — itemized with "Required by law" / "Required if..." / "Optional" tags
- Box B: Optional launch costs — itemized with "Optional but common" tags
- Box C: Total startup estimate:
  - Minimum = government costs only
  - Likely = government + optional costs as entered
  - Upper = likely × 1.2 (rounded to nearest pound)
- Ongoing compliance note below Box C (not in totals):
  - "Confirmation Statement: £50 per year for Ltd companies and LLPs (Companies House)"
  - Annual premises licence charge if applicable
- Results update in real-time on every input change

---

### US-9: Factual Fee Display

As a user who needs accurate information,
I want to see the source of every government fee shown,
so that I can trust the numbers and verify them independently.

**Acceptance Criteria:**
- Each government fee line item shows its source
- Page includes "Official UK fee schedule" table with all hardcoded fees, values, and linked official sources
- Table includes "Last verified" date
- Disclaimer: "This tool provides estimates based on official published fees. Consult a qualified accountant or solicitor for advice specific to your situation."
- All fee values match official published amounts

---

### US-10: SEO & E-E-A-T

As the site owner,
I want the page to rank for London and UK business startup cost queries.

**Acceptance Criteria:**
- Page title: "London Business Startup Cost Calculator | Companies House, HMRC & Launch Costs"
- Meta description includes: Ltd £100, Companies House, HMRC, premises licence, VAT
- Canonical URL: `/finance/london-business-startup-cost-calculator`
- JSON-LD: WebApplication, BreadcrumbList, FAQPage schemas
- FAQ section with 6 factual Q&As
- All external links use `rel="noreferrer"` and open in new tab

---

### US-11: Mobile Usability

As a user on a mobile device,
I want the calculator to be fully usable on a small screen.

**Acceptance Criteria:**
- All input fields touch-friendly (min 44px tap target)
- Results section visible without horizontal scrolling
- Three result boxes stack vertically on mobile
- No horizontal overflow at 375px viewport width

---

## Non-Functional Requirements

- All government fee values must match official published sources at time of implementation
- Fee values stored as named constants with source comments
- Calculation logic must be pure functions (fully testable)
- Currency displayed in GBP (£) throughout
- No external chart libraries
