import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardSection from "../components/DashboardSection";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import RecentEntityTable from "../components/RecentEntityTable";
import TemperatureCard from "../components/TemperatureCard";

import { dashboardService } from "../../../services/dashboard.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { formatDate } from "../../../utils/FormatDate";

import type { FarmWorkerDashboard } from "../../../types/dashboard.types";
import type { TableColumn } from "../../../components/Table";

const productionColumns: TableColumn<FarmWorkerDashboard["recentProduction"][number]>[] = [
  {
    key: "animalTagId",
    title: "Tag ID",
  },
  {
    key: "animalName",
    title: "Animal",
    render: (row) => row.animalName ?? "-",
  },
  {
    key: "quantityProduced",
    title: "Quantity (L)",
  },
  {
    key: "productionShift",
    title: "Shift",
  },
  {
    key: "productionDate",
    title: "Date",
    render: (row) => formatDate(row.productionDate),
  },
];

export default function FarmWorkerDashboardPage() {
  const [dashboard, setDashboard] = useState<FarmWorkerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getFarmWorkerDashboard();
      setDashboard(response);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await loadDashboard();
    })();
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardSummaryCard
          title="Active Animals"
          value={dashboard?.summary.activeAnimals ?? 0}
        />

        <DashboardSummaryCard
          title="Lactating Animals"
          value={dashboard?.summary.lactatingAnimals ?? 0}
        />

        <DashboardSummaryCard
          title="Today's Production Entries"
          value={dashboard?.summary.todaysProductionEntries ?? 0}
        />
      </div>

      <DashboardSection title="Latest Temperature">
        <TemperatureCard temperature={dashboard?.latestTemperature ?? null} />
      </DashboardSection>

      <DashboardSection title="Recent Production">
        <RecentEntityTable
          columns={productionColumns}
          data={dashboard?.recentProduction ?? []}
          loading={loading}
          emptyMessage="No production records found."
        />
      </DashboardSection>
    </div>
  );
}