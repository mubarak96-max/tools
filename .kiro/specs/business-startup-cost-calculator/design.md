# New York Business Startup Cost Calculator — Design Document

## Overview

A free, interactive calculator that helps entrepreneurs estimate the real cost of starting a business in New York State. The tool separates **required government fees** (entity filing, DBA, publication, licenses, registrations) from **optional launch costs** (rent, equipment, insurance, marketing), and outputs a minimum / likely / upper cost range.

All government fee values are sourced from official NY Department of State and NY State Tax & Finance publications and must be kept factually accurate.

---

## High-Level Design

### Page Route

```
/finance/new-york-business-startup-cost-calculator
```

### Page Title & Subtitle

```
New York Business Startup Cost Calculator
Estimate your filing, licensing, tax registration, and launch costs in New York
```

### System Architecture

```
/finance/new-york-business-startup-cost-calculator
├── page.tsx                                        ← SEO shell (metadata, JSON-LD, breadcrumbs, FAQ)
└── components/
    └── NewYorkStartupCostCalculator.tsx            ← "use client" multi-step calculator
```

Logic lives in:
```
src/lib/tools/ny-startup-cost.ts    ← pure calculation functions (testable, no UI)
```

### Data Flow

```
Step 1: User answers structure questions
        (entity type, DBA, LLC publication, taxable sales, industry, location)
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
  - Sole Proprietorship
  - LLC (Limited Liability Company)
  - Corporation (C-Corp or S-Corp)
  - Partnership (General)
```

This drives the entity filing fee and the DBA/assumed name path.

### 2. Will the business use a DBA / assumed name?

Toggle: Yes / No

Path logic:
- Sole proprietor or general partnership → county clerk business certificate (fee varies by county; show range $25–$35 for most NY counties, note NYC counties may differ)
- LLC or Corporation → assumed name certificate filed with NY Department of State, $25 state fee + county fees if doing business in a county

### 3. Will the business sell taxable goods or services?

Toggle: Yes / No

If Yes:
- Add: NY sales tax Certificate of Authority registration (no direct fee — $0)
- Show warning: "Required before making any taxable sales in New York. Apply through NY Business Express."

### 4. Industry

```
Options:
  - Online store / E-commerce
  - Restaurant / Food service
  - Salon / Beauty
  - Contractor / Home services
  - Street vendor
  - Retail shop
  - Consulting / Agency
  - Professional practice (law, medicine, accounting)
  - Other
```

Industry selection triggers a "likely licenses" advisory block in the results. The tool does not attempt to enumerate every permit (that is a v2 feature), but it flags that industry-specific licenses exist and links to NY Business Express.

### 5. Location

```
Options:
  - New York City (all 5 boroughs)
  - Outside NYC (rest of New York State)
```

If NYC selected, ask: Which borough?
```
  - Manhattan (New York County)
  - Brooklyn (Kings County)
  - Queens (Queens County)
  - The Bronx (Bronx County)
  - Staten Island (Richmond County)
```

Location affects:
- Assumed name county fees (corporations): $100 per NYC county, $25 per county outside NYC
- DBA business certificate: county clerk fees vary
- NYC-specific licenses (food, vendor, etc.)

### 6. LLC Publication Requirement (shown only if LLC selected)

Informational block, not a toggle — it is mandatory for all NY LLCs:

> New York requires LLCs to publish a notice of formation in two newspapers designated by the county clerk within 120 days of formation, then file a Certificate of Publication with the Department of State. Failure to comply suspends the LLC's authority to carry on business.

Fields shown:
- Certificate of Publication filing fee: **$50** (fixed, official)
- Newspaper publication cost: user-entered estimate (show note: "Varies by county. Manhattan publication costs are typically $1,000–$2,000+. Some upstate counties cost under $200. Check your county clerk's designated newspapers.")

---

## Official Fee Schedule (Factual, Source-Anchored)

All values below are from the NY Department of State fee schedule and NY State Tax & Finance. These are the hardcoded values in the calculation logic.

| Item | Fee | Source |
|---|---|---|
| Domestic LLC formation (Articles of Organization) | $200 | NY DOS |
| Domestic Business Corporation formation (Certificate of Incorporation) | $125 | NY DOS |
| Sole proprietorship entity filing | $0 | NY DOS (no state filing required) |
| General partnership entity filing | $0 | NY DOS (no state filing required) |
| LLC assumed name certificate (state) | $25 | NY DOS |
| Corporation assumed name certificate (state) | $25 | NY DOS |
| Corporation assumed name — county fee (NYC county) | $100 per county | NY DOS |
| Corporation assumed name — county fee (outside NYC) | $25 per county | NY DOS |
| LLC Certificate of Publication | $50 | NY DOS |
| EIN (Employer Identification Number) | $0 | IRS |
| NY Sales Tax Certificate of Authority | $0 | NY Tax & Finance |
| Biennial statement (LLC / Corporation) | $9 | NY DOS |

**Note on biennial statement:** This is a recurring compliance cost, not a startup cost. It is shown in a separate "Ongoing compliance" note in the results, not added to the startup total.

**Note on sole proprietor DBA:** Filed with the county clerk. Fees are set by each county. The tool shows a range of $25–$35 for most NY counties and notes that users should verify with their county clerk.

---

## Calculation Logic (`src/lib/tools/ny-startup-cost.ts`)

### Types

```typescript
export type EntityType = 'sole_prop' | 'llc' | 'corporation' | 'partnership';
export type NYLocation = 'nyc' | 'outside_nyc';
export type NYCBorough = 'manhattan' | 'brooklyn' | 'queens' | 'bronx' | 'staten_island';
export type Industry =
  | 'ecommerce'
  | 'restaurant'
  | 'salon'
  | 'contractor'
  | 'street_vendor'
  | 'retail'
  | 'consulting'
  | 'professional'
  | 'other';

export interface NYStartupInputs {
  entityType: EntityType;
  usesDBA: boolean;
  location: NYLocation;
  nycBorough?: NYCBorough;
  sellsTaxableGoods: boolean;
  isLLC: boolean; // derived from entityType, but explicit for clarity
  llcPublicationCost: number; // user-entered newspaper cost estimate
  industry: Industry;
  optionalCosts: OptionalStartupCosts;
}

export interface OptionalStartupCosts {
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

export interface GovernmentCostBreakdown {
  entityFiling: number;
  dbaFiling: number;
  llcPublicationFiling: number; // $50 fixed
  llcNewspaperPublication: number; // user-entered
  salesTaxRegistration: number; // always $0
  einRegistration: number; // always $0
  subtotal: number;
}

export interface NYStartupCostResult {
  governmentCosts: GovernmentCostBreakdown;
  optionalCostsTotal: number;
  totalMinimum: number;   // government costs only
  totalLikely: number;    // government + optional as entered
  totalUpper: number;     // likely + 20% buffer
  ongoingComplianceNote: string; // biennial statement reminder
  licenseAdvisory: string[]; // industry-specific advisory messages
}
```

### Core Function

```typescript
export function calculateNYStartupCost(inputs: NYStartupInputs): NYStartupCostResult {
  const gov = calculateGovernmentCosts(inputs);
  const optTotal = sumOptionalCosts(inputs.optionalCosts);

  return {
    governmentCosts: gov,
    optionalCostsTotal: optTotal,
    totalMinimum: gov.subtotal,
    totalLikely: gov.subtotal + optTotal,
    totalUpper: Math.round((gov.subtotal + optTotal) * 1.2),
    ongoingComplianceNote: 'Biennial statement: $9 every 2 years (LLCs and corporations)',
    licenseAdvisory: getLicenseAdvisory(inputs.industry, inputs.location),
  };
}

function calculateGovernmentCosts(inputs: NYStartupInputs): GovernmentCostBreakdown {
  const entityFiling = getEntityFilingFee(inputs.entityType);
  const dbaFiling = inputs.usesDBA ? getDBAFee(inputs.entityType, inputs.location, inputs.nycBorough) : 0;
  const llcPublicationFiling = inputs.entityType === 'llc' ? 50 : 0;
  const llcNewspaperPublication = inputs.entityType === 'llc' ? inputs.llcPublicationCost : 0;
  const salesTaxRegistration = 0; // always free
  const einRegistration = 0; // always free

  const subtotal =
    entityFiling + dbaFiling + llcPublicationFiling + llcNewspaperPublication;

  return {
    entityFiling,
    dbaFiling,
    llcPublicationFiling,
    llcNewspaperPublication,
    salesTaxRegistration,
    einRegistration,
    subtotal,
  };
}

function getEntityFilingFee(type: EntityType): number {
  switch (type) {
    case 'llc': return 200;
    case 'corporation': return 125;
    case 'sole_prop': return 0;
    case 'partnership': return 0;
  }
}

function getDBAFee(
  type: EntityType,
  location: NYLocation,
  borough?: NYCBorough
): number {
  if (type === 'sole_prop' || type === 'partnership') {
    // County clerk business certificate — show midpoint of typical range
    return 30; // shown as "~$25–$35, verify with your county clerk"
  }
  // LLC or Corporation: $25 state + county fees
  const stateFee = 25;
  if (location === 'nyc') {
    return stateFee + 100; // $100 per NYC county
  }
  return stateFee + 25; // $25 per county outside NYC
}
```

### License Advisory Logic

```typescript
function getLicenseAdvisory(industry: Industry, location: NYLocation): string[] {
  const advisories: string[] = [];

  if (industry === 'restaurant') {
    advisories.push('Food service businesses require a NY State food service establishment permit and, in NYC, a NYC Health Department permit.');
    advisories.push('NYC food businesses also need a Certificate of Occupancy and may need a sidewalk café license.');
  }
  if (industry === 'salon') {
    advisories.push('Salons require a NY State cosmetology establishment license from the Department of State.');
  }
  if (industry === 'contractor') {
    advisories.push('Home improvement contractors in NYC must register with the NYC Department of Consumer and Worker Protection.');
    advisories.push('Electricians and plumbers require state licensing.');
  }
  if (industry === 'street_vendor') {
    advisories.push('NYC street vendors need a NYC street vendor license and, for food, a NYC mobile food vending permit.');
  }
  if (industry === 'professional') {
    advisories.push('Professional practices (law, medicine, accounting) require state professional licensing separate from business registration.');
  }

  advisories.push('Use NY Business Express (businessexpress.ny.gov) to identify all required licenses and permits for your specific business.');

  return advisories;
}
```

---

## Output Layout

### Box A — Required Government Setup Costs

| Line item | Fee | Tag |
|---|---|---|
| LLC formation (Articles of Organization) | $200 | Required by law |
| Assumed name certificate (state) | $25 | Required by law |
| Assumed name — county fee (NYC) | $100 | Required by law |
| LLC Certificate of Publication | $50 | Required by law |
| LLC newspaper publication | $[user estimate] | Required by law |
| EIN registration | $0 | Required by law |
| Sales tax Certificate of Authority | $0 | Required if selling taxable goods |
| **Subtotal** | **$XXX** | |

### Box B — Likely Launch Costs

| Line item | Amount | Tag |
|---|---|---|
| Insurance | $[user] | Optional but common |
| Rent / security deposit | $[user] | Optional but common |
| Equipment | $[user] | Optional but common |
| Inventory | $[user] | Optional but common |
| Website / domain | $[user] | Optional but common |
| Marketing / launch | $[user] | Optional but common |
| Accounting / legal help | $[user] | Optional but common |
| Payroll setup | $[user] | Optional but common |
| Other | $[user] | |
| **Subtotal** | **$XXX** | |

### Box C — Total Startup Estimate

```
Minimum estimate:   $XXX   (government fees only)
Likely estimate:    $XXX   (government + your launch costs)
Upper estimate:     $XXX   (likely + 20% buffer)
```

Ongoing compliance note (separate, not in total):
> Biennial statement: $9 every 2 years for LLCs and corporations (NY Department of State)

### License Advisory Block

Shown below Box C. Industry-specific messages with links to official sources.

---

## UI / UX Design

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Your Business Setup                            │
│  [Entity type] [DBA toggle] [Location] [Industry]      │
│  [Taxable sales toggle]                                 │
│  ── LLC Publication block (if LLC) ──                   │
│                                                         │
│  Step 2: Optional Launch Costs                          │
│  [Insurance] [Rent/deposit] [Equipment] [Inventory]    │
│  [Website] [Marketing] [Accounting] [Other]            │
├─────────────────────────────────────────────────────────┤
│  Results                                                │
│  ┌──────────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ A. Gov't costs   │ │ B. Launch    │ │ C. Total   │  │
│  │ $XXX             │ │ $XXX         │ │ Min: $XXX  │  │
│  │ [line items]     │ │ [line items] │ │ Likely:$XX │  │
│  └──────────────────┘ └──────────────┘ │ Upper: $XX │  │
│                                        └────────────┘  │
│  License advisory block                                 │
│  Ongoing compliance note                                │
└─────────────────────────────────────────────────────────┘
```

### Mobile

- Accordion sections for Step 1 and Step 2
- Results shown below inputs, stacked vertically
- "Required by law" / "Optional but common" / "May apply" badge chips on each line item

### Input Fields

- All numeric inputs: `type="number"`, `min={0}`, currency prefix `$`
- LLC publication cost: text input with placeholder "e.g. 500" and helper text explaining county variation
- DBA and taxable sales: toggle switches
- Entity type and industry: styled radio group or select

---

## SEO Design

### Target Keywords

Primary: `new york business startup cost calculator`, `cost to start a business in new york`
Secondary: `new york LLC cost`, `NYC business startup costs`, `NY business filing fees`
Long-tail: `how much does it cost to start an LLC in New York`, `New York DBA cost`, `NYC food business startup cost`

### Metadata

```
title: "New York Business Startup Cost Calculator | Filing, Licensing & Launch Costs"
description: "Free calculator for NY business startup costs. Includes official filing fees for LLCs ($200), corporations ($125), DBA, LLC publication, EIN, and sales tax registration — plus optional launch costs."
canonical: /finance/new-york-business-startup-cost-calculator
```

### JSON-LD Schemas

1. `WebApplication` — calculator tool
2. `BreadcrumbList` — Home > Finance > NY Business Startup Cost Calculator
3. `FAQPage` — 6 factual Q&As

### E-E-A-T Signals

- All government fees cite official sources inline (NY DOS, IRS, NY Tax & Finance)
- "Last verified" date shown on fee schedule section
- Disclaimer: "This tool provides estimates based on official published fees. Consult a licensed attorney or accountant for advice specific to your situation."
- No inflated or fabricated fee values — every hardcoded number has a source

---

## Content Sections (page.tsx)

1. Breadcrumb nav
2. H1 + subtitle + intro paragraph
3. Calculator component
4. "Official fee schedule" — table of all hardcoded fees with sources and last-verified date
5. "What the LLC publication requirement means" — factual explainer
6. "Industry-specific licenses in New York" — brief overview linking to NY Business Express
7. FAQ section (6 questions)
8. Related tools section

### FAQ Questions

1. How much does it cost to form an LLC in New York?
2. What is the LLC publication requirement in New York?
3. Do I need to register for sales tax in New York?
4. What is a DBA and how much does it cost in New York?
5. How much does it cost to start a corporation in New York?
6. What ongoing fees do LLCs and corporations pay in New York?

---

## Spin-off SEO Pages (v2)

- `/finance/new-york-llc-cost-calculator`
- `/finance/nyc-business-startup-cost-calculator`
- `/finance/new-york-dba-cost`
- `/finance/new-york-ecommerce-startup-cost`
- `/finance/new-york-food-business-startup-cost`
- `/compare/llc-vs-corporation-cost-new-york`

---

## Sources

All fee values must be verified against these official sources before implementation:

- NY Department of State fee schedule: https://dos.ny.gov/fees-corporations-and-businesses
- NY LLC publication requirement: https://dos.ny.gov/limited-liability-companies-llcs
- NY Sales Tax Certificate of Authority: https://www.tax.ny.gov/bus/st/stidx.htm
- IRS EIN: https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online
- NY Business Express: https://businessexpress.ny.gov
- NYC Business: https://www.nyc.gov/nycbusiness

---

## Correctness Properties

1. `entityFiling` for LLC = exactly $200; for corporation = exactly $125; for sole_prop/partnership = $0
2. `llcPublicationFiling` = $50 if and only if `entityType === 'llc'`; otherwise $0
3. `salesTaxRegistration` = always $0 (free registration)
4. `einRegistration` = always $0 (free from IRS)
5. DBA state fee for LLC/corporation = $25; county fee for NYC = $100; county fee outside NYC = $25
6. `totalMinimum` = `governmentCosts.subtotal` (no optional costs included)
7. `totalLikely` = `governmentCosts.subtotal + optionalCostsTotal`
8. `totalUpper` = `totalLikely * 1.2` (rounded)
9. Biennial statement ($9) is never added to startup total — shown as a note only
10. All inputs default to 0 when empty; no negative values accepted
