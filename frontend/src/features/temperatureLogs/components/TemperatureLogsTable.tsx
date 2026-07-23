import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";
import type { TemperatureLog } from "../../../types/temperature.types";
import { formatDate } from "../../../utils/FormatDate";
import { FiEye } from "react-icons/fi";

interface Props {
  logs: TemperatureLog[];
  loading: boolean;
  onView: (id: number) => void;
}

function AlertBadge({ alert }: { alert: boolean }) {
  return (
    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${alert ? 'bg-[var(--color-danger)] text-white' : 'bg-[var(--color-success)] text-white'}`}>
      {alert ? 'Alert' : 'OK'}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block rounded bg-[var(--color-primary)] px-2 py-1 text-xs font-medium text-white">{type}</span>
  );
}

export default function TemperatureLogsTable({ logs, loading, onView }: Props) {
  const columns: TableColumn<TemperatureLog>[] = [
    { key: 'facilityName', title: 'Facility', render: (r) => r.facilityName ?? '-' },
    { key: 'recordingDateTime', title: 'Recorded At', render: (r) => formatDate(r.recordingDateTime, "dateTime") },
    { key: 'temperatureReading', title: 'Temperature (°C)' },
    { key: 'recordingType', title: 'Type', render: (r) => <TypeBadge type={r.recordingType} /> },
    { key: 'alertTriggered', title: 'Alert', render: (r) => <AlertBadge alert={r.alertTriggered} /> },
    {
      key: 'recordedByName', title: 'Operator', render: (r) =>
        r.operatorName
          ? r.operatorName
          : r.recordingType === "Manual"
            ? "Owner"
            : "-"
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(r.logId)}
            title="View"
            className="flex items-center gap-1 rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
          >
            <FiEye size={18} />
          </button>
        </div>
      )
    }
  ];

  return <Table columns={columns} data={logs} loading={loading} emptyMessage="No temperature logs found." />;
}
