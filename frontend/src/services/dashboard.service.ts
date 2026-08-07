import api from "./api";

import type {
    AccountantDashboard,
    DeliveryStaffDashboard,
    FarmWorkerDashboard,
    OwnerDashboard,
    SystemAdministratorDashboard,
} from "../types/dashboard.types";

class DashboardService {

    async getOwnerDashboard(): Promise<OwnerDashboard> {
        const { data } = await api.get("/dashboard/owner");
        return data.data.dashboard;
    }

    async getFarmWorkerDashboard(): Promise<FarmWorkerDashboard> {
        const { data } = await api.get("/dashboard/farm-worker");
        return data.data.dashboard;
    }

    async getDeliveryStaffDashboard(): Promise<DeliveryStaffDashboard> {
        const { data } = await api.get("/dashboard/delivery-staff");
        return data.data.dashboard;
    }

    async getAccountantDashboard(): Promise<AccountantDashboard> {
        const { data } = await api.get("/dashboard/accountant");
        return data.data.dashboard;
    }

    async getSystemAdministratorDashboard(): Promise<SystemAdministratorDashboard> {
        const { data } = await api.get("/dashboard/system-administrator");
        return data.data.dashboard;
    }

}

export const dashboardService = new DashboardService();