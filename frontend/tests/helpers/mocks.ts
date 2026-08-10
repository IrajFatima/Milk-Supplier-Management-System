import { vi } from "vitest";

export const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
};

export function mockNavigate() {
    return vi.fn();
}

export function mockAnimalService() {
    return {
        getAnimals: vi.fn(),
        getAnimal: vi.fn(),
        createAnimal: vi.fn(),
        updateAnimal: vi.fn(),
        relocateAnimal: vi.fn(),
        deactivateAnimal: vi.fn(),
        reactivateAnimal: vi.fn(),
        changeAnimalStatus: vi.fn(),
        getSheds: vi.fn(),
        getParentAnimals: vi.fn(),
    };
}

export function mockCustomerService() {
    return {
        getCustomers: vi.fn(),
        getCustomer: vi.fn(),
        createCustomer: vi.fn(),
        updateCustomer: vi.fn(),
        changeCustomerStatus: vi.fn(),
    };
}

export function mockOrderService() {
    return {
        getSubscriptions: vi.fn(),
        getSubscription: vi.fn(),
        createSubscription: vi.fn(),
        updateSubscription: vi.fn(),
        cancelSubscription: vi.fn(),
        changeSubscriptionStatus: vi.fn(),
        reactivateSubscription: vi.fn(),
        getOrders: vi.fn(),
        getOrder: vi.fn(),
        createOrder: vi.fn(),
        updateOrder: vi.fn(),
        cancelOrder: vi.fn(),
        changeOrderStatus: vi.fn(),
        reactivateOrder: vi.fn(),
        bulkCreateOrders: vi.fn(),
        getMilkTypes: vi.fn(),
    };
}

export function mockUserService() {
    return {
        getUsers: vi.fn(),
        getUser: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        reactivateUser: vi.fn(),
        deactivateUser: vi.fn(),
        getRoles: vi.fn(),
    };
}

export function mockDeliveryService() {
    return {
        getDeliveries: vi.fn(),
        getMyDeliveries: vi.fn(),
        getDeliveryById: vi.fn(),
        getMyDeliveryById: vi.fn(),
        assignDelivery: vi.fn(),
        updateDeliveryStatus: vi.fn(),
        getDeliveryStaff: vi.fn(),
    };
}

export function mockProductionService() {
    return {
        getProductions: vi.fn(),
        getProductionById: vi.fn(),
        createProduction: vi.fn(),
        updateProduction: vi.fn(),
        voidProduction: vi.fn(),
        getProductionAnimals: vi.fn(),
        getStorageFacilities: vi.fn(),
    };
}

export function mockTemperatureLogService() {
    return {
        getTemperatureLogs: vi.fn(),
        getTemperatureLogById: vi.fn(),
        createTemperatureLog: vi.fn(),
    };
}

export function mockSystemConfigurationService() {
    return {
        getSystemConfigurations: vi.fn(),
        getSystemConfiguration: vi.fn(),
        updateSystemConfiguration: vi.fn(),
    };
}

export function mockDashboardService() {
    return {
        getOwnerDashboard: vi.fn(),
        getFarmWorkerDashboard: vi.fn(),
        getDeliveryStaffDashboard: vi.fn(),
        getAccountantDashboard: vi.fn(),
        getSystemAdministratorDashboard: vi.fn(),
    };
}

export function mockAuthService() {
    return {
        login: vi.fn(),
        getCurrentUser: vi.fn(),
        logout: vi.fn(),
        changePassword: vi.fn(),
    };
}
