"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  calculateUAEGratuity,
  formatServiceYears,
  type UAEGratuityWorkerType,
} from "@/lib/tools/uae-gratuity";

function currency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(value);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  if (!value) {
    return "Select a date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parseIsoDate(value));
}

function sameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const firstVisible = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisible.getFullYear(), firstVisible.getMonth(), firstVisible.getDate() + index);
    return {
      date,
      currentMonth: date.getMonth() === month,
    };
  });
}

function DateInputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => parseIsoDate(value));
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseIsoDate(value);
  const calendarDays = buildCalendarDays(visibleMonth);

  useEffect(() => {
    setVisibleMonth(parseIsoDate(value));
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="group flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
        >
          <span>{formatDisplayDate(value)}</span>
          <CalendarDays className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
        </button>

        {open ? (
          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-[19rem] rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-foreground">
                {new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(visibleMonth)}
              </p>
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {calendarDays.map(({ date, currentMonth }) => {
                const selected = sameCalendarDay(date, selectedDate);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      onChange(formatIsoDate(date));
                      setOpen(false);
                    }}
                    className={`inline-flex h-10 items-center justify-center rounded-xl text-sm transition ${
                      selected
                        ? "bg-primary font-semibold text-white"
                        : currentMonth
                          ? "bg-background text-foreground hover:bg-primary-soft hover:text-primary"
                          : "bg-background/60 text-muted-foreground hover:bg-primary-soft hover:text-primary"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}

export default function UAEGratuityCalculator() {
  const [basicSalary, setBasicSalary] = useState("");
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState(todayIsoDate());
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState("0");
  const [workerType, setWorkerType] = useState<UAEGratuityWorkerType>("expatriate");

  const result = useMemo(() => {
    try {
      return {
        data: calculateUAEGratuity({
          basicSalary: Number(basicSalary) || 0,
          startDate,
          endDate,
          unpaidLeaveDays: Number(unpaidLeaveDays) || 0,
          workerType,
        }),
        error: "",
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unable to calculate gratuity with the current inputs.",
      };
    }
  }, [basicSalary, startDate, endDate, unpaidLeaveDays, workerType]);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Monthly basic salary (AED)</span>
            <input
              type="number"
              min={0}
              placeholder="Enter monthly basic salary"
              value={basicSalary}
              onChange={(event) => setBasicSalary(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <DateInputField label="Start of contract" value={startDate} onChange={setStartDate} />

          <DateInputField label="End of contract" value={endDate} onChange={setEndDate} />

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Unpaid leave days</span>
            <input
              type="number"
              min={0}
              value={unpaidLeaveDays}
              onChange={(event) => setUnpaidLeaveDays(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Worker type</span>
            <select
              value={workerType}
              onChange={(event) => setWorkerType(event.target.value as UAEGratuityWorkerType)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
            >
              <option value="expatriate">Expatriate employee</option>
              <option value="uae-national">UAE national</option>
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background px-4 py-4 text-sm leading-6 text-muted-foreground">
          This calculator is for the traditional private-sector gratuity formula. It does not estimate payouts under the
          voluntary UAE savings scheme, and UAE nationals usually follow pension rules instead of the standard expatriate gratuity model.
        </div>
      </section>

      {result.error ? (
        <section className="glass-card rounded-[1.75rem] border border-danger/30 bg-danger-soft p-6 sm:p-8">
          <p className="text-sm leading-6 text-danger">{result.error}</p>
        </section>
      ) : null}

      {result.data ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Estimated gratuity</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{currency(result.data.cappedGratuity)}</p>
            </article>
            <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Eligible service</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{formatServiceYears(result.data.serviceYears)} yrs</p>
            </article>
            <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Daily basic salary</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{currency(result.data.dailyBasicSalary)}</p>
            </article>
            <article className="glass-card rounded-[1.5rem] border border-border/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Gratuity days</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{result.data.gratuityDays.toFixed(2)}</p>
            </article>
          </section>

          <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
            {!result.data.eligible ? (
              <div className="rounded-2xl border border-border bg-background px-5 py-5">
                <h2 className="text-xl font-semibold text-foreground">Not eligible under the standard gratuity formula</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{result.data.reason}</p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="text-xl font-semibold text-foreground">Calculation breakdown</h2>
                  <dl className="mt-4 space-y-3 text-sm leading-6">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Raw service days</dt>
                      <dd className="font-medium text-foreground">{result.data.rawServiceDays}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Eligible service days after unpaid leave</dt>
                      <dd className="font-medium text-foreground">{result.data.eligibleServiceDays}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Years at 21 days rate</dt>
                      <dd className="font-medium text-foreground">{formatServiceYears(result.data.firstBandYears)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Years at 30 days rate</dt>
                      <dd className="font-medium text-foreground">{formatServiceYears(result.data.secondBandYears)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Uncapped gratuity</dt>
                      <dd className="font-medium text-foreground">{currency(result.data.uncappedGratuity)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Legal cap</dt>
                      <dd className="font-medium text-foreground">{currency(result.data.maxCap)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="text-xl font-semibold text-foreground">Notes for using the result</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>This estimate uses monthly basic salary only, not housing, transport, or other allowances.</li>
                    <li>Unpaid leave is excluded from the service period before gratuity is calculated.</li>
                    <li>The result is capped at the value of two years of wage, in line with the standard private-sector rule.</li>
                    <li>If the employer uses the voluntary savings scheme instead of traditional gratuity, this estimate will not match that plan.</li>
                  </ul>
                </div>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
