import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";

const AccessDeniedPage = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    switch (user?.role) {
      case ROLES.OWNER:
        return "/owner";

      case ROLES.FARM_WORKER:
        return "/farm-worker";

      case ROLES.DELIVERY_STAFF:
        return "/delivery-staff";

      case ROLES.ACCOUNTANT:
        return "/accountant";

      default:
        return "/login";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 shadow-lg border border-[var(--color-border)] text-center">
        <h1 className="text-3xl font-bold text-[var(--color-danger)]">
          Access Denied
        </h1>

        <p className="mt-4 text-[var(--color-text-secondary)]">
          You do not have permission to access this page.
        </p>

        <Link
          to={getDashboardPath()}
          className="mt-8 inline-flex rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage;