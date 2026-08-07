import type { DashboardLatestTemperature } from "../../../types/dashboard.types";
import { formatDate } from "../../../utils/FormatDate";

interface Props {
  temperature: DashboardLatestTemperature | null;
}

export default function TemperatureCard({ temperature }: Props) {
  if (!temperature) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-xl font-semibold">Latest Temperature</h2>

        <p className="text-[var(--color-text-secondary)]">
          No temperature records available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="mb-4 text-xl font-semibold">Latest Temperature</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Facility
          </p>
          <p className="font-medium">{temperature.facilityName}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Temperature
          </p>
          <p className="font-medium">
            {temperature.temperatureReading} °C
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Recording Time
          </p>
          <p className="font-medium">
            {formatDate(temperature.recordingDateTime, "dateTime")}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Alert Status
          </p>
          <p className="font-medium">
            {temperature.alertTriggered ? "Triggered" : "Normal"}
          </p>
        </div>
      </div>
    </div>
  );
}