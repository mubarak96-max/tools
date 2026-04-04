interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="section-heading text-3xl text-foreground md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
