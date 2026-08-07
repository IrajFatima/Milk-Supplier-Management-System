import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardSection from "../components/DashboardSection";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import RecentEntityTable from "../components/RecentEntityTable";

import { dashboardService } from "../../../services/dashboard.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { SystemAdministratorDashboard } from "../../../types/dashboard.types";
import type { TableColumn } from "../../../components/Table";

const userColumns: TableColumn<
  SystemAdministratorDashboard["recentUsers"][number]
>[] = [
  {
    key: "username",
    title: "Username",
  },
  {
    key: "fullName",
    title: "Full Name",
    render: (row) => row.fullName ?? "-",
  },
  {
    key: "roleName",
    title: "Role",
  },
  {
    key: "department",
    title: "Department",
    render: (row) => row.department ?? "-",
  },
  {
    key: "accountStatus",
    title: "Account Status",
  },
  {
    key: "employmentStatus",
    title: "Employment Status",
    render: (row) => row.employmentStatus ?? "-",
  },
];

export default function SystemAdministratorDashboardPage() {
  const [dashboard, setDashboard] =
    useState<SystemAdministratorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await dashboardService.getSystemAdministratorDashboard();
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
          title="Total Users"
          value={dashboard?.summary.totalUsers ?? 0}
        />

        <DashboardSummaryCard
          title="Active Users"
          value={dashboard?.summary.activeUsers ?? 0}
        />

        <DashboardSummaryCard
          title="Inactive Users"
          value={dashboard?.summary.inactiveUsers ?? 0}
        />

        <DashboardSummaryCard
          title="System Configurations"
          value={dashboard?.summary.totalSystemConfigurations ?? 0}
        />
      </div>

      <DashboardSection title="Recent Users">
        <RecentEntityTable
          columns={userColumns}
          data={dashboard?.recentUsers ?? []}
          loading={loading}
          emptyMessage="No users found."
        />
      </DashboardSection>
    </div>
  );
}