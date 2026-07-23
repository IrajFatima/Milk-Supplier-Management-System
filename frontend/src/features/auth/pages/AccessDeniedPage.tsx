import { useNavigate } from "react-router-dom";

const AccessDeniedPage = () => {
  const navigate = useNavigate();


  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 shadow-lg border border-[var(--color-border)] text-center">
        <h1 className="text-3xl font-bold text-[var(--color-danger)]">
          Access Denied
        </h1>

        <p className="mt-4 text-[var(--color-text-secondary)]">
          You do not have permission to access this page.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 inline-flex rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;