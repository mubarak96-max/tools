"use client";

import { useState } from "react";

export function TailwindCard({ children }: { children: React.ReactNode }) {
  return <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">{children}</section>;
}

export function TailwindField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function TailwindSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function TailwindInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function TailwindTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[160px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export function CodePanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h3>
        <CopyButton value={value} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{value}</pre>
    </div>
  );
}
