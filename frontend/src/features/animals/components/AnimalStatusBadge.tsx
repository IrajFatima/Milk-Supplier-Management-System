import type { AnimalStatus } from "../../../constants/animalStatus";

interface AnimalStatusBadgeProps {
  status: AnimalStatus;
}

const statusStyles: Record<
  AnimalStatus,
  {
    label: string;
    background: string;
    color: string;
  }
> = {
  Lactating: {
    label: "Lactating",
    background: "var(--color-success)",
    color: "#ffffff",
  },
  Dry: {
    label: "Dry",
    background: "var(--color-warning)",
    color: "#ffffff",
  },
  Pregnant: {
    label: "Pregnant",
    background: "var(--color-primary)",
    color: "#ffffff",
  },
  Heifer: {
    label: "Heifer",
    background: "var(--color-secondary)",
    color: "#ffffff",
  },
  Calf: {
    label: "Calf",
    background: "var(--color-accent)",
    color: "#ffffff",
  },
  Bull: {
    label: "Bull",
    background: "var(--color-text-secondary)",
    color: "#ffffff",
  },
  Sold: {
    label: "Sold",
    background: "var(--color-danger)",
    color: "#ffffff",
  },
  Deceased: {
    label: "Deceased",
    background: "#374151",
    color: "#ffffff",
  },
};

export default function AnimalStatusBadge({
  status,
}: AnimalStatusBadgeProps) {
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