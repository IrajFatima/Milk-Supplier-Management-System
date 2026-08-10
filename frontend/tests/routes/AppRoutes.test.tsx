import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { AuthProvider } from "../../src/context/AuthContext";
import AppRoutes from "../../src/routes/AppRoutes";

describe("AppRoutes", () => {
    it("renders without crashing", () => {
        expect(() => {
            render(
                <MemoryRouter initialEntries={["/"]}>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </MemoryRouter>
            );
        }).not.toThrow();
    });
});