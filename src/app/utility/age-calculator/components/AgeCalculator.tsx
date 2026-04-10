"use client";

import { useMemo, useState } from "react";

import { calculateAge } from "@/lib/tools/age";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition-shadow focus:ring-2 focus:ring-primary";

function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(getTodayIso());

  const result = useMemo(() => {
    if (!birthDate) {
      return null;
    }

    return calculateAge({
      birthDate,
      targetDate,
    });
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Date of birth</span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Age on date</span>
              <input
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                className={fieldClass}
              />
            </label>

            <div className="rounded-[1.25rem] border border-border/70 bg-background p-4 text-sm leading-6 text-muted-foreground">
              Enter a birth date to see exact calendar age in years, months, and days, plus the total time span in months, weeks, and days.
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Exact age
            </p>
            <div className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              {result ? `${result.years}y ${result.months}m ${result.days}d` : "--"}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {result ? `Next birthday in ${result.nextBirthdayInDays} day(s)` : "Choose a valid birth date to calculate."}
            </p>
            {result ? (
              <div className="mt-6 rounded-[1rem] border border-primary/20 bg-primary-soft p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-soft-foreground">
                  Next birthday
                </p>
                <p className="mt-2 text-base font-semibold text-primary">
                  {formatDate(result.nextBirthdayDate)}
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total months",
            value: result ? result.totalMonths.toLocaleString() : "--",
          },
          {
            label: "Total weeks",
            value: result ? result.totalWeeks.toLocaleString() : "--",
          },
          {
            label: "Total days",
            value: result ? result.totalDays.toLocaleString() : "--",
          },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
