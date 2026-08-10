import { createElement } from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthContext, AuthProvider } from "../../src/context/AuthContext";
import { useAuth } from "../../src/hooks/useAuth";
import type { PublicUser } from "../../src/types/user.types";
import type { ReactNode } from "react";

const user: PublicUser = {
    userId: 1,
    username: "owner",
    email: "owner@msms.com",
    role: "Owner",
    employeeId: 1,
    accountStatus: "Active",
    lastLogin: null,
};

const contextValue = {
    user,
    token: "token",
    loading: false,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
};

function wrapper({ children }: { children: ReactNode }) {
    return createElement(
        AuthContext.Provider,
        { value: contextValue },
        children
    );
}

describe("useAuth", () => {
    it("returns the auth context value when inside a provider", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.user).toEqual(user);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("throws an error when used outside of an AuthProvider", () => {
        expect(() => renderHook(() => useAuth())).toThrow(
            "useAuth must be used within an AuthProvider."
        );
    });

    it("is usable inside an AuthProvider", () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) =>
                createElement(AuthProvider, null, children),
        });
        expect(result.current.loading).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
    });
});
