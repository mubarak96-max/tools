# New York Business Startup Cost Calculator — Requirements

## Overview

A free, interactive web calculator that helps entrepreneurs estimate the real cost of starting a business in New York State. It separates required government fees (with exact official values) from optional launch costs, and outputs a minimum / likely / upper cost range.

---

## User Stories

### US-1: Entity Type Selection

As a prospective business owner,
I want to select my business structure (sole proprietorship, LLC, corporation, or partnership),
so that the calculator applies the correct NY Department of State filing fees for my entity type.

**Acceptance Criteria:**
- User can select one of: Sole Proprietorship, LLC, Corporation, Partnership
- LLC selection shows $200 entity filing fee
- Corporation selection shows $125 entity filing fee
- Sole proprietorship and partnership show $0 entity filing fee
- Changing entity type immediately updates all dependent cost calculations

---

### US-2: DBA / Assumed Name

As a business owner who wants to operate under a trade name,
I want to indicate whether I'll use a DBA / assumed name,
so that the calculator includes the correct DBA filing cost for my entity type and location.

**Acceptance Criteria:**
- Toggle: "Will you use a DBA or assumed name?" (Yes / No)
- If Yes and entity is sole prop or partnership: show county clerk business certificate fee (~$25–$35) with note "Verify with your county clerk"
- If Yes and entity is LLC or corporation: show $25 state assumed name fee + county fee
- County fee for NYC: $100 per county
- County fee outside NYC: $25 per county
- If No: DBA line item shows $0 and is hidden from results

---

### US-3: LLC Publication Requirement

As someone forming an LLC in New York,
I want to be informed about the mandatory publication requirement and include its costs,
so that I don't underestimate my startup costs or risk having my LLC's authority suspended.

**Acceptance Criteria:**
- Shown only when entity type is LLC
- Informational block explains: publication required within 120 days, two designated newspapers, then $50 Certificate of Publication filing
- Certificate of Publication fee hardcoded at $50 (not editable)
- User can enter estimated newspaper publication cost with helper text explaining county variation
- Placeholder text: "e.g. 500 — varies by county. Manhattan typically $1,000–$2,000+. Some upstate counties under $200."
- Both the $50 filing and the user-entered newspaper cost are included in government costs subtotal

---

### US-4: Sales Tax Registration

As a business that will sell taxable goods or services,
I want to know about the NY sales tax Certificate of Authority requirement,
so that I register before making any taxable sales as required by law.

**Acceptance Criteria:**
- Toggle: "Will you sell taxable goods or services?" (Yes / No)
- If Yes: show Certificate of Authority line item at $0 with "Required by law" tag
- If Yes: show advisory: "Required before making any taxable sales in New York. Apply through NY Business Express."
- If No: line item not shown
- $0 fee is never editable — it is always free

---

### US-5: Location Selection

As a business owner,
I want to specify whether I'm in NYC or outside NYC (and which borough if NYC),
so that the calculator applies the correct county-level fees.

**Acceptance Criteria:**
- User selects: "New York City" or "Outside NYC (rest of New York State)"
- If NYC selected: user selects borough (Manhattan, Brooklyn, Queens, The Bronx, Staten Island)
- Borough selection affects assumed name county fees ($100 per NYC county)
- Outside NYC selection applies $25 county fee for assumed names
- Location selection also affects which license advisories are shown

---

### US-6: Industry Selection

As a business owner,
I want to select my industry,
so that the calculator shows relevant license and permit advisories for my business type.

**Acceptance Criteria:**
- User selects one industry from: Online store/E-commerce, Restaurant/Food service, Salon/Beauty, Contractor/Home services, Street vendor, Retail shop, Consulting/Agency, Professional practice, Other
- Industry selection does not change government fee calculations (fees are entity/location-driven)
- Industry selection triggers relevant advisory messages in the results (e.g., food businesses see NYC Health Department permit advisory)
- All advisories link to NY Business Express or the relevant official agency
- Advisory block is clearly labeled "Industry-specific licenses may apply"

---

### US-7: Optional Launch Costs

As a business owner planning my full launch budget,
I want to enter optional startup costs (insurance, rent, equipment, etc.),
so that I get a complete picture of my total startup investment beyond government fees.

**Acceptance Criteria:**
- User can enter amounts for: Insurance, Rent / security deposit, Equipment, Inventory, Website / domain, Marketing / launch budget, Accounting / legal help, Payroll setup, Other
- All fields default to $0
- All fields accept only non-negative numbers
- Empty fields treated as $0 in calculations
- Each field labeled "Optional but common"
- Optional costs subtotal shown separately from government costs

---

### US-8: Results — Three Output Boxes

As a user who has filled in the calculator,
I want to see my costs broken into three clear sections,
so that I understand what I must pay vs. what I'm choosing to spend.

**Acceptance Criteria:**
- Box A: Required government setup costs — itemized list with "Required by law" / "Required if selling taxable goods" / "May apply" tags
- Box B: Optional launch costs — itemized list with "Optional but common" tags
- Box C: Total startup estimate showing three values:
  - Minimum estimate = government costs only
  - Likely estimate = government costs + optional costs as entered
  - Upper estimate = likely estimate × 1.2 (rounded to nearest dollar)
- Ongoing compliance note shown below Box C: "Biennial statement: $9 every 2 years for LLCs and corporations (NY Department of State)" — not included in any total
- Results update in real-time as user changes any input

---

### US-9: Factual Fee Display

As a user who needs accurate information,
I want to see the source of every government fee shown,
so that I can trust the numbers and verify them independently.

**Acceptance Criteria:**
- Each government fee line item shows its source (e.g., "NY Department of State")
- Page includes a "Fee schedule" section below the calculator with a table of all hardcoded fees, their values, and official source links
- Table includes a "Last verified" date
- Disclaimer shown: "This tool provides estimates based on official published fees. Consult a licensed attorney or accountant for advice specific to your situation."
- No fee value is fabricated or estimated — all hardcoded values match official published amounts

---

### US-10: EIN Information

As a business owner,
I want to know about the EIN requirement and its cost,
so that I can include it in my planning.

**Acceptance Criteria:**
- EIN line item always shown in government costs section
- Fee: $0 (free from IRS)
- Label: "Employer Identification Number (EIN)"
- Source: "IRS — free online application"
- Advisory: "Required if you have employees, operate as a corporation or partnership, or have a Keogh plan."

---

### US-11: SEO & E-E-A-T

As the site owner,
I want the page to rank for New York business startup cost queries,
so that it drives organic traffic from high-intent users.

**Acceptance Criteria:**
- Page title: "New York Business Startup Cost Calculator | Filing, Licensing & Launch Costs"
- Meta description includes: LLC ($200), corporation ($125), DBA, LLC publication, EIN, sales tax registration
- Canonical URL set to `/finance/new-york-business-startup-cost-calculator`
- JSON-LD: WebApplication, BreadcrumbList, FAQPage schemas
- FAQ section with 6 factual questions and answers
- All external links to official sources use `rel="noreferrer"` and open in new tab
- Page includes "Industry-specific licenses in New York" section linking to NY Business Express

---

### US-12: Mobile Usability

As a user on a mobile device,
I want the calculator to be fully usable on a small screen,
so that I can complete my estimate without needing a desktop.

**Acceptance Criteria:**
- All input fields are touch-friendly (min 44px tap target)
- Results section is visible without horizontal scrolling
- Accordion sections collapse/expand for Step 1 and Step 2 on mobile
- Three result boxes stack vertically on mobile
- No horizontal overflow at 375px viewport width

---

## Non-Functional Requirements

- All government fee values must match official published sources at time of implementation
- Fee values must be stored as named constants with source comments in the calculation module
- Calculation logic must be pure functions with no side effects (fully testable)
- Page must load without JavaScript for the static content (SEO shell)
- Calculator requires JavaScript; show a `<noscript>` fallback message
- No external chart libraries — cost breakdown uses CSS-only bar visualization if included
