import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardSection from "../components/DashboardSection";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import RecentEntityTable from "../components/RecentEntityTable";

import { dashboardService } from "../../../services/dashboard.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { formatDate } from "../../../utils/FormatDate";

import type { AccountantDashboard } from "../../../types/dashboard.types";
import type { TableColumn } from "../../../components/Table";

const customerColumns: TableColumn<
  AccountantDashboard["recentCustomers"][number]
>[] = [
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

const productionColumns: TableColumn<
  AccountantDashboard["recentProduction"][number]
>[] = [
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

export default function AccountantDashboardPage() {
  const [dashboard, setDashboard] = useState<AccountantDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getAccountantDashboard();
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
          title="Total Customers"
          value={dashboard?.summary.totalCustomers ?? 0}
        />

        <DashboardSummaryCard
          title="Active Subscriptions"
          value={dashboard?.summary.activeSubscriptions ?? 0}
        />

        <DashboardSummaryCard
          title="One-Time Orders"
          value={dashboard?.summary.oneTimeOrders ?? 0}
        />

        <DashboardSummaryCard
          title="Today's Production (L)"
          value={dashboard?.summary.todaysProduction ?? 0}
        />
      </div>

      <DashboardSection title="Recent Customers">
        <RecentEntityTable
          columns={customerColumns}
          data={dashboard?.recentCustomers ?? []}
          loading={loading}
          emptyMessage="No customers found."
        />
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