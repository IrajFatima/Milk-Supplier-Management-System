import type { Production } from "../../../types/production.types";
import { formatDate } from "../../../utils/FormatDate";

interface Props {
  production: Production;
}

export default function ProductionDetailCard({ production }: Props) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="mb-4 text-xl font-semibold">Production Details</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Tag ID</p>
          <p className="font-medium">{production.animalTagId ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Animal</p>
          <p className="font-medium">{production.animalName ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Date</p>
          <p className="font-medium">{formatDate(production.productionDate,"dateTime")}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Shift</p>
          <p className="font-medium">{production.productionShift}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Quantity (L)</p>
          <p className="font-medium">{production.quantityProduced}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Facility</p>
          <p className="font-medium">{production.facilityName ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Fat %</p>
          <p className="font-medium">{production.fatPercentage}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">SNF %</p>
          <p className="font-medium">{production.snfPercentage}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Milk Temperature (°C)</p>
          <p className="font-medium">{production.milkTemperature}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Quality Status</p>
          <p className="font-medium">{production.qualityStatus}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Status</p>
          <p className="font-medium">{production.status}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Recorded By</p>
          <p className="font-medium">{production.recordedByName ?? "Owner"}</p>
        </div>
      </div>
    </div>
  );
}
