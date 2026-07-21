import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import { ROLES } from "../constants/roles";

const RootRedirect = () => {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) {
        return <Spinner fullScreen />;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case ROLES.FARM_WORKER:
            return <Navigate to="/farm/dashboard" replace />;

        case ROLES.DELIVERY_STAFF:
            return <Navigate to="/delivery/dashboard" replace />;

        case ROLES.SYSTEM_ADMINISTRATOR:
            return <Navigate to="/administrator/dashboard" replace />;

        case ROLES.CUSTOMER:
            return <Navigate to="/customer/dashboard" replace />;
        case ROLES.OWNER:
            return <Navigate to="/owner/dashboard" replace />;
        case ROLES.ACCOUNTANT:
            return <Navigate to="/accountant/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default RootRedirect;