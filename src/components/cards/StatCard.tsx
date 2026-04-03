interface StatCardProps {
  label: string;
  value: string;
  note: string;
}

export default function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="glass-card rounded-[1.5rem] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
    </div>
  );
}
