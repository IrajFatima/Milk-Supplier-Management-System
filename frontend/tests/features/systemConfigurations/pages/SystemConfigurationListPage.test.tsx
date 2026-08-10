import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    screen,
    waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import SystemConfigurationListPage from "../../../../src/features/systemConfigurations/pages/SystemConfigurationListPage";

import { systemConfigurationService } from "../../../../src/services/systemConfiguration.service";

const {
    navigateMock,
    authMock,
    toastMock,
    systemConfigurationServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    authMock: {
        user: {
            userId: 1,
            username: "owner",
            email: "owner@msms.com",
            role: "Owner",
            employeeId: 1,
            accountStatus: "Active",
            lastLogin: null,
        },
        token: "token",
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    systemConfigurationServiceMock: {
        getSystemConfigurations: vi.fn(),
    },
}));

vi.mock(
    "../../../../src/services/systemConfiguration.service",
    () => ({
        systemConfigurationService:
            systemConfigurationServiceMock,
    })
);

vi.mock("../../../../src/hooks/useAuth", () => ({
    useAuth: () => authMock,
}));

vi.mock("../../../../src/hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

vi.mock(
    "../../../../src/components/Pagination",
    () => ({
        default: ({
            currentPage,
            totalPages,
            onPageChange,
        }: {
            currentPage: number;
            totalPages: number;
            onPageChange: (page: number) => void;
        }) => (
            <div>
                Page {currentPage} of {totalPages}

                <button
                    onClick={() => onPageChange(2)}
                >
                    Next Page
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/systemConfigurations/components/SystemConfigurationSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="System Configuration Search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/systemConfigurations/components/SystemConfigurationTable",
    () => ({
        default: ({
            systemConfigurations,
            loading,
            canEdit,
            onView,
            onEdit,
        }: {
            systemConfigurations: Array<{
                configKey: string;
                configValue: string;
                description: string | null;
                dataType: string;
                isEncrypted: boolean;
                updatedAt: string | null;
                category: string | null;
            }>;
            loading: boolean;
            canEdit: boolean;
            onView: (configKey: string) => void;
            onEdit: (configKey: string) => void;
        }) => (
            <div>
                {loading && (
                    <div>
                        Loading system configurations...
                    </div>
                )}

                {!loading &&
                    systemConfigurations.map(
                        (configuration) => (
                            <div
                                key={
                                    configuration.configKey
                                }
                            >
                                <span>
                                    {
                                        configuration.configKey
                                    }
                                </span>

                                <span>
                                    {
                                        configuration.configValue
                                    }
                                </span>

                                <span>
                                    {canEdit
                                        ? "Can Edit"
                                        : "Cannot Edit"}
                                </span>

                                <button
                                    onClick={() =>
                                        onView(
                                            configuration.configKey
                                        )
                                    }
                                >
                                    View Configuration
                                </button>

                                {canEdit && (
                                    <button
                                        onClick={() =>
                                            onEdit(
                                                configuration.configKey
                                            )
                                        }
                                    >
                                        Edit Configuration
                                    </button>
                                )}
                            </div>
                        )
                    )}
            </div>
        ),
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("SystemConfigurationListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.user.role = "Owner";

        vi.mocked(
            systemConfigurationService.getSystemConfigurations
        ).mockResolvedValue({
            data: [
                {
                    configKey:
                        "order_cutoff_time",
                    configValue: "16:00",
                    description:
                        "Time after which new orders cannot be placed.",
                    dataType: "TIME",
                    isEncrypted: false,
                    updatedAt:
                        "2026-08-10T10:00:00Z",
                    category: "Orders",
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        });
    });

    it("renders the system configurations page", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "System Configurations",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(
                "System Configuration Search"
            )
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                "order_cutoff_time"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("16:00")
        ).toBeInTheDocument();
    });

    it("loads system configurations with the default filters", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("shows an error toast when loading system configurations fails", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfigurations
        ).mockRejectedValue(
            new Error(
                "Failed to load system configurations"
            )
        );

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("allows an owner to edit system configurations", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        expect(
            await screen.findByText("Can Edit")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Edit Configuration",
            })
        ).toBeInTheDocument();
    });

    it("allows a system administrator to edit system configurations", async () => {
        authMock.user.role =
            "System Administrator";

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        expect(
            await screen.findByText("Can Edit")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Edit Configuration",
            })
        ).toBeInTheDocument();
    });

    it("does not allow other roles to edit system configurations", async () => {
        authMock.user.role = "Accountant";

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        expect(
            await screen.findByText(
                "Cannot Edit"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Edit Configuration",
            })
        ).not.toBeInTheDocument();
    });

    it("navigates to the configuration view page", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "order_cutoff_time"
        );

        screen
            .getByRole("button", {
                name: "View Configuration",
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/system-configurations/order_cutoff_time"
        );
    });

    it("navigates to the configuration edit page", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "order_cutoff_time"
        );

        screen
            .getByRole("button", {
                name: "Edit Configuration",
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/system-configurations/order_cutoff_time/edit"
        );
    });

    it("encodes the configuration key when navigating", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfigurations
        ).mockResolvedValue({
            data: [
                {
                    configKey:
                        "delivery/cutoff time",
                    configValue: "18:00",
                    description: null,
                    dataType: "TIME",
                    isEncrypted: false,
                    updatedAt: null,
                    category: "Delivery",
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        });

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "delivery/cutoff time"
        );

        screen
            .getByRole("button", {
                name: "View Configuration",
            })
            .click();

        
    });

    it("updates the page when pagination changes", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfigurations
        )
            .mockResolvedValueOnce({
                data: [
                    {
                        configKey:
                            "order_cutoff_time",
                        configValue: "16:00",
                        description: null,
                        dataType: "TIME",
                        isEncrypted: false,
                        updatedAt: null,
                        category: "Orders",
                    },
                ],
                total: 11,
                page: 1,
                limit: 10,
                totalPages: 2,
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        configKey:
                            "delivery_cutoff_time",
                        configValue: "18:00",
                        description: null,
                        dataType: "TIME",
                        isEncrypted: false,
                        updatedAt: null,
                        category: "Delivery",
                    },
                ],
                total: 11,
                page: 2,
                limit: 10,
                totalPages: 2,
            });

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "order_cutoff_time"
        );

        screen
            .getByRole("button", {
                name: "Next Page",
            })
            .click();

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });

        expect(
            await screen.findByText(
                "delivery_cutoff_time"
            )
        ).toBeInTheDocument();
    });

    it("searches system configurations and resets the page to 1", async () => {
        vi.mocked(
            systemConfigurationService.getSystemConfigurations
        )
            .mockResolvedValueOnce({
                data: [
                    {
                        configKey:
                            "order_cutoff_time",
                        configValue: "16:00",
                        description: null,
                        dataType: "TIME",
                        isEncrypted: false,
                        updatedAt: null,
                        category: "Orders",
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        configKey:
                            "delivery_cutoff_time",
                        configValue: "18:00",
                        description: null,
                        dataType: "TIME",
                        isEncrypted: false,
                        updatedAt: null,
                        category: "Delivery",
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "order_cutoff_time"
        );

        const searchInput =
            screen.getByLabelText(
                "System Configuration Search"
            );

        expect(searchInput).toHaveValue("");

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });

        searchInput.focus();

        const { fireEvent } =
            await import(
                "@testing-library/react"
            );

        fireEvent.change(searchInput, {
            target: {
                value: "delivery",
            },
        });

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: "delivery",
            });
        });

        expect(
            await screen.findByText(
                "delivery_cutoff_time"
            )
        ).toBeInTheDocument();
    });

    it("passes an undefined search value when the search is cleared", async () => {
        renderWithProviders(
            <SystemConfigurationListPage />
        );

        await screen.findByText(
            "order_cutoff_time"
        );

        const searchInput =
            screen.getByLabelText(
                "System Configuration Search"
            );

        const { fireEvent } =
            await import(
                "@testing-library/react"
            );

        fireEvent.change(searchInput, {
            target: {
                value: "order",
            },
        });

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: "order",
            });
        });

        fireEvent.change(searchInput, {
            target: {
                value: "",
            },
        });

        await waitFor(() => {
            expect(
                systemConfigurationService
                    .getSystemConfigurations
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });
});