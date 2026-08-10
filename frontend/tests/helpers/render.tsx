import {
    render,
    type RenderResult,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import type { ReactElement } from "react";

import { AuthContext } from "../../src/context/AuthContext";
import type { PublicUser } from "../../src/types/user.types";

const defaultUser: PublicUser = {
    userId: 1,
    username: "owner",
    email: "owner@msms.com",
    role: "Owner",
    employeeId: 1,
    accountStatus: "Active",
    lastLogin: null,
};

export interface AuthMock {
    user: PublicUser | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: PublicUser) => void;
    logout: () => Promise<void>;
}

export function createAuthMock(
    overrides: Partial<AuthMock> = {}
): AuthMock {
    const user =
        overrides.user === undefined
            ? defaultUser
            : overrides.user;

    return {
        user,
        token:
            overrides.token === undefined
                ? "token"
                : overrides.token,
        loading: overrides.loading ?? false,
        isAuthenticated:
            overrides.isAuthenticated === undefined
                ? !!user
                : overrides.isAuthenticated,
        login: vi.fn(),
        logout: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    };
}

interface RenderOptions {
    route?: string;
    auth?: AuthMock;
}

export function renderWithProviders(
    ui: ReactElement,
    options: RenderOptions = {}
): RenderResult {
    const {
        route = "/",
        auth = createAuthMock(),
    } = options;

    return render(
        <MemoryRouter initialEntries={[route]}>
            <AuthContext.Provider value={auth}>
                {ui}
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

export { defaultUser };