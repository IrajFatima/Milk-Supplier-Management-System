import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import AccessDeniedPage from "../features/auth/pages/AccessDeniedPage";
import RootRedirect from "./RootRedirect";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import { ROLES } from "../constants/roles";
import UserProfile from "../features/auth/pages/UserProfile";
import NotFoundPage from "../features/auth/pages/NotFoundPage";
import AnimalListPage from "../features/animals/pages/AnimalListPage";
import CreateAnimalPage from "../features/animals/pages/CreateAnimalPage";
import EditAnimalPage from "../features/animals/pages/EditAnimalPage";
import AnimalDetailsPage from "../features/animals/pages/AnimalDetailsPage";

// Production pages (to be implemented)
import ProductionListPage from "../features/production/pages/ProductionListPage";
import ProductionCreatePage from "../features/production/pages/ProductionCreatePage";
import ProductionEditPage from "../features/production/pages/ProductionEditPage";
import ProductionDetailsPage from "../features/production/pages/ProductionDetailsPage";

// Temperature logs pages (to be implemented)
import TemperatureLogsListPage from "../features/temperatureLogs/pages/TemperatureLogsListPage";
import TemperatureLogCreatePage from "../features/temperatureLogs/pages/TemperatureLogCreatePage";
import TemperatureLogDetailsPage from "../features/temperatureLogs/pages/TemperatureLogDetailsPage";

// Customer pages
import CustomerListPage from "../features/customers/pages/CustomerListPage";
import CustomerDetailsPage from "../features/customers/pages/CustomerDetailsPage";
import CreateCustomerPage from "../features/customers/pages/CreateCustomerPage";
import EditCustomerPage from "../features/customers/pages/EditCustomerPage";

// Order pages
import OrderListPage from "../features/orders/pages/OrderListPage";
import CreateOrderPage from "../features/orders/pages/CreateOrderPage";
import EditOrderPage from "../features/orders/pages/EditOrderPage";
import OrderDetailsPage from "../features/orders/pages/OrderDetailsPage";

// Deliveries Page
import DeliveryListPage from "../features/deliveries/pages/DeliveryListPage";
import DeliveryDetailsPage from "../features/deliveries/pages/DeliveryDetailsPage";

// User pages
import UserListPage from "../features/users/pages/UserListPage";
import CreateUserPage from "../features/users/pages/CreateUserPage";
import EditUserPage from "../features/users/pages/EditUserPage";
import UserDetailsPage from "../features/users/pages/UserDetailsPage";

// system configurations page
import SystemConfigurationListPage from "../features/systemConfigurations/pages/SystemConfigurationListPage";
import SystemConfigurationDetailsPage from "../features/systemConfigurations/pages/SystemConfigurationDetailsPage";
import SystemConfigurationFormPage from "../features/systemConfigurations/pages/EditSystemConfigurationPage";

// Dashboard pages
import OwnerDashboardPage from "../features/dashboard/pages/OwnerDashboardPage";
import FarmWorkerDashboardPage from "../features/dashboard/pages/FarmWorkerDashboardPage";
import DeliveryDashboardPage from "../features/dashboard/pages/DeliveryDashboardPage";
import AccountantDashboardPage from "../features/dashboard/pages/AccountantDashboardPage";
import SystemAdministratorDashboardPage from "../features/dashboard/pages/SystemAdministratorDashboardPage";

export default function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.OWNER]} />}>
                        <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
                    </Route>
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.FARM_WORKER]} />}>
                        <Route path="/farm/dashboard" element={<FarmWorkerDashboardPage />} />
                    </Route>
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_STAFF]} />}>
                        <Route path="/delivery/dashboard" element={<DeliveryDashboardPage />} />
                    </Route>
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ACCOUNTANT]} />}>
                        <Route path="/accountant/dashboard" element={<AccountantDashboardPage />} />
                    </Route>
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMINISTRATOR]} />}>
                        <Route path="/administrator/dashboard" element={<SystemAdministratorDashboardPage />} />
                    </Route>
                    <Route path="/profile" element={<UserProfile />} />

                    {/* Routes accessible to Owner and Farm Worker */}
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.FARM_WORKER]} />}>
                        <Route path="/animals" element={<AnimalListPage />} />
                        <Route path="/animals/:id" element={<AnimalDetailsPage />} />
                        <Route path="/animals/create" element={<CreateAnimalPage />} />
                        <Route path="/animals/:id/edit" element={<EditAnimalPage />} />

                        {/* Production create/edit (Owner, Farm Worker) */}
                        <Route path="/production/create" element={<ProductionCreatePage />} />
                        <Route path="/production/:id/edit" element={<ProductionEditPage />} />

                        {/* Temperature logs create (Owner, Farm Worker) */}
                        <Route path="/temperature-logs/create" element={<TemperatureLogCreatePage />} />
                    </Route>

                    {/* Routes accessible to Owner, Farm Worker, Accountant (readers) */}
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.FARM_WORKER, ROLES.ACCOUNTANT]} />}>
                        {/* Production list/details */}
                        <Route path="/production" element={<ProductionListPage />} />
                        <Route path="/production/:id" element={<ProductionDetailsPage />} />

                        {/* Temperature logs list/details */}
                        <Route path="/temperature-logs" element={<TemperatureLogsListPage />} />
                        <Route path="/temperature-logs/:id" element={<TemperatureLogDetailsPage />} />
                    </Route>
                    {/* Routes accessible to Owner, Accountant, delivery staff (readers) */}

                    <Route
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLES.OWNER,
                                    ROLES.ACCOUNTANT,
                                    ROLES.DELIVERY_STAFF,
                                ]}
                            />
                        }
                    >

                        <Route path="/deliveries" element={<DeliveryListPage />} />
                        <Route path="/deliveries/:id" element={<DeliveryDetailsPage />} />

                    </Route>
                    {/* Routes accessible to Owner and Accountant */}

                    <Route
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLES.OWNER,
                                    ROLES.ACCOUNTANT,
                                ]}
                            />
                        }
                    >
                        <Route path="/customers" element={<CustomerListPage />} />
                        <Route path="/customers/:id" element={<CustomerDetailsPage />} />
                        <Route path="/orders" element={<OrderListPage />} />
                        <Route path="/orders/:id" element={<OrderDetailsPage />} />
                        <Route path="/customers/create" element={<CreateCustomerPage />} />
                        <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
                        <Route path="/orders/create" element={<CreateOrderPage />} />
                        <Route path="/orders/:id/edit" element={<EditOrderPage />} />
                    </Route>

                    {/* Routes accessible to Owner and System Administrator */}
                    <Route
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLES.OWNER,
                                    ROLES.SYSTEM_ADMINISTRATOR,
                                ]}
                            />
                        }
                    >
                        <Route path="/users" element={<UserListPage />} />
                        <Route path="/users/:id" element={<UserDetailsPage />} />
                        <Route path="/users/create" element={<CreateUserPage />} />
                        <Route path="/users/:id/edit" element={<EditUserPage />} />

                        <Route path="/system-configurations" element={<SystemConfigurationListPage />} />
                        <Route
                            path="/system-configurations/:configKey"
                            element={<SystemConfigurationDetailsPage />}
                        />
                        <Route
                            path="/system-configurations/create"
                            element={<SystemConfigurationFormPage />}
                        />
                        <Route
                            path="/system-configurations/:configKey/edit"
                            element={<SystemConfigurationFormPage />}
                        />
                    </Route>

                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}