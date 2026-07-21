// src/components/Spinner.tsx

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const Spinner = ({
  size = "md",
  fullScreen = false,
  className = "",
}: SpinnerProps) => {
  const spinner = (
    <div
      className={`${SIZE_CLASSES[size]} animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)] ${className}`}
      aria-label="Loading"
      role="status"
    />
  );

  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-4">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
      {spinner}
    </div>
  );
};

export default Spinner;