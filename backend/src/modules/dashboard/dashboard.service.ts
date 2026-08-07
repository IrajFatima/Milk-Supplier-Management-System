import { dashboardRepository } from "./dashboard.repository.js";
import type {
    AccountantDashboard,
    DeliveryStaffDashboard,
    FarmWorkerDashboard,
    OwnerDashboard,
    SystemAdministratorDashboard,
} from "../../shared/types/dashboard.types.js";

export class DashboardService {

    async getOwnerDashboard(): Promise<OwnerDashboard> {
        return {
            summary: await dashboardRepository.getOwnerSummary(),
            recentProduction: await dashboardRepository.getRecentProduction(),
            todaysDeliveries: await dashboardRepository.getTodaysDeliveries(),
            recentCustomers: await dashboardRepository.getRecentCustomers(),
        };
    }

    async getFarmWorkerDashboard(): Promise<FarmWorkerDashboard> {
        return {
            summary: await dashboardRepository.getFarmWorkerSummary(),
            latestTemperature: await dashboardRepository.getLatestTemperature(),
            recentProduction: await dashboardRepository.getRecentProduction(),
        };
    }

    async getDeliveryStaffDashboard(employeeId: number): Promise<DeliveryStaffDashboard> {
        return {
            summary: await dashboardRepository.getDeliveryStaffSummary(employeeId),
            todaysDeliveries: await dashboardRepository.getTodaysAssignedDeliveries(employeeId),
        };
    }

    async getAccountantDashboard(): Promise<AccountantDashboard> {
        return {
            summary: await dashboardRepository.getAccountantSummary(),
            recentCustomers: await dashboardRepository.getRecentCustomers(),
            recentProduction: await dashboardRepository.getRecentProduction(),
        };
    }

    async getSystemAdministratorDashboard(): Promise<SystemAdministratorDashboard> {
        return {
            summary: await dashboardRepository.getSystemAdministratorSummary(),
            recentUsers: await dashboardRepository.getRecentUsers(),
        };
    }

}

export const dashboardService = new DashboardService();