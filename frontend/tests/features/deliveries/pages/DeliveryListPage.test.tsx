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

import DeliveryListPage from "../../../../src/features/deliveries/pages/DeliveryListPage";


const {
    deliveryServiceMock,
    orderServiceMock,
    navigateMock,
    toastMock,
    authMock,
} = vi.hoisted(() => ({
    deliveryServiceMock: {
        getDeliveries: vi.fn(),
        getMyDeliveries: vi.fn(),
        getDeliveryById: vi.fn(),
        getMyDeliveryById: vi.fn(),
        getDeliveryStaff: vi.fn(),
    },

    orderServiceMock: {
        getMilkTypes: vi.fn(),
    },

    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

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
}));

vi.mock(
    "../../../../src/services/delivery.service",
    () => ({
        deliveryService: deliveryServiceMock,
    })
);

vi.mock(
    "../../../../src/services/order.service",
    () => ({
        orderService: orderServiceMock,
    })
);

vi.mock(
    "../../../../src/hooks/useAuth",
    () => ({
        useAuth: () => authMock,
    })
);

vi.mock(
    "../../../../src/hooks/useDebounce",
    () => ({
        default: (value: string) => value,
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
            onPageChange: (
                page: number
            ) => void;
        }) => (
            <div>
                <span>
                    Page {currentPage} of{" "}
                    {totalPages}
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
    "../../../../src/features/deliveries/components/DeliverySearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (
                value: string
            ) => void;
        }) => (
            <input
                aria-label="Delivery Search"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/deliveries/components/DeliveryFilters",
    () => ({
        default: () => (
            <div>Delivery Filters</div>
        ),
    })
);

vi.mock(
    "../../../../src/features/deliveries/components/DeliveryTable",
    () => ({
        default: ({
            deliveries,
            loading,
            canAssign,
            canUpdate,
            onView,
            onUpdate,
        }: {
            deliveries: Array<{
                deliveryId: number;
                customerName: string;
            }>;
            loading: boolean;
            canAssign: boolean;
            canUpdate: boolean;
            onView: (id: number) => void;
            onUpdate: (
                delivery: {
                    deliveryId: number;
                }
            ) => void;
        }) => (
            <div>
                {loading && (
                    <div>
                        Loading deliveries...
                    </div>
                )}

                {!loading &&
                    deliveries.map(
                        (delivery) => (
                            <div
                                key={
                                    delivery.deliveryId
                                }
                            >
                                <span>
                                    {
                                        delivery.customerName
                                    }
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onView(
                                            delivery.deliveryId
                                        )
                                    }
                                >
                                    View Delivery
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onUpdate(
                                            delivery
                                        )
                                    }
                                >
                                    Update Delivery
                                </button>
                            </div>
                        )
                    )}

                <span>
                    {canAssign
                        ? "Can Assign"
                        : "Cannot Assign"}
                </span>

                <span>
                    {canUpdate
                        ? "Can Update"
                        : "Cannot Update"}
                </span>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/deliveries/components/AssignDeliveryModal",
    () => ({
        default: () => null,
    })
);

vi.mock(
    "../../../../src/features/deliveries/components/UpdateDeliveryStatusModal",
    () => ({
        default: () => null,
    })
);

describe("DeliveryListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.user.role = "Owner";

        deliveryServiceMock.getDeliveries.mockResolvedValue(
            {
                data: [
                    {
                        deliveryId: 1,
                        customerName:
                            "John Doe",
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            }
        );

        deliveryServiceMock.getMyDeliveries.mockResolvedValue(
            {
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            }
        );

        deliveryServiceMock.getDeliveryStaff.mockResolvedValue(
            []
        );

        orderServiceMock.getMilkTypes.mockResolvedValue(
            []
        );
    });

    it("renders the delivery planning page", async () => {
        renderWithProviders(
            <DeliveryListPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Delivery Planning",
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                "John Doe"
            )
        ).toBeInTheDocument();
    });

    it("loads deliveries, milk types, and delivery staff for owner", async () => {
        renderWithProviders(
            <DeliveryListPage />
        );

        await waitFor(() => {
            expect(
                deliveryServiceMock.getDeliveries
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });

            expect(
                orderServiceMock.getMilkTypes
            ).toHaveBeenCalled();

            expect(
                deliveryServiceMock.getDeliveryStaff
            ).toHaveBeenCalled();
        });
    });

    it("uses my deliveries for delivery staff", async () => {
        authMock.user.role =
            "Delivery Staff";

        renderWithProviders(
            <DeliveryListPage />
        );

        await waitFor(() => {
            expect(
                deliveryServiceMock.getMyDeliveries
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });

        expect(
            deliveryServiceMock.getDeliveries
        ).not.toHaveBeenCalled();

        expect(
            deliveryServiceMock.getDeliveryStaff
        ).not.toHaveBeenCalled();

        expect(
            screen.getByText("Cannot Assign")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Can Update")
        ).toBeInTheDocument();
    });

    it("shows an error toast when deliveries fail to load", async () => {
        deliveryServiceMock.getDeliveries.mockRejectedValue(
            new Error(
                "Failed to load deliveries"
            )
        );

        renderWithProviders(
            <DeliveryListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("navigates to delivery details", async () => {
        renderWithProviders(
            <DeliveryListPage />
        );

        await screen.findByText(
            "John Doe"
        );

        screen
            .getByRole("button", {
                name: "View Delivery",
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/deliveries/1"
        );
    });

    it("updates deliveries when pagination changes", async () => {
        renderWithProviders(
            <DeliveryListPage />
        );

        await screen.findByText(
            "John Doe"
        );

        screen
            .getByRole("button", {
                name: "Next Page",
            })
            .click();

        await waitFor(() => {
            expect(
                deliveryServiceMock.getDeliveries
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });
    });
});