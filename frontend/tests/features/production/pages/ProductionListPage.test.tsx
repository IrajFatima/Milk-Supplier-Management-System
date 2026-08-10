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

import ProductionListPage from "../../../../src/features/production/pages/ProductionListPage";

import { productionService } from "../../../../src/services/production.service";

const {
    navigateMock,
    authMock,
    toastMock,
    productionServiceMock,
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

    productionServiceMock: {
        getProductions: vi.fn(),
        getProductionAnimals: vi.fn(),
    },
}));

vi.mock(
    "../../../../src/services/production.service",
    () => ({
        productionService: productionServiceMock,
    })
);

vi.mock("../../../../src/hooks/useAuth", () => ({
    useAuth: () => authMock,
}));

vi.mock("../../../../src/hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
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
                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    type="button"
                    onClick={() => onPageChange(2)}
                >
                    Next Page
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/production/components/ProductionSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="Production Search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/production/components/ProductionFilters",
    () => ({
        default: ({
            filters,
            animals,
            onChange,
        }: {
            filters: {
                page: number;
                limit: number;
            };
            animals: Array<{
                animalId: number;
                tagId: string;
                name: string | null;
            }>;
            onChange: (filters: {
                page?: number;
                limit?: number;
                animalId?: number;
            }) => void;
        }) => (
            <div>
                <span>
                    Production Filters
                </span>

                <span>
                    Animals: {animals.length}
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onChange({
                            ...filters,
                            animalId: 1,
                            page: 1,
                        })
                    }
                >
                    Apply Filter
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/production/components/ProductionTable",
    () => ({
        default: ({
            productions,
            loading,
            role,
            onView,
            onEdit,
            onVoid,
        }: {
            productions: Array<{
                productionId: number;
                animalId: number;
                quantityProduced: number;
            }>;
            loading: boolean;
            role?: string;
            onView: (id: number) => void;
            onEdit: (id: number) => void;
            onVoid: (id: number) => void;
        }) => (
            <div>
                {loading && (
                    <div>
                        Loading production records...
                    </div>
                )}

                {!loading &&
                    productions.map((production) => (
                        <div key={production.productionId}>
                            <span>
                                Production{" "}
                                {production.productionId}
                            </span>

                            <span>
                                Quantity:{" "}
                                {production.quantityProduced}
                            </span>

                            <span>
                                Role: {role}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onView(
                                        production.productionId
                                    )
                                }
                            >
                                View Production
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onEdit(
                                        production.productionId
                                    )
                                }
                            >
                                Edit Production
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onVoid(
                                        production.productionId
                                    )
                                }
                            >
                                Void Production
                            </button>
                        </div>
                    ))}
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/production/components/VoidProductionModal",
    () => ({
        default: ({
            isOpen,
            productionId,
            onClose,
            onConfirm,
        }: {
            isOpen: boolean;
            productionId: number | null;
            onClose: () => void;
            onConfirm: () => void;
        }) => {
            if (!isOpen) {
                return null;
            }

            return (
                <div role="dialog">
                    <h2>
                        Void Production Modal
                    </h2>

                    <span>
                        Production ID: {productionId}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close Void Modal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                    >
                        Confirm Void Production
                    </button>
                </div>
            );
        },
    })
);

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

describe("ProductionListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.user.role = "Owner";

        vi.mocked(
            productionService.getProductions
        ).mockResolvedValue({
            data: [
                {
                    productionId: 1,
                    animalId: 1,
                    status: "Active",
                    productionDate:
                        "2026-08-10T00:00:00.000Z",
                    productionShift: "Morning",
                    quantityProduced: 25.5,
                    fatPercentage: 4.2,
                    snfPercentage: 8.7,
                    milkTemperature: 4.5,
                    qualityStatus: "Passed",
                    recordedBy: 1,
                    facilityId: 1,
                    animalTagId: "A001",
                    animalName: "Bella",
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        });

        vi.mocked(
            productionService.getProductionAnimals
        ).mockResolvedValue([
            {
                animalId: 1,
                tagId: "A001",
                name: "Bella",
            },
        ]);
    });

    it("renders the production management page", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Milk Production",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /add production/i,
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText("Production 1")
        ).toBeInTheDocument();
    });

    it("loads productions with the default filters", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        await waitFor(() => {
            expect(
                productionService.getProductions
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("loads production animals for filters", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        await waitFor(() => {
            expect(
                productionService.getProductionAnimals
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText("Animals: 1")
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading productions fails", async () => {
        vi.mocked(
            productionService.getProductions
        ).mockRejectedValue(
            new Error("Failed to load productions")
        );

        renderWithProviders(
            <ProductionListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("shows an error toast when loading production animals fails", async () => {
        vi.mocked(
            productionService.getProductionAnimals
        ).mockRejectedValue(
            new Error("Failed to load animals")
        );

        renderWithProviders(
            <ProductionListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("navigates to create production page", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        screen
            .getByRole("button", {
                name: /add production/i,
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/production/create"
        );
    });

    it("does not show the add production button for roles without create permission", async () => {
        authMock.user.role = "Accountant";

        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        expect(
            screen.queryByRole("button", {
                name: /add production/i,
            })
        ).not.toBeInTheDocument();
    });

    it("shows the add production button for a farm worker", async () => {
        authMock.user.role = "Farm Worker";

        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        expect(
            screen.getByRole("button", {
                name: /add production/i,
            })
        ).toBeInTheDocument();
    });

    it("navigates to the production details page", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        screen
            .getByRole("button", {
                name: "View Production",
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/production/1"
        );
    });

    it("navigates to the production edit page", async () => {
        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        screen
            .getByRole("button", {
                name: "Edit Production",
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/production/1/edit"
        );
    });

    it("updates the page when pagination changes", async () => {
        vi.mocked(
            productionService.getProductions
        )
            .mockResolvedValueOnce({
                data: [
                    {
                        productionId: 1,
                        animalId: 1,
                        status: "Active",
                        productionDate:
                            "2026-08-10T00:00:00.000Z",
                        productionShift: "Morning",
                        quantityProduced: 25.5,
                        fatPercentage: 4.2,
                        snfPercentage: 8.7,
                        milkTemperature: 4.5,
                        qualityStatus: "Passed",
                        recordedBy: 1,
                        facilityId: 1,
                    },
                ],
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 20,
                page: 2,
                limit: 10,
                totalPages: 2,
            });

        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        screen
            .getByRole("button", {
                name: "Next Page",
            })
            .click();

        await waitFor(() => {
            expect(
                productionService.getProductions
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("updates the search and resets the page to 1", async () => {
        vi.mocked(
            productionService.getProductions
        )
            .mockResolvedValueOnce({
                data: [
                    {
                        productionId: 1,
                        animalId: 1,
                        status: "Active",
                        productionDate:
                            "2026-08-10T00:00:00.000Z",
                        productionShift: "Morning",
                        quantityProduced: 25.5,
                        fatPercentage: 4.2,
                        snfPercentage: 8.7,
                        milkTemperature: 4.5,
                        qualityStatus: "Passed",
                        recordedBy: 1,
                        facilityId: 1,
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        const searchInput =
            screen.getByRole("textbox", {
                name: "Production Search",
            });

        searchInput.dispatchEvent(
            new Event("input", {
                bubbles: true,
            })
        );

        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
        )?.set?.call(
            searchInput,
            "Bella"
        );

        searchInput.dispatchEvent(
            new Event("change", {
                bubbles: true,
            })
        );

        await waitFor(() => {
            expect(
                productionService.getProductions
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: "Bella",
            });
        });
    });

    it("updates filters and reloads productions", async () => {
        vi.mocked(
            productionService.getProductions
        )
            .mockResolvedValueOnce({
                data: [
                    {
                        productionId: 1,
                        animalId: 1,
                        status: "Active",
                        productionDate:
                            "2026-08-10T00:00:00.000Z",
                        productionShift: "Morning",
                        quantityProduced: 25.5,
                        fatPercentage: 4.2,
                        snfPercentage: 8.7,
                        milkTemperature: 4.5,
                        qualityStatus: "Passed",
                        recordedBy: 1,
                        facilityId: 1,
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <ProductionListPage />
        );

        await screen.findByText("Production 1");

        screen
            .getByRole("button", {
                name: "Apply Filter",
            })
            .click();

        await waitFor(() => {
            expect(
                productionService.getProductions
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                animalId: 1,
                search: undefined,
            });
        });
    });
});