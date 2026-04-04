interface StatCardProps {
  label: string;
  value: string;
  note: string;
}

export default function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="glass-card rounded-[1.5rem] border border-border/80 p-6">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{note}</p>
    </div>
  );
}
