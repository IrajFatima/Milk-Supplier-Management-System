import type { TemperatureLog } from "../../../types/temperature.types";
import { formatDate } from "../../../utils/FormatDate";

interface Props {
  log: TemperatureLog;
}

export default function TemperatureLogDetailCard({ log }: Props) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h2 className="mb-4 text-xl font-semibold">Temperature Log Details</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Facility</p>
          <p className="font-medium">{log.facilityName ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Recorded At</p>
          <p className="font-medium">{formatDate(log.recordingDateTime, "dateTime")}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Temperature (°C)</p>
          <p className="font-medium">{log.temperatureReading}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Recording Type</p>
          <p className="font-medium">{log.recordingType}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Alert Triggered</p>
          <p className="font-medium">{log.alertTriggered ? "Yes" : "No"}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Operator</p>
          <p className="font-medium"><p className="font-medium">
            {log.operatorName
              ? log.operatorName
              : log.recordingType === "Manual"
                ? "Owner"
                : "-"}
          </p></p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm text-[var(--color-text-secondary)]">Remarks</p>
          <p className="font-medium">{log.remarks ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}
