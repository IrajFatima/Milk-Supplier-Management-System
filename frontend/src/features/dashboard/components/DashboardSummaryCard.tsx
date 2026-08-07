interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function DashboardSummaryCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-[var(--color-text)]">
        {value}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}