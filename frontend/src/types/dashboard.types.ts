import type { CustomerAccountStatus, CustomerType } from "../constants/customer";
import type { DeliveryStatus } from "../constants/delivery";
import type { OrderType } from "../constants/order";
import type { Role } from "../constants/roles";
import type { AccountStatus, EmploymentStatus } from "../constants/user";

export interface DashboardRecentProduction {
    productionId: number;
    animalTagId: string;
    animalName: string | null;
    productionShift: string;
    quantityProduced: number;
    productionDate: string;
}

export interface DashboardRecentCustomer {
    customerId: number;
    customerName: string;
    customerType: CustomerType;
    contactNumber: string | null;
    accountStatus: CustomerAccountStatus;
    registrationDate: string;
}

export interface DashboardRecentDelivery {
    deliveryId: number;
    customerName: string;
    orderType: OrderType;
    scheduledQuantity: number;
    deliveryDate: string;
    deliveryStaffName: string | null;
    deliveryStatus: DeliveryStatus;
}

export interface DashboardLatestTemperature {
    logId: number;
    facilityName: string;
    temperatureReading: number;
    recordingDateTime: string;
    alertTriggered: boolean;
}

export interface DashboardRecentUser {
    userId: number;
    username: string;
    fullName: string | null;
    roleName: Role;
    department: string | null;
    accountStatus: AccountStatus;
    employmentStatus: EmploymentStatus | null;
}

export interface OwnerDashboard {
    summary: {
        totalAnimals: number;
        activeCustomers: number;
        activeSubscriptions: number;
        todaysProduction: number;
        pendingDeliveries: number;
    };
    recentProduction: DashboardRecentProduction[];
    todaysDeliveries: DashboardRecentDelivery[];
    recentCustomers: DashboardRecentCustomer[];
}

export interface FarmWorkerDashboard {
    summary: {
        activeAnimals: number;
        lactatingAnimals: number;
        todaysProductionEntries: number;
    };
    latestTemperature: DashboardLatestTemperature | null;
    recentProduction: DashboardRecentProduction[];
}

export interface DeliveryStaffDashboard {
    summary: {
        assignedDeliveries: number;
        completedDeliveries: number;
        pendingDeliveries: number;
        failedDeliveries: number;
    };
    todaysDeliveries: DashboardRecentDelivery[];
}

export interface AccountantDashboard {
    summary: {
        totalCustomers: number;
        activeSubscriptions: number;
        oneTimeOrders: number;
        todaysProduction: number;
    };
    recentCustomers: DashboardRecentCustomer[];
    recentProduction: DashboardRecentProduction[];
}

export interface SystemAdministratorDashboard {
    summary: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        totalSystemConfigurations: number;
    };
    recentUsers: DashboardRecentUser[];
}