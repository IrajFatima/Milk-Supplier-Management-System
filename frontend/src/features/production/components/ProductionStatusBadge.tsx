
interface ProductionStatusBadgeProps {
  status: ProductionStatus;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PRODUCTION_STATUS = {
  Active: "Active",
  Voided: "Voided",
} as const;

type ProductionStatus =
  (typeof PRODUCTION_STATUS)[keyof typeof PRODUCTION_STATUS];

const statusStyles: Record<
  ProductionStatus,
  {
    label: string;
    background: string;
    color: string;
  }
> = {
  Active: {
    label: "Active",
    background: "var(--color-success)",
    color: "#ffffff",
  },

  Voided: {
    label: "Voided",
    background: "var(--color-secondary)",
    color: "#ffffff",
  },
};

export default function ProductionStatusBadge({
  status,
}: ProductionStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: style.background,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
}