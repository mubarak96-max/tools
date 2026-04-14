# London Business Startup Cost Calculator — Design Document

## Overview

A free, interactive calculator that helps entrepreneurs estimate the real cost of starting a business in London / the UK. The tool separates **required government fees** (Companies House registration, HMRC registrations, licences) from **optional launch costs** (rent, equipment, insurance, marketing), and outputs a minimum / likely / upper cost range in GBP (£).

All government fee values are sourced from official UK government publications (Companies House, HMRC, GOV.UK) and must be kept factually accurate.

---

## High-Level Design

### Page Route

```
/finance/london-business-startup-cost-calculator
```

### Page Title & Subtitle

```
London Business Startup Cost Calculator
Estimate your Companies House registration, HMRC filing, licensing, and launch costs in the UK
```

### System Architecture

```
/finance/london-business-startup-cost-calculator
├── page.tsx                                          ← SEO shell (metadata, JSON-LD, breadcrumbs, FAQ)
└── components/
    └── LondonStartupCostCalculator.tsx               ← "use client" multi-step calculator
```

Logic lives in:
```
src/lib/tools/london-startup-cost.ts    ← pure calculation functions (testable, no UI)
```

### Data Flow

```
Step 1: User answers structure questions
        (business structure, VAT registration, industry, London borough or outside London)
        ↓
Step 2: Required government costs calculated from official fee schedule
        ↓
Step 3: User adds optional launch cost line items
        ↓
Step 4: Results panel shows 3 boxes:
        A. Required government setup costs
        B. Likely launch costs
        C. Total startup estimate (min / likely / upper)
```

---

## Step 1 — Input Questions

### 1. Business Structure

```
Options:
  - Sole Trader
  - Private Limited Company (Ltd)
  - Limited Liability Partnership (LLP)
  - Partnership (General)
```

Path logic:
- Sole Trader → no Companies House registration; register with HMRC for Self Assessment (free)
- Private Limited Company → Companies House incorporation £100 (online); annual Confirmation Statement £50
- LLP → Companies House incorporation £100 (online); annual Confirmation Statement £50
- Partnership → no Companies House registration; partners register with HMRC for Self Assessment (free)

### 2. Will the business register for VAT?

Toggle: Yes (mandatory) / Yes (voluntary) / No

Context shown:
- Mandatory if taxable turnover exceeds £90,000 in any 12-month period (HMRC threshold from April 2024)
- Voluntary registration available below threshold
- VAT registration is free (£0) — HMRC
- If Yes: show advisory about VAT returns requirement

### 3. Industry

```
Options:
  - Online / E-commerce
  - Restaurant / Food service
  - Pub / Bar / Nightclub
  - Salon / Beauty
  - Contractor / Trades
  - Retail shop
  - Consulting / Agency
  - Professional practice (solicitor, accountant, architect)
  - Other
```

Industry selection triggers:
- Food businesses → food business registration advisory (free, via local council)
- Pub/Bar/Nightclub → premises licence advisory (Licensing Act 2003, fee by rateable value band)
- Professional practice → professional body registration advisory

### 4. Location

```
Options:
  - London (any borough)
  - Outside London (rest of England & Wales)
```

If London selected, ask: Which borough? (optional — affects advisory detail)
```
  - City of London
  - Inner London boroughs (Camden, Hackney, Islington, Kensington & Chelsea, Lambeth, Lewisham, Newham, Southwark, Tower Hamlets, Wandsworth, Westminster, etc.)
  - Outer London boroughs (Barnet, Bexley, Brent, Bromley, Croydon, Ealing, Enfield, Greenwich, Haringey, Harrow, Havering, Hillingdon, Hounslow, Kingston, Merton, Redbridge, Richmond, Sutton, Waltham Forest)
```

Location affects:
- Premises licence fee band (based on rateable value — London commercial premises typically Band C–E)
- Advisory notes about London-specific costs (higher rents, business rates)

### 5. Will the business need a premises licence? (alcohol / regulated entertainment / late-night refreshment)

Toggle: Yes / No / Not sure

If Yes: show premises licence fee bands (Licensing Act 2003, GOV.UK)

### 6. Will the business sell food or drink?

Toggle: Yes / No

If Yes: show food business registration advisory (free, must register at least 28 days before opening with local council)

---

## Official Fee Schedule (Factual, Source-Anchored)

All values from official UK government sources. These are the hardcoded values in the calculation logic.

| Item | Fee | Source |
|---|---|---|
| Private Limited Company incorporation (online) | £100 | Companies House |
| LLP incorporation (online) | £100 | Companies House |
| Sole trader / partnership registration | £0 | HMRC (Self Assessment registration, free) |
| Confirmation Statement (Ltd / LLP, first in 12-month period, online) | £50 | Companies House |
| VAT registration | £0 | HMRC |
| HMRC Self Assessment registration (sole trader / partner) | £0 | HMRC |
| Food business registration (local council) | £0 | Food Standards Agency / local council |
| Premises licence — Band A (rateable value up to £4,300) | £100 application + £70/yr | GOV.UK Licensing Act 2003 |
| Premises licence — Band B (£4,301–£33,000) | £190 application + £180/yr | GOV.UK Licensing Act 2003 |
| Premises licence — Band C (£33,001–£87,000) | £315 application + £295/yr | GOV.UK Licensing Act 2003 |
| Premises licence — Band D (£87,001–£125,000) | £450 application + £320/yr | GOV.UK Licensing Act 2003 |
| Premises licence — Band E (£125,001+) | £635 application + £350/yr | GOV.UK Licensing Act 2003 |
| Personal licence (for DPS — Designated Premises Supervisor) | £37 | GOV.UK Licensing Act 2003 |

**Note on Confirmation Statement:** The £50 fee covers the first statement in a 12-month payment period. Subsequent statements in the same period are free. This is an annual recurring cost, shown as a compliance note.

**Note on premises licence bands:** London commercial premises typically fall in Band B–D. The tool shows Band B as the default for small London businesses and lets users select their band.

---

## Calculation Logic (`src/lib/tools/london-startup-cost.ts`)

### Types

```typescript
export type UKBusinessStructure = 'sole_trader' | 'limited_company' | 'llp' | 'partnership';
export type UKLocation = 'london' | 'outside_london';
export type UKIndustry =
  | 'ecommerce'
  | 'restaurant'
  | 'pub_bar'
  | 'salon'
  | 'contractor'
  | 'retail'
  | 'consulting'
  | 'professional'
  | 'other';
export type VATStatus = 'mandatory' | 'voluntary' | 'none';
export type PremisesLicenceBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'none';

export interface LondonStartupInputs {
  structure: UKBusinessStructure;
  location: UKLocation;
  industry: UKIndustry;
  vatStatus: VATStatus;
  needsPremisesLicence: boolean;
  premisesLicenceBand: PremisesLicenceBand;
  sellsFood: boolean;
  optionalCosts: UKOptionalStartupCosts;
}

export interface UKOptionalStartupCosts {
  insurance: number;
  rentDeposit: number;
  equipment: number;
  inventory: number;
  websiteDomain: number;
  marketingLaunch: number;
  accountingLegal: number;
  payrollSetup: number;
  other: number;
}

export interface UKGovernmentCostBreakdown {
  companiesHouseIncorporation: number;  // £100 or £0
  confirmationStatement: number;        // £50 or £0
  vatRegistration: number;              // always £0
  hmrcSelfAssessment: number;           // always £0
  foodBusinessRegistration: number;     // always £0
  premisesLicenceApplication: number;   // £100–£635 or £0
  personalLicence: number;              // £37 or £0
  subtotal: number;
}

export interface LondonStartupCostResult {
  governmentCosts: UKGovernmentCostBreakdown;
  optionalCostsTotal: number;
  totalMinimum: number;    // government costs only
  totalLikely: number;     // government + optional
  totalUpper: number;      // likely × 1.2 rounded
  ongoingComplianceNote: string;
  licenceAdvisory: string[];
}
```

### Core Functions

```typescript
// Companies House incorporation: £100 for Ltd/LLP, £0 for sole trader/partnership
export function getIncorporationFee(structure: UKBusinessStructure): number

// Confirmation Statement: £50 for Ltd/LLP, £0 for sole trader/partnership
export function getConfirmationStatementFee(structure: UKBusinessStructure): number

// Premises licence application fee by band (Licensing Act 2003, GOV.UK)
export function getPremisesLicenceFee(band: PremisesLicenceBand): number

// Assembles full government cost breakdown
export function calculateUKGovernmentCosts(inputs: LondonStartupInputs): UKGovernmentCostBreakdown

// Sums optional costs (negative values treated as 0)
export function sumUKOptionalCosts(costs: UKOptionalStartupCosts): number

// Returns industry + location specific advisory messages
export function getUKLicenceAdvisory(industry: UKIndustry, location: UKLocation): string[]

// Main calculation function
export function calculateLondonStartupCost(inputs: LondonStartupInputs): LondonStartupCostResult
```

### Named Constants (source-anchored)

```typescript
// Companies House fee schedule: https://www.gov.uk/government/publications/companies-house-fees
export const CH_INCORPORATION_FEE_ONLINE = 100;       // Ltd or LLP, online
export const CH_CONFIRMATION_STATEMENT_FEE = 50;      // first statement in 12-month period, online

// Licensing Act 2003 premises licence fees: https://www.gov.uk/government/publications/alcohol-licensing-fee-levels
export const PREMISES_LICENCE_FEES: Record<PremisesLicenceBand, number> = {
  A: 100,   // rateable value up to £4,300
  B: 190,   // £4,301–£33,000
  C: 315,   // £33,001–£87,000
  D: 450,   // £87,001–£125,000
  E: 635,   // £125,001+
  none: 0,
};

// Personal licence (Designated Premises Supervisor): £37
export const PERSONAL_LICENCE_FEE = 37;

// All HMRC registrations are free
export const HMRC_VAT_REGISTRATION_FEE = 0;
export const HMRC_SELF_ASSESSMENT_FEE = 0;

// Food business registration is free (local council)
export const FOOD_BUSINESS_REGISTRATION_FEE = 0;
```

---

## Output Layout

### Box A — Required Government Setup Costs

| Line item | Fee | Tag |
|---|---|---|
| Companies House incorporation (online) | £100 | Required by law |
| Confirmation Statement (annual) | £50 | Required by law |
| HMRC Self Assessment registration | £0 | Required by law |
| VAT registration | £0 | Required if turnover > £90,000 |
| Food business registration | £0 | Required if selling food |
| Premises licence application (Band B) | £190 | Required by law |
| Personal licence (DPS) | £37 | Required by law |
| **Subtotal** | **£XXX** | |

### Box B — Likely Launch Costs

| Line item | Amount | Tag |
|---|---|---|
| Insurance | £[user] | Optional but common |
| Rent / deposit | £[user] | Optional but common |
| Equipment | £[user] | Optional but common |
| Inventory | £[user] | Optional but common |
| Website / domain | £[user] | Optional but common |
| Marketing / launch | £[user] | Optional but common |
| Accounting / legal | £[user] | Optional but common |
| Payroll setup | £[user] | Optional but common |
| Other | £[user] | |
| **Subtotal** | **£XXX** | |

### Box C — Total Startup Estimate

```
Minimum estimate:   £XXX   (government fees only)
Likely estimate:    £XXX   (government + your launch costs)
Upper estimate:     £XXX   (likely + 20% buffer)
```

Ongoing compliance note (separate, not in total):
> Confirmation Statement: £50 per year for Ltd companies and LLPs (Companies House)
> Annual premises licence charge: £70–£350/yr depending on band (GOV.UK)

---

## UI / UX Design

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Your Business Setup                            │
│  [Structure] [VAT status] [Industry] [Location]        │
│  [Premises licence toggle + band selector]             │
│  [Food/drink toggle]                                    │
│                                                         │
│  Step 2: Optional Launch Costs                          │
│  [Insurance] [Rent] [Equipment] [Inventory]            │
│  [Website] [Marketing] [Accounting] [Other]            │
├─────────────────────────────────────────────────────────┤
│  Results                                                │
│  ┌──────────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ A. Gov't costs   │ │ B. Launch    │ │ C. Total   │  │
│  │ £XXX             │ │ £XXX         │ │ Min: £XXX  │  │
│  │ [line items]     │ │ [line items] │ │ Likely:£XX │  │
│  └──────────────────┘ └──────────────┘ │ Upper: £XX │  │
│                                        └────────────┘  │
│  Licence advisory block                                 │
│  Ongoing compliance note                                │
└─────────────────────────────────────────────────────────┘
```

### Input Fields

- All numeric inputs: `type="number"`, `min={0}`, currency prefix `£`
- Structure: 4-option button-style radio group
- VAT status: 3-option button group (Mandatory / Voluntary / No)
- Premises licence band: dropdown (A–E) shown only when premises licence toggle is Yes
- All toggles: Yes/No button pairs

---

## SEO Design

### Target Keywords

Primary: `london business startup cost calculator`, `cost to start a business in london`
Secondary: `UK limited company setup cost`, `companies house registration cost`, `london business registration fees`
Long-tail: `how much does it cost to start a limited company in the UK`, `london premises licence cost`, `UK sole trader registration cost`

### Metadata

```
title: "London Business Startup Cost Calculator | Companies House, HMRC & Launch Costs"
description: "Free calculator for London and UK business startup costs. Includes official Companies House fees (£100 Ltd), HMRC registrations, premises licence fees, and optional launch costs."
canonical: /finance/london-business-startup-cost-calculator
```

### JSON-LD Schemas

1. `WebApplication` — calculator tool
2. `BreadcrumbList` — Home > Finance > London Business Startup Cost Calculator
3. `FAQPage` — 6 factual Q&As

### E-E-A-T Signals

- All government fees cite official sources inline (Companies House, HMRC, GOV.UK)
- "Last verified" date shown on fee schedule section
- Disclaimer: "This tool provides estimates based on official published fees. Consult a qualified accountant or solicitor for advice specific to your situation."
- No inflated or fabricated fee values

---

## Content Sections (page.tsx)

1. Breadcrumb nav
2. H1 + subtitle + intro paragraph
3. Calculator component
4. "Official UK fee schedule" — table with sources and last-verified date
5. "Do I need a premises licence?" — factual explainer with GOV.UK link
6. "Food business registration in the UK" — factual explainer
7. FAQ section (6 questions)
8. Related tools section

### FAQ Questions

1. How much does it cost to register a limited company in the UK?
2. Does a sole trader need to register with Companies House?
3. What is the VAT registration threshold in the UK?
4. Do I need a premises licence for my London business?
5. How much does a premises licence cost in London?
6. What ongoing fees do UK limited companies pay?

---

## Sources

- Companies House fees: https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees
- HMRC Self Assessment: https://www.gov.uk/register-for-self-assessment
- HMRC VAT registration: https://www.gov.uk/vat-registration
- Premises licence fees (Licensing Act 2003): https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels
- Food business registration: https://www.food.gov.uk/business-guidance/register-a-food-business
- Personal licence: https://www.gov.uk/personal-licence

---

## Correctness Properties

1. `companiesHouseIncorporation` = £100 for Ltd/LLP; £0 for sole_trader/partnership
2. `confirmationStatement` = £50 for Ltd/LLP; £0 for sole_trader/partnership
3. `vatRegistration` = always £0
4. `hmrcSelfAssessment` = always £0
5. `foodBusinessRegistration` = always £0
6. `premisesLicenceApplication` = 0 when needsPremisesLicence is false; otherwise PREMISES_LICENCE_FEES[band]
7. `totalMinimum` = `governmentCosts.subtotal` only
8. `totalLikely` = `governmentCosts.subtotal + optionalCostsTotal`
9. `totalUpper` = `Math.round(totalLikely * 1.2)`
10. Confirmation Statement (£50/yr) and annual premises licence charge are never added to startup total — shown as compliance notes only
11. All inputs default to 0 when empty; no negative values accepted
