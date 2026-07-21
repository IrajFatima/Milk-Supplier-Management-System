import type {
    SelectHTMLAttributes,
    ReactNode,
} from "react";

interface DropdownProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
}

export default function Dropdown({
    label,
    error,
    required,
    children,
    className = "",
    disabled,
    ...props
}: DropdownProps) {
    return (
        <div>
            {label && (
                <label className={`mb-2 block text-sm font-medium text-[var(--color-text)] ${disabled ? 'opacity-60' : ''}`}>
                    {label}

                    {required && (
                        <span className="ml-1 text-[var(--color-danger)]">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="relative">
                <select
                    disabled={disabled}
                    {...props}
                    className={`
                        w-full
                        rounded-lg
                        border
                        bg-[var(--color-surface)]
                        px-4
                        py-2
                        pr-10
                        text-[var(--color-text)]
                        outline-none
                        transition
                        appearance-none

                        ${error
                                        ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-red-200"
                                        : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                    }

                        ${disabled
                                        ? "cursor-not-allowed bg-[#F1F5F9] text-[var(--color-text-secondary)] opacity-70"
                                        : ""
                                    }

                        ${className}
                    `}
                >
                    {children}
                </select>

                <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {error && (
                <p className="mt-1 text-sm text-[var(--color-danger)]">
                    {error}
                </p>
            )}
        </div>
    );
}