// src/routes/RoleProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import type { Role } from "../constants/roles";
import Spinner from "../components/Spinner";

interface RoleProtectedRouteProps {
  allowedRoles: Role[];
}

export default function RoleProtectedRoute({
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner  fullScreen/>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}