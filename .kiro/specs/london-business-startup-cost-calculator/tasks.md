# London Business Startup Cost Calculator — Implementation Tasks

## Tasks

- [x] 1. Create calculation logic module
  - [x] 1.1 Create `src/lib/tools/london-startup-cost.ts` with all types: `UKBusinessStructure`, `UKLocation`, `UKIndustry`, `VATStatus`, `PremisesLicenceBand`, `LondonStartupInputs`, `UKOptionalStartupCosts`, `UKGovernmentCostBreakdown`, `LondonStartupCostResult`
  - [x] 1.2 Implement named constants with source comments: `CH_INCORPORATION_FEE_ONLINE` (£100), `CH_CONFIRMATION_STATEMENT_FEE` (£50), `PREMISES_LICENCE_FEES` (bands A–E: £100/£190/£315/£450/£635), `PERSONAL_LICENCE_FEE` (£37), all HMRC/food fees at £0
  - [x] 1.3 Implement `getIncorporationFee(structure)` — £100 for Ltd/LLP, £0 for sole_trader/partnership
  - [x] 1.4 Implement `getConfirmationStatementFee(structure)` — £50 for Ltd/LLP, £0 for sole_trader/partnership
  - [x] 1.5 Implement `getPremisesLicenceFee(band)` — returns fee from PREMISES_LICENCE_FEES map; £0 when band is 'none'
  - [x] 1.6 Implement `calculateUKGovernmentCosts(inputs)` — incorporation + confirmation statement + VAT ($0) + self assessment ($0) + food registration ($0) + premises licence + personal licence
  - [x] 1.7 Implement `sumUKOptionalCosts(costs)` — sum all optional cost fields, treating negatives as 0
  - [x] 1.8 Implement `getUKLicenceAdvisory(industry, location)` — returns string[] of advisory messages per industry/location
  - [x] 1.9 Implement `calculateLondonStartupCost(inputs)` — assembles full result: government costs, optional total, totalMinimum, totalLikely, totalUpper (×1.2 rounded), compliance note, advisories
  - [x] 1.10 Implement `getDefaultUKOptionalCosts()` — returns all optional cost fields set to 0

- [-] 2. Build the calculator component
  - [x] 2.1 Create `src/app/finance/london-business-startup-cost-calculator/components/LondonStartupCostCalculator.tsx` as a `"use client"` component
  - [ ] 2.2 Implement business structure selector — 4-button radio group (Sole Trader, Ltd, LLP, Partnership)
  - [ ] 2.3 Implement location selector — London vs Outside London button pair
  - [ ] 2.4 Implement VAT status selector — 3-button group (Mandatory / Voluntary / No) with VAT threshold advisory (£90,000 from April 2024, HMRC)
  - [ ] 2.5 Implement industry dropdown with all 9 options
  - [ ] 2.6 Implement premises licence toggle (Yes / No / Not sure); when Yes, show band selector (A–E) with rateable value ranges; show personal licence advisory (£37) for pub/bar industry
  - [ ] 2.7 Implement food/drink toggle (Yes / No) — show food business registration advisory when Yes
  - [ ] 2.8 Implement Step 2 optional costs — 9 numeric input fields (insurance, rent/deposit, equipment, inventory, website/domain, marketing, accounting/legal, payroll setup, other), all defaulting to 0
  - [ ] 2.9 Wire all inputs to `calculateLondonStartupCost` via `useMemo` — real-time updates
  - [ ] 2.10 Render Box A (government costs) — itemized with "Required by law" / "Required if..." / "Optional" badge chips; show only applicable line items; subtotal
  - [ ] 2.11 Render Box B (optional launch costs) — itemized with "Optional but common" badges; show non-zero items; subtotal
  - [ ] 2.12 Render Box C (total estimate) — Minimum / Likely (highlighted) / Upper rows
  - [ ] 2.13 Render ongoing compliance note below Box C — Confirmation Statement £50/yr and annual premises licence charge (if applicable); clearly separated from totals
  - [ ] 2.14 Render licence advisory block — industry-specific messages with links to GOV.UK
  - [ ] 2.15 Ensure mobile-responsive layout — result boxes stack vertically; touch-friendly inputs

- [ ] 3. Build the page shell
  - [ ] 3.1 Create `src/app/finance/london-business-startup-cost-calculator/page.tsx` with `export const revalidate = 43200`
  - [ ] 3.2 Add `metadata` export: title, description (mentioning Ltd £100, Companies House, HMRC, premises licence, VAT £90k), keywords, canonical URL, OpenGraph, Twitter card
  - [ ] 3.3 Build `buildApplicationJsonLd()` — WebApplication schema, applicationCategory: "FinanceApplication", free offer (£0 GBP)
  - [ ] 3.4 Add BreadcrumbList JSON-LD: Home > Finance > London Business Startup Cost Calculator
  - [ ] 3.5 Add FAQPage JSON-LD with 6 Q&As (Ltd cost, sole trader registration, VAT threshold, premises licence need, premises licence cost, ongoing fees)
  - [ ] 3.6 Render breadcrumb nav
  - [ ] 3.7 Render H1 with subtitle and intro paragraph
  - [ ] 3.8 Render `<LondonStartupCostCalculator />` with noscript fallback
  - [ ] 3.9 Render "Official UK fee schedule" section — table with all hardcoded fees, sources (linked), and "Last verified" date; disclaimer
  - [ ] 3.10 Render "Do you need a premises licence?" section — factual explainer with GOV.UK link and fee band table
  - [ ] 3.11 Render "Food business registration" section — factual explainer with food.gov.uk link
  - [ ] 3.12 Render FAQ section — 6 Q&A articles matching FAQPage JSON-LD
  - [ ] 3.13 Render `<RelatedToolsSection category="Finance" />` at the bottom

- [~] 4. Verify correctness properties
  - [ ] 4.1 Verify: Ltd/LLP incorporation = £100; sole_trader/partnership = £0
  - [ ] 4.2 Verify: Confirmation Statement = £50 for Ltd/LLP; £0 for sole_trader/partnership
  - [ ] 4.3 Verify: VAT registration, HMRC Self Assessment, food business registration all = £0
  - [ ] 4.4 Verify: premises licence fees match GOV.UK bands (A=£100, B=£190, C=£315, D=£450, E=£635)
  - [ ] 4.5 Verify: totalMinimum = governmentCosts.subtotal only
  - [ ] 4.6 Verify: totalUpper = Math.round(totalLikely * 1.2)
  - [ ] 4.7 Verify: Confirmation Statement annual fee (£50) never added to startup total
  - [ ] 4.8 Verify: empty optional cost fields treated as £0, not NaN
