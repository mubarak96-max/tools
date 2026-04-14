# New York Business Startup Cost Calculator — Implementation Tasks

## Tasks

- [x] 1. Create calculation logic module
  - [x] 1.1 Create `src/lib/tools/ny-startup-cost.ts` with all types: `EntityType`, `NYLocation`, `NYCBorough`, `Industry`, `NYStartupInputs`, `OptionalStartupCosts`, `GovernmentCostBreakdown`, `NYStartupCostResult`
  - [x] 1.2 Implement `getEntityFilingFee(type)` — LLC=$200, Corporation=$125, sole_prop/partnership=$0 as named constants with source comments
  - [x] 1.3 Implement `getDBAFee(type, location, borough)` — sole_prop/partnership returns 30 (county clerk range), LLC/corp returns $25 state + $100 NYC county or $25 outside NYC
  - [x] 1.4 Implement `calculateGovernmentCosts(inputs)` — entity filing + DBA + LLC publication filing ($50 fixed) + LLC newspaper cost (user-entered) + $0 for EIN and sales tax
  - [x] 1.5 Implement `sumOptionalCosts(costs)` — sum all optional cost fields
  - [x] 1.6 Implement `getLicenseAdvisory(industry, location)` — returns string[] of advisory messages per industry
  - [x] 1.7 Implement `calculateNYStartupCost(inputs)` — assembles full result: government costs, optional total, totalMinimum, totalLikely, totalUpper (×1.2 rounded), compliance note, advisories
  - [x] 1.8 Implement `getDefaultOptionalCosts()` — returns all optional cost fields set to 0

- [x] 2. Build the calculator component
  - [x] 2.1 Create `src/app/finance/new-york-business-startup-cost-calculator/components/NewYorkStartupCostCalculator.tsx` as a `"use client"` component
  - [x] 2.2 Implement Step 1 inputs: entity type radio group (Sole Proprietorship, LLC, Corporation, Partnership)
  - [x] 2.3 Implement location selector: NYC vs Outside NYC; show borough selector (5 boroughs) when NYC is selected
  - [x] 2.4 Implement DBA toggle (Yes/No) — show/hide DBA cost line in results based on selection
  - [x] 2.5 Implement taxable sales toggle (Yes/No) — show Certificate of Authority advisory when Yes
  - [x] 2.6 Implement industry selector dropdown with all 9 industry options
  - [x] 2.7 Implement LLC publication block — shown only when entity type is LLC; $50 fee hardcoded and read-only; user-editable newspaper cost field with county variation helper text
  - [x] 2.8 Implement Step 2 optional costs section — 9 numeric input fields (insurance, rent/deposit, equipment, inventory, website/domain, marketing, accounting/legal, payroll setup, other), all defaulting to 0
  - [x] 2.9 Wire all inputs to `calculateNYStartupCost` via `useMemo` — results update in real-time on every input change
  - [x] 2.10 Render Box A (government costs) — itemized list with "Required by law" / "Required if selling taxable goods" badge chips; show only applicable line items; display subtotal
  - [x] 2.11 Render Box B (optional launch costs) — itemized list with "Optional but common" badge chips; show only non-zero items or all fields; display subtotal
  - [x] 2.12 Render Box C (total estimate) — three rows: Minimum (gov only), Likely (gov + optional), Upper (likely × 1.2); highlight Likely as primary
  - [x] 2.13 Render ongoing compliance note below Box C — "Biennial statement: $9 every 2 years for LLCs and corporations (NY Department of State)" — clearly separated from totals
  - [x] 2.14 Render license advisory block — industry-specific messages with links to NY Business Express and relevant agencies; labeled "Industry-specific licenses may apply"
  - [x] 2.15 Implement mobile layout — accordion sections for Step 1 and Step 2; result boxes stack vertically; all inputs touch-friendly

- [x] 3. Build the page shell
  - [x] 3.1 Create `src/app/finance/new-york-business-startup-cost-calculator/page.tsx` with `export const revalidate = 43200`
  - [x] 3.2 Add `metadata` export: title, description (mentioning LLC $200, corp $125, DBA, publication, EIN, sales tax), keywords, canonical URL, OpenGraph, Twitter card
  - [x] 3.3 Build `buildApplicationJsonLd()` — WebApplication schema with name, url, applicationCategory: "FinanceApplication", free offer
  - [x] 3.4 Add BreadcrumbList JSON-LD: Home > Finance > New York Business Startup Cost Calculator
  - [x] 3.5 Add FAQPage JSON-LD with 6 Q&As (LLC cost, publication requirement, sales tax, DBA cost, corporation cost, ongoing fees)
  - [x] 3.6 Render breadcrumb nav with links to Home and Finance
  - [x] 3.7 Render H1 "New York Business Startup Cost Calculator" with subtitle and intro paragraph
  - [x] 3.8 Render `<NewYorkStartupCostCalculator />` component
  - [x] 3.9 Render "Official fee schedule" section — table of all hardcoded fees with source names, fee amounts, and linked official sources; include "Last verified: [date]" and disclaimer
  - [x] 3.10 Render "What the LLC publication requirement means" section — factual explainer with link to NY DOS LLC page
  - [x] 3.11 Render "Industry-specific licenses in New York" section — brief overview paragraph linking to NY Business Express
  - [x] 3.12 Render FAQ section — 6 Q&A articles matching the FAQPage JSON-LD
  - [x] 3.13 Render `<RelatedToolsSection category="Finance" />` at the bottom
  - [x] 3.14 Add `<noscript>` fallback message inside the calculator area

- [x] 4. Verify correctness properties
  - [x] 4.1 Manually verify: LLC entity filing = $200, Corporation = $125, sole_prop/partnership = $0
  - [x] 4.2 Manually verify: LLC publication filing = $50 when LLC selected, $0 for all other entity types
  - [x] 4.3 Manually verify: EIN and sales tax registration always = $0 in calculations
  - [x] 4.4 Manually verify: DBA fee for LLC/corp in NYC = $25 + $100 = $125; outside NYC = $25 + $25 = $50
  - [x] 4.5 Manually verify: totalMinimum = governmentCosts.subtotal only (no optional costs)
  - [x] 4.6 Manually verify: totalUpper = Math.round(totalLikely * 1.2)
  - [x] 4.7 Manually verify: biennial statement ($9) does not appear in any of the three total values
  - [x] 4.8 Manually verify: empty optional cost fields treated as $0, not NaN
