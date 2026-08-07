import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardSection from "../components/DashboardSection";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import RecentEntityTable from "../components/RecentEntityTable";

import { dashboardService } from "../../../services/dashboard.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { formatDate } from "../../../utils/FormatDate";

import type { OwnerDashboard } from "../../../types/dashboard.types";
import type { TableColumn } from "../../../components/Table";

const productionColumns: TableColumn<OwnerDashboard["recentProduction"][number]>[] = [
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

const deliveryColumns: TableColumn<OwnerDashboard["todaysDeliveries"][number]>[] = [
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
    key: "deliveryStaffName",
    title: "Delivery Staff",
    render: (row) => row.deliveryStaffName ?? "-",
  },
  {
    key: "deliveryStatus",
    title: "Status",
  },
];

const customerColumns: TableColumn<OwnerDashboard["recentCustomers"][number]>[] = [
  {
    key: "customerName",
    title: "Customer",
  },
  {
    key: "customerType",
    title: "Type",
  },
  {
    key: "contactNumber",
    title: "Contact",
    render: (row) => row.contactNumber ?? "-",
  },
  {
    key: "accountStatus",
    title: "Status",
  },
  {
    key: "registrationDate",
    title: "Registered",
    render: (row) => formatDate(row.registrationDate),
  },
];

export default function OwnerDashboardPage() {
  const [dashboard, setDashboard] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOwnerDashboard();
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardSummaryCard
          title="Total Animals"
          value={dashboard?.summary.totalAnimals ?? 0}
        />

        <DashboardSummaryCard
          title="Active Customers"
          value={dashboard?.summary.activeCustomers ?? 0}
        />

        <DashboardSummaryCard
          title="Active Subscriptions"
          value={dashboard?.summary.activeSubscriptions ?? 0}
        />

        <DashboardSummaryCard
          title="Today's Production (L)"
          value={dashboard?.summary.todaysProduction ?? 0}
        />

        <DashboardSummaryCard
          title="Pending Deliveries"
          value={dashboard?.summary.pendingDeliveries ?? 0}
        />
      </div>

      <DashboardSection title="Recent Production">
        <RecentEntityTable
          columns={productionColumns}
          data={dashboard?.recentProduction ?? []}
          loading={loading}
          emptyMessage="No production records found."
        />
      </DashboardSection>

      <DashboardSection title="Today's Deliveries">
        <RecentEntityTable
          columns={deliveryColumns}
          data={dashboard?.todaysDeliveries ?? []}
          loading={loading}
          emptyMessage="No deliveries found."
        />
      </DashboardSection>

      <DashboardSection title="Recent Customers">
        <RecentEntityTable
          columns={customerColumns}
          data={dashboard?.recentCustomers ?? []}
          loading={loading}
          emptyMessage="No customers found."
        />
      </DashboardSection>
    </div>
  );
}