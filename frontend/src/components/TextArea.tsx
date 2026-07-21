import {
    forwardRef,
    type TextareaHTMLAttributes,
} from "react";

interface TextAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

const TextArea = forwardRef<
    HTMLTextAreaElement,
    TextAreaProps
>(
    (
        {
            label,
            error,
            required,
            className = "",
            rows = 4,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div>
                <label className={`mb-2 block text-sm font-medium text-[var(--color-text)] ${disabled ? 'opacity-60' : ''}`}>
                    {label}

                    {required && (
                        <span className="ml-1 text-[var(--color-danger)]">
                            *
                        </span>
                    )}
                </label>

                <textarea
                    ref={ref}
                    rows={rows}
                    disabled={disabled}
                    {...props}
                    className={`w-full rounded-lg border bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] outline-none transition resize-y
                        ${
                            error
                                ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-red-200"
                                : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                        }
                        ${
                            disabled 
                                ? "cursor-not-allowed bg-[#F1F5F9] text-[var(--color-text-secondary)] opacity-70" 
                                : ""
                        }
                        ${className}`}
                />

                {error && (
                    <p className="mt-1 text-sm text-[var(--color-danger)]">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;