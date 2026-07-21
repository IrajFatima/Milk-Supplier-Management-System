import { useEffect, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    closeOnOverlayClick?: boolean;
}

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    isOpen,
    title,
    children,
    onClose,
    footer,
    size = "md",
    closeOnOverlayClick = true,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Prevent background scrolling
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
                if (closeOnOverlayClick) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`
                    w-full
                    ${sizeClasses[size]}
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    shadow-xl
                `}
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-[var(--color-text)]"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-md
                            p-1
                            text-[var(--color-text-secondary)]
                            transition-colors
                            hover:bg-[var(--color-background)]
                            hover:text-[var(--color-text)]
                        "
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}