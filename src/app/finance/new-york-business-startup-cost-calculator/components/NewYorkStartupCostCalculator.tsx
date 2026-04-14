"use client";

import { useMemo, useState } from "react";

import {
    type EntityType,
    type Industry,
    type NYCBorough,
    type NYLocation,
    type OptionalStartupCosts,
    NY_LLC_PUBLICATION_FILING_FEE,
    calculateNYStartupCost,
    getDefaultOptionalCosts,
} from "@/lib/tools/ny-startup-cost";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function optionalNum(value: string): number {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function fmt(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

// ---------------------------------------------------------------------------
// Badge chips
// ---------------------------------------------------------------------------

type BadgeVariant = "required" | "taxable" | "mayapply" | "optional" | "free";

function Badge({ variant }: { variant: BadgeVariant }) {
    const map: Record<BadgeVariant, { label: string; cls: string }> = {
        required: {
            label: "Required by law",
            cls: "bg-primary/10 text-primary",
        },
        taxable: {
            label: "Required if selling taxable goods",
            cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        },
        mayapply: {
            label: "May apply",
            cls: "bg-muted text-muted-foreground",
        },
        optional: {
            label: "Optional but common",
            cls: "bg-muted text-muted-foreground",
        },
        free: {
            label: "Free",
            cls: "bg-primary/10 text-primary",
        },
    };
    const { label, cls } = map[variant];
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Toggle (Yes / No button pair)
// ---------------------------------------------------------------------------

function YesNoToggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    const base =
        "flex-1 rounded-[1rem] border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary";
    const active = "border-primary bg-primary text-primary-foreground";
    const inactive = "border-border bg-background text-foreground hover:bg-muted";

    return (
        <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className="flex gap-2">
                <button
                    type="button"
                    className={`${base} ${value ? active : inactive}`}
                    onClick={() => onChange(true)}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className={`${base} ${!value ? active : inactive}`}
                    onClick={() => onChange(false)}
                >
                    No
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Line item row
// ---------------------------------------------------------------------------

function LineItem({
    label,
    amount,
    badge,
    note,
}: {
    label: string;
    amount: number;
    badge?: BadgeVariant;
    note?: string;
}) {
    return (
        <div className="flex items-start justify-between gap-3 py-2 text-sm">
            <div className="min-w-0 flex-1">
                <span className="text-foreground">{label}</span>
                {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
                {badge && (
                    <div className="mt-1">
                        <Badge variant={badge} />
                    </div>
                )}
            </div>
            <span className="shrink-0 font-medium text-foreground">{fmt(amount)}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NewYorkStartupCostCalculator() {
    // Step 1 state
    const [entityType, setEntityType] = useState<EntityType>("llc");
    const [location, setLocation] = useState<NYLocation>("outside_nyc");
    const [nycBorough, setNycBorough] = useState<NYCBorough | undefined>(undefined);
    const [usesDBA, setUsesDBA] = useState(false);
    const [sellsTaxableGoods, setSellsTaxableGoods] = useState(false);
    const [industry, setIndustry] = useState<Industry>("consulting");
    const [llcPublicationCost, setLlcPublicationCost] = useState<number | "">(
        ""
    );

    // Step 2 state
    const [optionalCosts, setOptionalCosts] = useState<OptionalStartupCosts>(
        getDefaultOptionalCosts()
    );

    // Derived inputs for calculation
    const result = useMemo(
        () =>
            calculateNYStartupCost({
                entityType,
                usesDBA,
                location,
                nycBorough,
                sellsTaxableGoods,
                isLLC: entityType === "llc",
                llcPublicationCost: llcPublicationCost === "" ? 0 : llcPublicationCost,
                industry,
                optionalCosts,
            }),
        [
            entityType,
            usesDBA,
            location,
            nycBorough,
            sellsTaxableGoods,
            industry,
            llcPublicationCost,
            optionalCosts,
        ]
    );

    function setOptional(key: keyof OptionalStartupCosts, raw: string) {
        setOptionalCosts((prev) => ({ ...prev, [key]: optionalNum(raw) }));
    }

    // ---------------------------------------------------------------------------
    // Entity type options
    // ---------------------------------------------------------------------------

    const entityOptions: { value: EntityType; label: string }[] = [
        { value: "sole_prop", label: "Sole Proprietorship" },
        { value: "llc", label: "LLC" },
        { value: "corporation", label: "Corporation" },
        { value: "partnership", label: "Partnership" },
    ];

    // ---------------------------------------------------------------------------
    // Industry options
    // ---------------------------------------------------------------------------

    const industryOptions: { value: Industry; label: string }[] = [
        { value: "ecommerce", label: "Online store / E-commerce" },
        { value: "restaurant", label: "Restaurant / Food service" },
        { value: "salon", label: "Salon / Beauty" },
        { value: "contractor", label: "Contractor / Home services" },
        { value: "street_vendor", label: "Street vendor" },
        { value: "retail", label: "Retail shop" },
        { value: "consulting", label: "Consulting / Agency" },
        { value: "professional", label: "Professional practice" },
        { value: "other", label: "Other" },
    ];

    // ---------------------------------------------------------------------------
    // Borough options
    // ---------------------------------------------------------------------------

    const boroughOptions: { value: NYCBorough; label: string }[] = [
        { value: "manhattan", label: "Manhattan" },
        { value: "brooklyn", label: "Brooklyn" },
        { value: "queens", label: "Queens" },
        { value: "bronx", label: "The Bronx" },
        { value: "staten_island", label: "Staten Island" },
    ];

    const { governmentCosts } = result;

    return (
        <div className="space-y-6">
            {/* ------------------------------------------------------------------ */}
            {/* Step 1 — Business Setup                                             */}
            {/* ------------------------------------------------------------------ */}
            <section className="tool-frame p-4 sm:p-6">
                <h2 className="mb-5 text-base font-semibold text-foreground">
                    Step 1: Your Business Setup
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Entity type */}
                    <div className="space-y-2 md:col-span-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Business structure
                        </span>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {entityOptions.map((opt) => {
                                const active = entityType === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setEntityType(opt.value)}
                                        className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Location
                        </span>
                        <div className="flex gap-2">
                            {(
                                [
                                    { value: "nyc", label: "New York City" },
                                    { value: "outside_nyc", label: "Outside NYC" },
                                ] as { value: NYLocation; label: string }[]
                            ).map((opt) => {
                                const active = location === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setLocation(opt.value);
                                            if (opt.value === "outside_nyc") setNycBorough(undefined);
                                        }}
                                        className={`flex-1 rounded-[1rem] border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Borough selector — only when NYC */}
                    {location === "nyc" && (
                        <div className="space-y-2">
                            <label
                                htmlFor="borough"
                                className="text-sm font-medium text-muted-foreground"
                            >
                                Borough
                            </label>
                            <select
                                id="borough"
                                value={nycBorough ?? ""}
                                onChange={(e) =>
                                    setNycBorough(
                                        e.target.value ? (e.target.value as NYCBorough) : undefined
                                    )
                                }
                                className={fieldClass}
                            >
                                <option value="">Select borough…</option>
                                {boroughOptions.map((b) => (
                                    <option key={b.value} value={b.value}>
                                        {b.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* DBA toggle */}
                    <div>
                        <YesNoToggle
                            label="Will you use a DBA / assumed name?"
                            value={usesDBA}
                            onChange={setUsesDBA}
                        />
                        {usesDBA && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                {entityType === "sole_prop" || entityType === "partnership"
                                    ? "County clerk business certificate — typically $25–$35. Verify with your county clerk."
                                    : location === "nyc"
                                        ? "Assumed name certificate: $25 state fee + $100 NYC county fee = $125 total."
                                        : "Assumed name certificate: $25 state fee + $25 county fee = $50 total."}
                            </p>
                        )}
                    </div>

                    {/* Taxable sales toggle */}
                    <div>
                        <YesNoToggle
                            label="Will you sell taxable goods or services?"
                            value={sellsTaxableGoods}
                            onChange={setSellsTaxableGoods}
                        />
                        {sellsTaxableGoods && (
                            <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                                Certificate of Authority required before making any taxable
                                sales in New York. Apply through NY Business Express (free).
                            </p>
                        )}
                    </div>

                    {/* Industry */}
                    <div className="space-y-2 md:col-span-2">
                        <label
                            htmlFor="industry"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Industry
                        </label>
                        <select
                            id="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value as Industry)}
                            className={fieldClass}
                        >
                            {industryOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* LLC Publication block */}
                {entityType === "llc" && (
                    <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/40 dark:bg-amber-900/10">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                            LLC Publication Requirement
                        </p>
                        <p className="mt-2 text-xs text-amber-800 dark:text-amber-400">
                            New York requires LLCs to publish a notice of formation in two
                            newspapers designated by the county clerk within{" "}
                            <strong>120 days</strong> of formation, then file a Certificate of
                            Publication with the Department of State. Failure to comply{" "}
                            <strong>suspends the LLC&apos;s authority to carry on business</strong>.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-xs font-medium text-amber-800 dark:text-amber-400">
                                    Certificate of Publication filing fee
                                </span>
                                <input
                                    type="number"
                                    value={NY_LLC_PUBLICATION_FILING_FEE}
                                    readOnly
                                    disabled
                                    className={`${fieldClass} cursor-not-allowed opacity-60`}
                                />
                            </label>

                            <label className="space-y-2">
                                <span className="text-xs font-medium text-amber-800 dark:text-amber-400">
                                    Estimated newspaper publication cost
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 500"
                                    value={llcPublicationCost}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        if (raw === "") {
                                            setLlcPublicationCost("");
                                        } else {
                                            const n = Number(raw);
                                            setLlcPublicationCost(
                                                Number.isFinite(n) && n >= 0 ? n : llcPublicationCost
                                            );
                                        }
                                    }}
                                    className={fieldClass}
                                />
                                <p className="text-xs text-amber-700 dark:text-amber-500">
                                    Varies by county. Manhattan typically $1,000–$2,000+. Some
                                    upstate counties under $200.
                                </p>
                            </label>
                        </div>
                    </div>
                )}
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* Step 2 — Optional Launch Costs                                      */}
            {/* ------------------------------------------------------------------ */}
            <section className="tool-frame p-4 sm:p-6">
                <h2 className="mb-5 text-base font-semibold text-foreground">
                    Step 2: Optional Launch Costs
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                    Enter your estimated costs below. Leave blank or enter 0 if not
                    applicable.
                </p>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                        [
                            { key: "insurance", label: "Insurance" },
                            { key: "rentDeposit", label: "Rent / security deposit" },
                            { key: "equipment", label: "Equipment" },
                            { key: "inventory", label: "Inventory" },
                            { key: "websiteDomain", label: "Website / domain" },
                            { key: "marketingLaunch", label: "Marketing / launch budget" },
                            { key: "accountingLegal", label: "Accounting / legal help" },
                            { key: "payrollSetup", label: "Payroll setup" },
                            { key: "other", label: "Other" },
                        ] as { key: keyof OptionalStartupCosts; label: string }[]
                    ).map(({ key, label }) => (
                        <label key={key} className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {label}
                            </span>
                            <input
                                type="number"
                                min={0}
                                step="1"
                                placeholder="0"
                                value={optionalCosts[key] === 0 ? "" : optionalCosts[key]}
                                onChange={(e) => setOptional(key, e.target.value)}
                                className={fieldClass}
                            />
                        </label>
                    ))}
                </div>
            </section>

            {/* ------------------------------------------------------------------ */}
            {/* Results                                                             */}
            {/* ------------------------------------------------------------------ */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Box A — Government costs */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        A. Required Government Costs
                    </p>

                    <div className="mt-4 divide-y divide-border">
                        {/* Entity filing — only show if > 0 or always for context */}
                        {governmentCosts.entityFiling > 0 && (
                            <LineItem
                                label={
                                    entityType === "llc"
                                        ? "LLC formation (Articles of Organization)"
                                        : "Corporation formation (Certificate of Incorporation)"
                                }
                                amount={governmentCosts.entityFiling}
                                badge="required"
                                note="NY Department of State"
                            />
                        )}
                        {(entityType === "sole_prop" || entityType === "partnership") && (
                            <LineItem
                                label="Entity filing"
                                amount={0}
                                badge="required"
                                note="No state filing required for sole proprietorships or partnerships"
                            />
                        )}

                        {/* DBA */}
                        {usesDBA && governmentCosts.dbaFiling > 0 && (
                            <LineItem
                                label={
                                    entityType === "sole_prop" || entityType === "partnership"
                                        ? "DBA / business certificate (county clerk)"
                                        : "Assumed name certificate"
                                }
                                amount={governmentCosts.dbaFiling}
                                badge="required"
                                note={
                                    entityType === "sole_prop" || entityType === "partnership"
                                        ? "Verify exact fee with your county clerk"
                                        : "NY DOS state fee + county fee"
                                }
                            />
                        )}

                        {/* LLC publication */}
                        {entityType === "llc" && (
                            <>
                                <LineItem
                                    label="Certificate of Publication (NY DOS)"
                                    amount={governmentCosts.llcPublicationFiling}
                                    badge="required"
                                />
                                <LineItem
                                    label="Newspaper publication (estimated)"
                                    amount={governmentCosts.llcNewspaperPublication}
                                    badge="required"
                                    note="Varies by county — enter your estimate above"
                                />
                            </>
                        )}

                        {/* EIN */}
                        <LineItem
                            label="Employer Identification Number (EIN)"
                            amount={governmentCosts.einRegistration}
                            badge="required"
                            note="IRS — free online application"
                        />

                        {/* Sales tax */}
                        {sellsTaxableGoods && (
                            <LineItem
                                label="Sales tax Certificate of Authority"
                                amount={governmentCosts.salesTaxRegistration}
                                badge="taxable"
                                note="NY Tax & Finance — free registration"
                            />
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{fmt(governmentCosts.subtotal)}</span>
                    </div>
                </div>

                {/* Box B — Optional launch costs */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        B. Optional Launch Costs
                    </p>

                    <div className="mt-4 divide-y divide-border">
                        {(
                            [
                                { key: "insurance", label: "Insurance" },
                                { key: "rentDeposit", label: "Rent / security deposit" },
                                { key: "equipment", label: "Equipment" },
                                { key: "inventory", label: "Inventory" },
                                { key: "websiteDomain", label: "Website / domain" },
                                { key: "marketingLaunch", label: "Marketing / launch" },
                                { key: "accountingLegal", label: "Accounting / legal" },
                                { key: "payrollSetup", label: "Payroll setup" },
                                { key: "other", label: "Other" },
                            ] as { key: keyof OptionalStartupCosts; label: string }[]
                        )
                            .filter((item) => optionalCosts[item.key] > 0)
                            .map(({ key, label }) => (
                                <LineItem
                                    key={key}
                                    label={label}
                                    amount={optionalCosts[key]}
                                    badge="optional"
                                />
                            ))}

                        {result.optionalCostsTotal === 0 && (
                            <p className="py-4 text-xs text-muted-foreground">
                                No optional costs entered. Add amounts in Step 2 above.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{fmt(result.optionalCostsTotal)}</span>
                    </div>
                </div>

                {/* Box C — Total estimate */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        C. Total Startup Estimate
                    </p>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-foreground">Minimum</p>
                                <p className="text-xs text-muted-foreground">
                                    Government fees only
                                </p>
                            </div>
                            <span className="font-semibold text-foreground">
                                {fmt(result.totalMinimum)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-[1rem] bg-primary/10 px-4 py-3 text-sm">
                            <div>
                                <p className="font-semibold text-primary">Likely</p>
                                <p className="text-xs text-primary/70">
                                    Government + your launch costs
                                </p>
                            </div>
                            <span className="text-lg font-bold text-primary">
                                {fmt(result.totalLikely)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-foreground">Upper</p>
                                <p className="text-xs text-muted-foreground">
                                    Likely + 20% buffer
                                </p>
                            </div>
                            <span className="font-semibold text-foreground">
                                {fmt(result.totalUpper)}
                            </span>
                        </div>
                    </div>

                    {/* Ongoing compliance note */}
                    <div className="mt-5 rounded-[1rem] border border-border bg-muted/40 px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">
                            Ongoing compliance (not included above)
                        </p>
                        <p className="mt-1 text-xs text-foreground">
                            {result.ongoingComplianceNote}
                        </p>
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* License advisory block                                              */}
            {/* ------------------------------------------------------------------ */}
            {result.licenseAdvisory.length > 0 && (
                <section className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-sm font-semibold text-foreground">
                        Industry-specific licenses may apply
                    </p>
                    <ul className="mt-3 space-y-2">
                        {result.licenseAdvisory.map((msg, i) => (
                            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                <span className="mt-0.5 shrink-0 text-primary">•</span>
                                <span>{msg}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
