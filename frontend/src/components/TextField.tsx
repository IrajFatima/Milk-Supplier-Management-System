import {
    forwardRef,
    type InputHTMLAttributes,
} from "react";
import type { ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, error, required, leftIcon, rightIcon, className = "", disabled, ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label className={`mb-2 block text-sm font-medium text-[var(--color-text)] ${disabled ? 'opacity-60' : ''}`}>
                        {label}

                        {required && (
                            <span className="ml-1 text-[var(--color-danger)]">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] ${disabled ? 'opacity-50' : ''}`}>
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        disabled={disabled}
                        {...props}
                        className={`
                            w-full
                            rounded-lg
                            border
                            bg-[var(--color-surface)]
                            py-2
                            text-[var(--color-text)]
                            outline-none
                            transition

                            ${leftIcon ? "pl-10" : "px-4"}
                            ${rightIcon ? "pr-10" : ""}

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
                    />

                    {rightIcon && (
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] ${disabled ? 'opacity-50' : ''}`}>
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-[var(--color-danger)]">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextField.displayName = "TextField";

export default TextField;