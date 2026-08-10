import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import { AuthContext } from "../../../../src/context/AuthContext";

import OrderListPage from "../../../../src/features/orders/pages/OrderListPage";

import { Role } from "../../../../src/constants/roles";
import { AccountStatus } from "../../../../src/constants/user";

const {
    orderServiceMock,
    toastMock,
} = vi.hoisted(() => ({
    orderServiceMock: {
        getOrders: vi.fn(),
        getSubscriptions: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

vi.mock(
    "../../../../src/services/order.service",
    () => ({
        orderService: orderServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/features/orders/components/OrderSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="search orders"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/orders/components/OrderFilters",
    () => ({
        default: () => (
            <div>Order Filters</div>
        ),
    })
);

vi.mock(
    "../../../../src/features/orders/components/OrderTable",
    () => ({
        default: ({
            orders,
            onView,
            onEdit,
        }: {
            orders: Array<{
                orderId: number;
            }>;
            onView: (id: number) => void;
            onEdit: (id: number) => void;
        }) => (
            <div>
                {orders.map((order) => (
                    <div key={order.orderId}>
                        <span>
                            Order {order.orderId}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                onView(
                                    order.orderId
                                )
                            }
                        >
                            View
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onEdit(
                                    order.orderId
                                )
                            }
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/orders/components/CancelOrderModal",
    () => ({
        default: () => null,
    })
);

vi.mock(
    "../../../../src/features/orders/components/ChangeOrderStatusModal",
    () => ({
        default: () => null,
    })
);

vi.mock(
    "../../../../src/features/orders/components/ReactivateOrderModal",
    () => ({
        default: () => null,
    })
);

vi.mock(
    "../../../../src/components/Pagination",
    () => ({
        default: () => null,
    })
);

vi.mock(
    "../../../../src/hooks/useDebounce",
    () => ({
        default: (value: string) => value,
    })
);

function renderPage(role = "Owner") {
    const authMock = {
        user: {
            userId: 1,
            username: "testuser",
            email: "test@example.com",
            role: role as Role,
            employeeId: 1,
            accountStatus: "Active" as AccountStatus,
            lastLogin: null,
        },
        token: "token",
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
    };

    return renderWithProviders(
        <AuthContext.Provider value={authMock}>
            <OrderListPage />
        </AuthContext.Provider>
    );
}

describe("OrderListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        orderServiceMock.getOrders.mockResolvedValue({
            data: [
                {
                    orderId: 1,
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
        });

        orderServiceMock.getSubscriptions.mockResolvedValue({
            data: [],
            total: 0,
            page: 1,
            limit: 10,
        });
    });

    it("loads one-time orders", async () => {
        renderPage();

        await waitFor(() => {
            expect(
                orderServiceMock.getOrders
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByText("Orders")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Order 1")
        ).toBeInTheDocument();
    });

    it("loads subscriptions when the view is changed", async () => {
        renderPage();

        await waitFor(() => {
            expect(
                orderServiceMock.getOrders
            ).toHaveBeenCalled();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Subscriptions",
            })
        );

        await waitFor(() => {
            expect(
                orderServiceMock.getSubscriptions
            ).toHaveBeenCalled();
        });
    });

    it("shows Add Order for users who can create orders", async () => {
        renderPage("Owner");

        await waitFor(() => {
            expect(
                orderServiceMock.getOrders
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByRole("button", {
                name: /add order/i,
            })
        ).toBeInTheDocument();
    });

    it("shows Add Subscription after switching to subscriptions", async () => {
        renderPage("Owner");

        await waitFor(() => {
            expect(
                orderServiceMock.getOrders
            ).toHaveBeenCalled();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Subscriptions",
            })
        );

        expect(
            screen.getByRole("button", {
                name: /add subscription/i,
            })
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading orders fails", async () => {
        orderServiceMock.getOrders.mockRejectedValue(
            new Error("Request failed")
        );

        renderPage();

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });
});