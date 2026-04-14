// New York Business Startup Cost Calculator — Pure Calculation Logic
// All fee values sourced from official NY Department of State and IRS publications.

// ---------------------------------------------------------------------------
// Named constants (source-anchored)
// ---------------------------------------------------------------------------

/** NY DOS fee schedule: https://dos.ny.gov/fees-corporations-and-businesses */
export const NY_LLC_FILING_FEE = 200; // Domestic LLC Articles of Organization

/** NY DOS fee schedule: https://dos.ny.gov/fees-corporations-and-businesses */
export const NY_CORP_FILING_FEE = 125; // Domestic Business Corporation Certificate of Incorporation

/** NY DOS fee schedule: https://dos.ny.gov/fees-corporations-and-businesses */
export const NY_LLC_PUBLICATION_FILING_FEE = 50; // LLC Certificate of Publication

/** NY DOS: assumed name certificate — state portion (LLC & corporation) */
const NY_ASSUMED_NAME_STATE_FEE = 25;

/** NY DOS: assumed name — county fee for NYC counties */
const NY_ASSUMED_NAME_NYC_COUNTY_FEE = 100;

/** NY DOS: assumed name — county fee outside NYC */
const NY_ASSUMED_NAME_OUTSIDE_NYC_COUNTY_FEE = 25;

/** County clerk business certificate — midpoint of typical NY county range (~$25–$35) */
const NY_COUNTY_CLERK_DBA_FEE = 30;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
    /** Derived from entityType, but explicit for clarity */
    isLLC: boolean;
    /** User-entered newspaper publication cost estimate */
    llcPublicationCost: number;
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
    /** $50 fixed — NY DOS Certificate of Publication */
    llcPublicationFiling: number;
    /** User-entered newspaper cost estimate */
    llcNewspaperPublication: number;
    /** Always $0 — NY Tax & Finance */
    salesTaxRegistration: number;
    /** Always $0 — IRS free online application */
    einRegistration: number;
    subtotal: number;
}

export interface NYStartupCostResult {
    governmentCosts: GovernmentCostBreakdown;
    optionalCostsTotal: number;
    /** Government costs only */
    totalMinimum: number;
    /** Government + optional costs as entered */
    totalLikely: number;
    /** totalLikely × 1.2, rounded to nearest dollar */
    totalUpper: number;
    /** Biennial statement reminder — NOT included in any total */
    ongoingComplianceNote: string;
    /** Industry-specific advisory messages */
    licenseAdvisory: string[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the NY Department of State entity filing fee for the given entity type.
 * Source: https://dos.ny.gov/fees-corporations-and-businesses
 */
export function getEntityFilingFee(type: EntityType): number {
    switch (type) {
        case 'llc': return NY_LLC_FILING_FEE;   // $200
        case 'corporation': return NY_CORP_FILING_FEE;  // $125
        case 'sole_prop': return 0;                   // No state filing required
        case 'partnership': return 0;                   // No state filing required
    }
}

/**
 * Returns the DBA / assumed name filing fee.
 *
 * - sole_prop / partnership: county clerk business certificate (~$25–$35, midpoint $30)
 * - LLC / corporation: $25 state fee + county fee
 *   - NYC county: $100
 *   - Outside NYC: $25
 *
 * Source: NY DOS fee schedule; county clerk fees vary — verify with your county clerk.
 */
export function getDBAFee(
    type: EntityType,
    location: NYLocation,
    borough?: NYCBorough,
): number {
    if (type === 'sole_prop' || type === 'partnership') {
        // County clerk business certificate — midpoint of typical NY county range
        // Note: shown as "~$25–$35, verify with your county clerk"
        return NY_COUNTY_CLERK_DBA_FEE;
    }

    // LLC or Corporation: $25 state assumed name certificate + county fee
    const stateFee = NY_ASSUMED_NAME_STATE_FEE;
    if (location === 'nyc') {
        return stateFee + NY_ASSUMED_NAME_NYC_COUNTY_FEE; // $25 + $100 = $125
    }
    return stateFee + NY_ASSUMED_NAME_OUTSIDE_NYC_COUNTY_FEE; // $25 + $25 = $50
}

/**
 * Calculates the full government cost breakdown from the given inputs.
 * EIN and sales tax registration are always $0.
 * LLC publication filing is $50 fixed (NY_LLC_PUBLICATION_FILING_FEE) when entity is LLC.
 * Biennial statement ($9) is NOT included — shown as a compliance note only.
 */
export function calculateGovernmentCosts(inputs: NYStartupInputs): GovernmentCostBreakdown {
    const entityFiling = getEntityFilingFee(inputs.entityType);
    const dbaFiling = inputs.usesDBA
        ? getDBAFee(inputs.entityType, inputs.location, inputs.nycBorough)
        : 0;
    const llcPublicationFiling =
        inputs.entityType === 'llc' ? NY_LLC_PUBLICATION_FILING_FEE : 0;
    const llcNewspaperPublication =
        inputs.entityType === 'llc' ? Math.max(0, inputs.llcPublicationCost) : 0;
    const salesTaxRegistration = 0; // NY Tax & Finance — always free
    const einRegistration = 0;      // IRS — always free

    const subtotal =
        entityFiling +
        dbaFiling +
        llcPublicationFiling +
        llcNewspaperPublication;
    // Note: salesTaxRegistration and einRegistration are $0 and do not affect subtotal

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

/**
 * Sums all optional cost fields. Negative values are treated as 0.
 */
export function sumOptionalCosts(costs: OptionalStartupCosts): number {
    return (
        Math.max(0, costs.insurance) +
        Math.max(0, costs.rentDeposit) +
        Math.max(0, costs.equipment) +
        Math.max(0, costs.inventory) +
        Math.max(0, costs.websiteDomain) +
        Math.max(0, costs.marketingLaunch) +
        Math.max(0, costs.accountingLegal) +
        Math.max(0, costs.payrollSetup) +
        Math.max(0, costs.other)
    );
}

/**
 * Returns industry-specific license advisory messages.
 * Always appends a link to NY Business Express.
 * NYC-specific advisories are included when location === 'nyc'.
 */
export function getLicenseAdvisory(industry: Industry, location: NYLocation): string[] {
    const advisories: string[] = [];

    if (industry === 'restaurant') {
        advisories.push(
            'Food service businesses require a NY State food service establishment permit.',
        );
        if (location === 'nyc') {
            advisories.push(
                'NYC food businesses also require a NYC Health Department permit and a Certificate of Occupancy. A sidewalk café license may also apply.',
            );
        }
    }

    if (industry === 'salon') {
        advisories.push(
            'Salons require a NY State cosmetology establishment license from the Department of State.',
        );
    }

    if (industry === 'contractor') {
        if (location === 'nyc') {
            advisories.push(
                'Home improvement contractors in NYC must register with the NYC Department of Consumer and Worker Protection.',
            );
        }
        advisories.push(
            'Electricians and plumbers require state licensing separate from business registration.',
        );
    }

    if (industry === 'street_vendor') {
        advisories.push(
            'NYC street vendors need a NYC street vendor license.',
        );
        if (location === 'nyc') {
            advisories.push(
                'Food street vendors in NYC also require a NYC mobile food vending permit.',
            );
        }
    }

    if (industry === 'professional') {
        advisories.push(
            'Professional practices (law, medicine, accounting) require state professional licensing separate from business registration.',
        );
    }

    // Always append NY Business Express link
    advisories.push(
        'Use NY Business Express (businessexpress.ny.gov) to identify all required licenses and permits for your specific business.',
    );

    return advisories;
}

/**
 * Assembles the full NY startup cost result from the given inputs.
 *
 * - totalMinimum = governmentCosts.subtotal
 * - totalLikely  = governmentCosts.subtotal + optionalCostsTotal
 * - totalUpper   = Math.round(totalLikely * 1.2)
 *
 * The biennial statement ($9) is shown as a compliance note only — never added to any total.
 */
export function calculateNYStartupCost(inputs: NYStartupInputs): NYStartupCostResult {
    const governmentCosts = calculateGovernmentCosts(inputs);
    const optionalCostsTotal = sumOptionalCosts(inputs.optionalCosts);
    const totalLikely = governmentCosts.subtotal + optionalCostsTotal;

    return {
        governmentCosts,
        optionalCostsTotal,
        totalMinimum: governmentCosts.subtotal,
        totalLikely,
        totalUpper: Math.round(totalLikely * 1.2),
        // Biennial statement: NOT included in any total — compliance reminder only
        // Source: NY DOS — https://dos.ny.gov/fees-corporations-and-businesses
        ongoingComplianceNote:
            'Biennial statement: $9 every 2 years for LLCs and corporations (NY Department of State)',
        licenseAdvisory: getLicenseAdvisory(inputs.industry, inputs.location),
    };
}

/**
 * Returns an OptionalStartupCosts object with all fields set to 0.
 * Useful as a default/initial state for the calculator form.
 */
export function getDefaultOptionalCosts(): OptionalStartupCosts {
    return {
        insurance: 0,
        rentDeposit: 0,
        equipment: 0,
        inventory: 0,
        websiteDomain: 0,
        marketingLaunch: 0,
        accountingLegal: 0,
        payrollSetup: 0,
        other: 0,
    };
}
