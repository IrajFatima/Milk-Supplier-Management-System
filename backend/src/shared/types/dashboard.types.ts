import type { CustomerAccountStatus, CustomerType } from "../constants/customer.js";
import type { DeliveryStatus } from "../constants/delivery.js";
import type { OrderType } from "../constants/order.js";
import type { AccountStatus, EmploymentStatus } from "../constants/user.js";

// ======================================================
// Shared Dashboard Types
// ======================================================

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
    registrationDate: Date;
}

export interface DashboardRecentDelivery {
    deliveryId: number;
    customerName: string;
    orderType: OrderType;
    scheduledQuantity: number;
    deliveryDate: Date;
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
    fullName: string;
    roleName: string;
    department: string | null;
    accountStatus: AccountStatus;
    employmentStatus: EmploymentStatus;
}

// ======================================================
// Owner Dashboard
// ======================================================

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

// ======================================================
// Farm Worker Dashboard
// ======================================================

export interface FarmWorkerDashboard {
    summary: {
        activeAnimals: number;
        lactatingAnimals: number;
        todaysProductionEntries: number;
    };

    latestTemperature: DashboardLatestTemperature | null;

    recentProduction: DashboardRecentProduction[];
}

// ======================================================
// Delivery Staff Dashboard
// ======================================================

export interface DeliveryStaffDashboard {
    summary: {
        assignedDeliveries: number;
        completedDeliveries: number;
        pendingDeliveries: number;
        failedDeliveries: number;
    };

    todaysDeliveries: DashboardRecentDelivery[];
}

// ======================================================
// Accountant Dashboard
// ======================================================

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

// ======================================================
// System Administrator Dashboard
// ======================================================

export interface SystemAdministratorDashboard {
    summary: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        totalSystemConfigurations: number;
    };

    recentUsers: DashboardRecentUser[];
}