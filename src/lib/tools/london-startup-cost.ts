// London / UK Business Startup Cost Calculator — Pure Calculation Logic
// All fee values sourced from official UK government publications.

// ---------------------------------------------------------------------------
// Named constants (source-anchored)
// ---------------------------------------------------------------------------

/** Companies House fee schedule: https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees */
export const CH_INCORPORATION_FEE_ONLINE = 100; // Ltd or LLP, online

/** Companies House fee schedule: first Confirmation Statement in a 12-month period, online */
export const CH_CONFIRMATION_STATEMENT_FEE = 50;

/** Licensing Act 2003 premises licence application fees: https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels */
export const PREMISES_LICENCE_FEES: Record<PremisesLicenceBand, number> = {
    A: 100,  // rateable value up to £4,300
    B: 190,  // £4,301–£33,000
    C: 315,  // £33,001–£87,000
    D: 450,  // £87,001–£125,000
    E: 635,  // £125,001+
    none: 0,
};

/** Personal licence (Designated Premises Supervisor): https://www.gov.uk/personal-licence */
export const PERSONAL_LICENCE_FEE = 37;

/** HMRC VAT registration is free: https://www.gov.uk/vat-registration */
export const HMRC_VAT_REGISTRATION_FEE = 0;

/** HMRC Self Assessment registration is free: https://www.gov.uk/register-for-self-assessment */
export const HMRC_SELF_ASSESSMENT_FEE = 0;

/** Food business registration is free (local council): https://www.food.gov.uk/business-guidance/register-a-food-business */
export const FOOD_BUSINESS_REGISTRATION_FEE = 0;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
    companiesHouseIncorporation: number; // £100 or £0
    confirmationStatement: number;       // £50 or £0
    vatRegistration: number;             // always £0
    hmrcSelfAssessment: number;          // always £0
    foodBusinessRegistration: number;    // always £0
    premisesLicenceApplication: number;  // £100–£635 or £0
    personalLicence: number;             // £37 or £0
    subtotal: number;
}

export interface LondonStartupCostResult {
    governmentCosts: UKGovernmentCostBreakdown;
    optionalCostsTotal: number;
    totalMinimum: number;  // government costs only
    totalLikely: number;   // government + optional
    totalUpper: number;    // likely × 1.2 rounded
    ongoingComplianceNote: string;
    licenceAdvisory: string[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the Companies House incorporation fee.
 * £100 for Ltd / LLP (online); £0 for sole trader / partnership.
 * Source: https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees
 */
export function getIncorporationFee(structure: UKBusinessStructure): number {
    switch (structure) {
        case 'limited_company':
        case 'llp':
            return CH_INCORPORATION_FEE_ONLINE;
        case 'sole_trader':
        case 'partnership':
            return 0;
    }
}

/**
 * Returns the Confirmation Statement fee.
 * £50 for Ltd / LLP (first in 12-month period, online); £0 for sole trader / partnership.
 * Source: Companies House fee schedule.
 */
export function getConfirmationStatementFee(structure: UKBusinessStructure): number {
    switch (structure) {
        case 'limited_company':
        case 'llp':
            return CH_CONFIRMATION_STATEMENT_FEE;
        case 'sole_trader':
        case 'partnership':
            return 0;
    }
}

/**
 * Returns the premises licence application fee for the given band.
 * Source: Licensing Act 2003, GOV.UK.
 */
export function getPremisesLicenceFee(band: PremisesLicenceBand): number {
    return PREMISES_LICENCE_FEES[band];
}

/**
 * Assembles the full UK government cost breakdown from the given inputs.
 *
 * Rules:
 * - vatRegistration, hmrcSelfAssessment, foodBusinessRegistration are always £0
 * - premisesLicenceApplication = 0 when needsPremisesLicence is false
 * - personalLicence = £37 only when needsPremisesLicence is true AND industry is 'pub_bar'
 * - Confirmation Statement annual fee is NOT added to startup total (compliance note only)
 */
export function calculateUKGovernmentCosts(inputs: LondonStartupInputs): UKGovernmentCostBreakdown {
    const companiesHouseIncorporation = getIncorporationFee(inputs.structure);
    const confirmationStatement = getConfirmationStatementFee(inputs.structure);
    const vatRegistration = HMRC_VAT_REGISTRATION_FEE;       // always £0
    const hmrcSelfAssessment = HMRC_SELF_ASSESSMENT_FEE;     // always £0
    const foodBusinessRegistration = FOOD_BUSINESS_REGISTRATION_FEE; // always £0

    const premisesLicenceApplication = inputs.needsPremisesLicence
        ? getPremisesLicenceFee(inputs.premisesLicenceBand)
        : 0;

    const personalLicence =
        inputs.needsPremisesLicence && inputs.industry === 'pub_bar'
            ? PERSONAL_LICENCE_FEE
            : 0;

    const subtotal =
        companiesHouseIncorporation +
        confirmationStatement +
        premisesLicenceApplication +
        personalLicence;
    // vatRegistration, hmrcSelfAssessment, foodBusinessRegistration are £0 — no effect on subtotal

    return {
        companiesHouseIncorporation,
        confirmationStatement,
        vatRegistration,
        hmrcSelfAssessment,
        foodBusinessRegistration,
        premisesLicenceApplication,
        personalLicence,
        subtotal,
    };
}

/**
 * Sums all optional cost fields. Negative values are treated as 0.
 */
export function sumUKOptionalCosts(costs: UKOptionalStartupCosts): number {
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
 * Returns industry- and location-specific licence advisory messages.
 * Always appends a link to GOV.UK's licence finder.
 */
export function getUKLicenceAdvisory(industry: UKIndustry, location: UKLocation): string[] {
    const advisories: string[] = [];

    if (industry === 'restaurant') {
        advisories.push(
            'Food businesses must register with their local council at least 28 days before opening. Registration is free and cannot be refused. (Food Standards Agency)',
        );
    }

    if (industry === 'pub_bar') {
        advisories.push(
            'Pubs, bars and nightclubs require a premises licence under the Licensing Act 2003. Fees are based on the rateable value of the premises.',
        );
        advisories.push(
            'A Designated Premises Supervisor (DPS) must hold a personal licence (£37, GOV.UK).',
        );
    }

    if (industry === 'salon') {
        advisories.push(
            'Salons in London may require a special treatment licence from their London borough council.',
        );
    }

    if (industry === 'professional') {
        advisories.push(
            'Professional practices (solicitors, accountants, architects) require registration with their relevant professional body (SRA, ICAEW, ARB, etc.) separate from business registration.',
        );
    }

    // Always append GOV.UK licence finder
    advisories.push(
        "Use GOV.UK's licence finder to identify all licences required for your business: https://www.gov.uk/licence-finder",
    );

    return advisories;
}

/**
 * Assembles the full London/UK startup cost result from the given inputs.
 *
 * - totalMinimum = governmentCosts.subtotal (no optional costs)
 * - totalLikely  = governmentCosts.subtotal + optionalCostsTotal
 * - totalUpper   = Math.round(totalLikely * 1.2)
 *
 * Confirmation Statement (£50/yr) and annual premises licence charge are
 * never added to the startup total — shown as compliance notes only.
 */
export function calculateLondonStartupCost(inputs: LondonStartupInputs): LondonStartupCostResult {
    const governmentCosts = calculateUKGovernmentCosts(inputs);
    const optionalCostsTotal = sumUKOptionalCosts(inputs.optionalCosts);
    const totalLikely = governmentCosts.subtotal + optionalCostsTotal;

    const isIncorporated =
        inputs.structure === 'limited_company' || inputs.structure === 'llp';

    const ongoingComplianceNote = isIncorporated
        ? 'Confirmation Statement: £50 per year (Companies House). Corporation Tax registration required within 3 months of starting to trade (HMRC, free).'
        : 'Self Assessment tax return due by 31 January each year (HMRC).';

    return {
        governmentCosts,
        optionalCostsTotal,
        totalMinimum: governmentCosts.subtotal,
        totalLikely,
        totalUpper: Math.round(totalLikely * 1.2),
        ongoingComplianceNote,
        licenceAdvisory: getUKLicenceAdvisory(inputs.industry, inputs.location),
    };
}

/**
 * Returns a UKOptionalStartupCosts object with all fields set to 0.
 * Useful as a default/initial state for the calculator form.
 */
export function getDefaultUKOptionalCosts(): UKOptionalStartupCosts {
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
