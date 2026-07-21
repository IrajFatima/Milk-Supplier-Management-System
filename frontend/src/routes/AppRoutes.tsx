import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import AccessDeniedPage from "../features/auth/pages/AccessDeniedPage";
import RootRedirect from "./RootRedirect";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import { ROLES } from "../constants/roles";
import type { Role } from "../constants/roles"; // adjust path if needed
import UserProfile from "../features/auth/pages/UserProfile";
import NotFoundPage from "../features/auth/pages/NotFoundPage";
import AnimalListPage from "../features/animals/pages/AnimalListPage";
import CreateAnimalPage from "../features/animals/pages/CreateAnimalPage";
import EditAnimalPage from "../features/animals/pages/EditAnimalPage";
import AnimalDetailsPage from "../features/animals/pages/AnimalDetailsPage";

export default function AppRoutes() {
    const roles: [Role, string, string][] = [
        [ROLES.OWNER, "/owner/dashboard", "Owner"],
        [ROLES.FARM_WORKER, "/farm/dashboard", "Farm"],
        [ROLES.DELIVERY_STAFF, "/delivery/dashboard", "Delivery"],
        [ROLES.ACCOUNTANT, "/accountant/dashboard", "Accountant"],
        [ROLES.SYSTEM_ADMINISTRATOR, "/administrator/dashboard", "Administrator"],
        [ROLES.CUSTOMER, "/customer/dashboard", "Customer"],
    ];

    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    {roles.map(([role, path, name]) => (
                        <Route key={path} element={<RoleProtectedRoute allowedRoles={[role]} />}>
                            <Route path={path} element={<div>{name} Dashboard</div>} />
                        </Route>
                    ))}
                    <Route path="/profile" element={<UserProfile />} />
                    <Route element={<RoleProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.FARM_WORKER]} />}>
                        <Route path="/animals" element={<AnimalListPage />} />
                        <Route path="/animals/:id" element={<AnimalDetailsPage />} />
                        <Route path="/animals/create" element={<CreateAnimalPage />} />
                        <Route path="/animals/:id/edit" element={<EditAnimalPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}