import type { ReactNode } from "react";

export const REAL_ESTATE_MARKETS = [
  {
    key: "US",
    label: "United States",
    currency: "USD",
    locale: "en-US",
  },
  {
    key: "UK",
    label: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
  },
  {
    key: "EU",
    label: "Eurozone",
    currency: "EUR",
    locale: "de-DE",
  },
  {
    key: "AE",
    label: "Dubai / UAE",
    currency: "AED",
    locale: "en-AE",
  },
  {
    key: "SG",
    label: "Singapore",
    currency: "SGD",
    locale: "en-SG",
  },
  {
    key: "HK",
    label: "Hong Kong",
    currency: "HKD",
    locale: "en-HK",
  },
] as const;

export type RealEstateMarket = (typeof REAL_ESTATE_MARKETS)[number];
export type RealEstateMarketKey = RealEstateMarket["key"];

export function getRealEstateMarket(key: string) {
  return REAL_ESTATE_MARKETS.find((market) => market.key === key) ?? REAL_ESTATE_MARKETS[0];
}

export function formatMoney(value: number, market: RealEstateMarket = REAL_ESTATE_MARKETS[0]) {
  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  min = 0,
  step = 1,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  helper?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
      />
      {helper ? <span className="block text-xs leading-5 text-muted-foreground">{helper}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  helper?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper ? <span className="block text-xs leading-5 text-muted-foreground">{helper}</span> : null}
    </label>
  );
}

export function MarketField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SelectField
      label="Market / currency"
      value={value}
      onChange={onChange}
      options={REAL_ESTATE_MARKETS.map((market) => ({
        label: `${market.label} (${market.currency})`,
        value: market.key,
      }))}
      helper="Default is USD, with UK, Eurozone, Dubai/UAE, Singapore, and Hong Kong options for international property workflows."
    />
  );
}

export function ResultCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p> : null}
    </article>
  );
}

export function NoteCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-4 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}
