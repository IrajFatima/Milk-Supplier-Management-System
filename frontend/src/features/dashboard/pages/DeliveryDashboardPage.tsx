import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardSection from "../components/DashboardSection";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import RecentEntityTable from "../components/RecentEntityTable";

import { dashboardService } from "../../../services/dashboard.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { formatDate } from "../../../utils/FormatDate";

import type { DeliveryStaffDashboard } from "../../../types/dashboard.types";
import type { TableColumn } from "../../../components/Table";

const deliveryColumns: TableColumn<
  DeliveryStaffDashboard["todaysDeliveries"][number]
>[] = [
  {
    key: "customerName",
    title: "Customer",
  },
  {
    key: "scheduledQuantity",
    title: "Quantity (L)",
  },
  {
    key: "orderType",
    title: "Order Type",
  },
  {
    key: "deliveryDate",
    title: "Delivery Date",
    render: (row) => formatDate(row.deliveryDate),
  },
  {
    key: "deliveryStatus",
    title: "Status",
  },
];

export default function DeliveryDashboardPage() {
  const [dashboard, setDashboard] =
    useState<DeliveryStaffDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDeliveryStaffDashboard();
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardSummaryCard
          title="Assigned Deliveries"
          value={dashboard?.summary.assignedDeliveries ?? 0}
        />

        <DashboardSummaryCard
          title="Completed Deliveries"
          value={dashboard?.summary.completedDeliveries ?? 0}
        />

        <DashboardSummaryCard
          title="Pending Deliveries"
          value={dashboard?.summary.pendingDeliveries ?? 0}
        />

        <DashboardSummaryCard
          title="Failed Deliveries"
          value={dashboard?.summary.failedDeliveries ?? 0}
        />
      </div>

      <DashboardSection title="Today's Deliveries">
        <RecentEntityTable
          columns={deliveryColumns}
          data={dashboard?.todaysDeliveries ?? []}
          loading={loading}
          emptyMessage="No deliveries found."
        />
      </DashboardSection>
    </div>
  );
}