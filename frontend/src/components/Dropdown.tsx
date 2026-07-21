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
                    text-[var(--color-text)]
                    outline-none
                    transition
                    appearance-none
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236B7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E')]
                    bg-[length:20px_20px]
                    bg-[right_0.75rem_center]
                    bg-no-repeat
                    pr-10

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

            {error && (
                <p className="mt-1 text-sm text-[var(--color-danger)]">
                    {error}
                </p>
            )}
        </div>
    );
}