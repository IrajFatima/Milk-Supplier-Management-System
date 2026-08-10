import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../../src/context/AuthContext";
import AuthLayout from "../../src/layouts/AuthLayout";

vi.mock("../../src/layouts/Header", () => ({
    default: ({ onMenuClick }: { onMenuClick: () => void }) => (
        <header>
            <span>Header</span>
            <button
                type="button"
                aria-label="Menu"
                onClick={onMenuClick}
            >
                Menu
            </button>
        </header>
    ),
}));

vi.mock("../../src/layouts/Sidebar", () => ({
    default: ({
        mobile,
        onClose,
    }: {
        mobile?: boolean;
        onClose?: () => void;
    }) => (
        <aside data-testid={mobile ? "mobile-sidebar" : "desktop-sidebar"}>
            <span>Sidebar</span>

            {mobile && onClose && (
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                >
                    Close
                </button>
            )}
        </aside>
    ),
}));

vi.mock("../../src/layouts/Footer", () => ({
    default: () => <footer>Footer</footer>,
}));

function renderAuthLayout() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <AuthLayout />
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("AuthLayout component", () => {
    it("renders the Header, Sidebar, and Footer components", () => {
        const { getByText, getByTestId } = renderAuthLayout();

        expect(getByText("Header")).toBeTruthy();
        expect(getByTestId("desktop-sidebar")).toBeTruthy();
        expect(getByTestId("mobile-sidebar")).toBeTruthy();
        expect(getByText("Footer")).toBeTruthy();
    });

    it("toggles the mobile sidebar open and closed", () => {
        const { getByRole, getByTestId } = renderAuthLayout();

        const mobileSidebar = getByTestId("mobile-sidebar");

        // The mobile sidebar is initially closed.
        expect(mobileSidebar.parentElement).toHaveClass(
            "-translate-x-full"
        );

        const menuButton = getByRole("button", {
            name: "Menu",
        });

        fireEvent.click(menuButton);

        // The mobile sidebar is now open.
        expect(mobileSidebar.parentElement).toHaveClass(
            "translate-x-0"
        );

        const closeButton = getByRole("button", {
            name: "Close",
        });

        fireEvent.click(closeButton);

        // The mobile sidebar is closed again.
        expect(mobileSidebar.parentElement).toHaveClass(
            "-translate-x-full"
        );
    });
});