import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
            <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-[var(--color-danger)]">
                    <FaExclamationTriangle size={36} />
                </div>

                <h1 className="mt-6 text-6xl font-bold text-[var(--color-text)]">
                    404
                </h1>

                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                    Page Not Found
                </h2>

                <p className="mt-4 text-[var(--color-text-secondary)]">
                    The page you are looking for doesn't exist or may have been
                    moved.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
                >
                    <FaArrowLeft />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;