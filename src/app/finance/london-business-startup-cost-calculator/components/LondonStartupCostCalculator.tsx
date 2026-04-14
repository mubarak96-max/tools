"use client";

import { useMemo, useState } from "react";

import {
    type UKBusinessStructure,
    type UKIndustry,
    type VATStatus,
    type PremisesLicenceBand,
    calculateLondonStartupCost,
    getDefaultUKOptionalCosts,
    PREMISES_LICENCE_FEES,
} from "@/lib/tools/london-startup-cost";

const ANNUAL_PREMISES_FEES: Record<string, number> = {
    A: 70,
    B: 180,
    C: 295,
    D: 320,
    E: 350,
};

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function parseNum(value: string): number {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function fmt(value: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
    }).format(value);
}

function Badge({ variant }: { variant: "required" | "optional" | "taxable" | "free" }) {
    const map = {
        required: { label: "Required by law", cls: "bg-primary/10 text-primary" },
        optional: { label: "Optional but common", cls: "bg-muted text-muted-foreground" },
        taxable: { label: "Required if turnover > £90k", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
        free: { label: "Free registration", cls: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    };
    const { label, cls } = map[variant];
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

function LineItem({ label, amount, badge }: { label: string; amount: number; badge?: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-3 py-2 text-sm">
            <div className="min-w-0 space-y-1">
                <div className="text-foreground">{label}</div>
                {badge}
            </div>
            <div className="shrink-0 font-medium">{fmt(amount)}</div>
        </div>
    );
}

function ToggleGroup({
    options,
    value,
    onChange,
}: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 rounded-[1rem] border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${value === opt.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

const OPTIONAL_COST_FIELDS: { key: keyof ReturnType<typeof getDefaultUKOptionalCosts>; label: string }[] = [
    { key: "insurance", label: "Insurance" },
    { key: "rentDeposit", label: "Rent / Deposit" },
    { key: "equipment", label: "Equipment" },
    { key: "inventory", label: "Initial Inventory" },
    { key: "websiteDomain", label: "Website / Domain" },
    { key: "marketingLaunch", label: "Marketing / Launch" },
    { key: "accountingLegal", label: "Accounting / Legal" },
    { key: "payrollSetup", label: "Payroll Setup" },
    { key: "other", label: "Other" },
];

const OPTIONAL_COST_LABELS: Record<string, string> = {
    insurance: "Insurance",
    rentDeposit: "Rent / Deposit",
    equipment: "Equipment",
    inventory: "Initial Inventory",
    websiteDomain: "Website / Domain",
    marketingLaunch: "Marketing / Launch",
    accountingLegal: "Accounting / Legal",
    payrollSetup: "Payroll Setup",
    other: "Other",
};

export default function LondonStartupCostCalculator() {
    const [structure, setStructure] = useState<UKBusinessStructure>("limited_company");
    const [location, setLocation] = useState<"london" | "outside_london">("london");
    const [industry, setIndustry] = useState<UKIndustry>("consulting");
    const [vatStatus, setVatStatus] = useState<VATStatus>("none");
    const [needsPremisesLicence, setNeedsPremisesLicence] = useState(false);
    const [premisesLicenceBand, setPremisesLicenceBand] = useState<PremisesLicenceBand>("B");
    const [sellsFood, setSellsFood] = useState(false);

    // Optional cost string inputs (empty = 0)
    const [optInputs, setOptInputs] = useState<Record<string, string>>({
        insurance: "",
        rentDeposit: "",
        equipment: "",
        inventory: "",
        websiteDomain: "",
        marketingLaunch: "",
        accountingLegal: "",
        payrollSetup: "",
        other: "",
    });

    const result = useMemo(() => {
        return calculateLondonStartupCost({
            structure,
            location,
            industry,
            vatStatus,
            needsPremisesLicence,
            premisesLicenceBand: needsPremisesLicence ? premisesLicenceBand : "none",
            sellsFood,
            optionalCosts: {
                insurance: parseNum(optInputs.insurance),
                rentDeposit: parseNum(optInputs.rentDeposit),
                equipment: parseNum(optInputs.equipment),
                inventory: parseNum(optInputs.inventory),
                websiteDomain: parseNum(optInputs.websiteDomain),
                marketingLaunch: parseNum(optInputs.marketingLaunch),
                accountingLegal: parseNum(optInputs.accountingLegal),
                payrollSetup: parseNum(optInputs.payrollSetup),
                other: parseNum(optInputs.other),
            },
        });
    }, [structure, location, industry, vatStatus, needsPremisesLicence, premisesLicenceBand, sellsFood, optInputs]);

    function setOpt(key: string, value: string) {
        setOptInputs((prev) => ({ ...prev, [key]: value }));
    }

    const optionalCostValues = Object.fromEntries(
        Object.entries(optInputs).map(([k, v]) => [k, parseNum(v)])
    );

    return (
        <div className="space-y-6">
            {/* Step 1 */}
            <section className="tool-frame p-4 sm:p-6">
                <h2 className="mb-5 text-base font-semibold text-foreground">Step 1: Business Setup</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Business Structure */}
                    <div className="space-y-2 md:col-span-2">
                        <span className="text-sm font-medium text-muted-foreground">Business Structure</span>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {[
                                { value: "sole_trader", label: "Sole Trader" },
                                { value: "limited_company", label: "Limited Company" },
                                { value: "llp", label: "LLP" },
                                { value: "partnership", label: "Partnership" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setStructure(opt.value as UKBusinessStructure)}
                                    className={`rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${structure === opt.value
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-background text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {(structure === "sole_trader" || structure === "partnership") && (
                            <p className="text-xs text-muted-foreground">
                                No Companies House registration required. Register with HMRC for Self Assessment (free).
                            </p>
                        )}
                        {(structure === "limited_company" || structure === "llp") && (
                            <p className="text-xs text-muted-foreground">
                                Companies House incorporation: £100 (online). Annual Confirmation Statement: £50.
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <ToggleGroup
                            options={[
                                { value: "london", label: "London" },
                                { value: "outside_london", label: "Outside London" },
                            ]}
                            value={location}
                            onChange={(v) => setLocation(v as "london" | "outside_london")}
                        />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <label htmlFor="industry" className="text-sm font-medium text-muted-foreground">
                            Industry
                        </label>
                        <select
                            id="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value as UKIndustry)}
                            className={fieldClass}
                        >
                            <option value="ecommerce">Online / E-commerce</option>
                            <option value="restaurant">Restaurant / Food service</option>
                            <option value="pub_bar">Pub / Bar / Nightclub</option>
                            <option value="salon">Salon / Beauty</option>
                            <option value="contractor">Contractor / Trades</option>
                            <option value="retail">Retail Shop</option>
                            <option value="consulting">Consulting / Agency</option>
                            <option value="professional">Professional Practice</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* VAT Status */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">VAT Registration</span>
                        <ToggleGroup
                            options={[
                                { value: "none", label: "No VAT" },
                                { value: "voluntary", label: "Voluntary" },
                                { value: "mandatory", label: "Mandatory" },
                            ]}
                            value={vatStatus}
                            onChange={(v) => setVatStatus(v as VATStatus)}
                        />
                        {vatStatus !== "none" && (
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                VAT registration is free (HMRC). Mandatory if taxable turnover exceeds £90,000 in any 12-month period.
                            </p>
                        )}
                    </div>

                    {/* Premises Licence */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Premises Licence needed?</span>
                        <ToggleGroup
                            options={[
                                { value: "no", label: "No" },
                                { value: "notsure", label: "Not sure" },
                                { value: "yes", label: "Yes" },
                            ]}
                            value={needsPremisesLicence ? "yes" : "no"}
                            onChange={(v) => setNeedsPremisesLicence(v === "yes")}
                        />
                        {needsPremisesLicence && (
                            <div className="mt-2 space-y-2">
                                <label htmlFor="premisesBand" className="text-sm font-medium text-muted-foreground">
                                    Rateable Value Band
                                </label>
                                <select
                                    id="premisesBand"
                                    value={premisesLicenceBand}
                                    onChange={(e) => setPremisesLicenceBand(e.target.value as PremisesLicenceBand)}
                                    className={fieldClass}
                                >
                                    <option value="A">Band A: Up to £4,300 — £100 application</option>
                                    <option value="B">Band B: £4,301–£33,000 — £190 application</option>
                                    <option value="C">Band C: £33,001–£87,000 — £315 application</option>
                                    <option value="D">Band D: £87,001–£125,000 — £450 application</option>
                                    <option value="E">Band E: £125,001+ — £635 application</option>
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    Annual renewal: £{ANNUAL_PREMISES_FEES[premisesLicenceBand]}/yr (not included in startup total)
                                </p>
                                {industry === "pub_bar" && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        A Designated Premises Supervisor (DPS) must hold a personal licence (£37).
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Food Business */}
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-muted-foreground">Sell food or drink?</span>
                        <ToggleGroup
                            options={[
                                { value: "no", label: "No" },
                                { value: "yes", label: "Yes" },
                            ]}
                            value={sellsFood ? "yes" : "no"}
                            onChange={(v) => setSellsFood(v === "yes")}
                        />
                        {sellsFood && (
                            <p className="text-xs text-muted-foreground">
                                Food businesses must register with their local council at least 28 days before opening. Registration is free.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section className="tool-frame p-4 sm:p-6">
                <h2 className="mb-2 text-base font-semibold text-foreground">Step 2: Optional Launch Costs</h2>
                <p className="mb-5 text-sm text-muted-foreground">
                    Enter your estimated costs. Leave blank or 0 if not applicable.
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {OPTIONAL_COST_FIELDS.map(({ key, label }) => (
                        <label key={key} className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">{label}</span>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground">£</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={optInputs[key]}
                                    onChange={(e) => setOpt(key, e.target.value)}
                                    className={`${fieldClass} pl-8`}
                                />
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* Results */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Box A */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        A. Required Government Costs
                    </p>
                    <div className="mt-4 divide-y divide-border">
                        {result.governmentCosts.companiesHouseIncorporation > 0 && (
                            <LineItem
                                label="Companies House incorporation"
                                amount={result.governmentCosts.companiesHouseIncorporation}
                                badge={<Badge variant="required" />}
                            />
                        )}
                        {result.governmentCosts.confirmationStatement > 0 && (
                            <LineItem
                                label="Confirmation Statement (first year)"
                                amount={result.governmentCosts.confirmationStatement}
                                badge={<Badge variant="required" />}
                            />
                        )}
                        {(structure === "sole_trader" || structure === "partnership") && (
                            <LineItem
                                label="HMRC Self Assessment registration"
                                amount={0}
                                badge={<Badge variant="free" />}
                            />
                        )}
                        {vatStatus !== "none" && (
                            <LineItem
                                label="VAT registration"
                                amount={0}
                                badge={vatStatus === "mandatory" ? <Badge variant="required" /> : <Badge variant="optional" />}
                            />
                        )}
                        {sellsFood && (
                            <LineItem
                                label="Food business registration"
                                amount={0}
                                badge={<Badge variant="free" />}
                            />
                        )}
                        {result.governmentCosts.premisesLicenceApplication > 0 && (
                            <LineItem
                                label={`Premises licence application (Band ${premisesLicenceBand})`}
                                amount={result.governmentCosts.premisesLicenceApplication}
                                badge={<Badge variant="required" />}
                            />
                        )}
                        {result.governmentCosts.personalLicence > 0 && (
                            <LineItem
                                label="Personal licence (DPS)"
                                amount={result.governmentCosts.personalLicence}
                                badge={<Badge variant="required" />}
                            />
                        )}
                        <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                            <span>Subtotal</span>
                            <span>{fmt(result.governmentCosts.subtotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Box B */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        B. Optional Launch Costs
                    </p>
                    <div className="mt-4 divide-y divide-border">
                        {Object.entries(optionalCostValues)
                            .filter(([, val]) => val > 0)
                            .map(([key, value]) => (
                                <LineItem
                                    key={key}
                                    label={OPTIONAL_COST_LABELS[key] ?? key}
                                    amount={value}
                                    badge={<Badge variant="optional" />}
                                />
                            ))}
                        {result.optionalCostsTotal === 0 && (
                            <p className="py-4 text-sm text-muted-foreground">No optional costs entered yet.</p>
                        )}
                        <div className="flex items-center justify-between pt-4 text-sm font-semibold">
                            <span>Subtotal</span>
                            <span>{fmt(result.optionalCostsTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Box C */}
                <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        C. Total Startup Estimate
                    </p>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-foreground">Minimum</p>
                                <p className="text-xs text-muted-foreground">Government fees only</p>
                            </div>
                            <span className="font-semibold">{fmt(result.totalMinimum)}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-[1rem] bg-primary/10 px-4 py-3 text-sm">
                            <div>
                                <p className="font-semibold text-primary">Likely</p>
                                <p className="text-xs text-primary/70">Gov&apos;t + your optional costs</p>
                            </div>
                            <span className="text-lg font-bold text-primary">{fmt(result.totalLikely)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-foreground">Upper estimate</p>
                                <p className="text-xs text-muted-foreground">Likely + 20% buffer</p>
                            </div>
                            <span className="font-semibold">{fmt(result.totalUpper)}</span>
                        </div>
                    </div>

                    <div className="mt-5 rounded-[1rem] border border-border bg-muted/40 px-4 py-3">
                        <p className="text-xs font-semibold text-muted-foreground">Ongoing compliance</p>
                        <p className="mt-1 text-xs text-foreground">{result.ongoingComplianceNote}</p>
                        {needsPremisesLicence && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Annual premises licence renewal: £{ANNUAL_PREMISES_FEES[premisesLicenceBand]}/yr (Band {premisesLicenceBand})
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Licence Advisory */}
            {result.licenceAdvisory.length > 0 && (
                <section className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-sm font-semibold text-foreground">Industry-specific licences may apply</p>
                    <ul className="mt-3 space-y-2">
                        {result.licenceAdvisory.map((msg, i) => (
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
