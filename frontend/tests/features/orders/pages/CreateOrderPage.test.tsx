import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    screen,
    waitFor,
} from "@testing-library/react";

import { renderWithProviders } from "../../../../tests/helpers/render";

import CreateOrderPage from "../../../../src/features/orders/pages/CreateOrderPage";

const {
    orderServiceMock,
    navigateMock,
    toastMock,
} = vi.hoisted(() => ({
    orderServiceMock: {
        createSubscription: vi.fn(),
        createOrder: vi.fn(),
    },

    navigateMock: vi.fn(),

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
    "../../../../src/features/orders/components/OrderForm",
    () => ({
        default: ({
            initialOrderType,
            onCreateSubscription,
            onCreateOrder,
        }: {
            initialOrderType: string;
            onCreateSubscription: (
                data: unknown
            ) => Promise<void>;
            onCreateOrder: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <div>
                <div>Create Order Form</div>

                <div>{initialOrderType}</div>

                <button
                    type="button"
                    onClick={() =>
                        onCreateSubscription({
                            customerId: 1,
                            quantity: 10,
                        })
                    }
                >
                    Create Subscription
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onCreateOrder({
                            customerId: 1,
                            quantity: 5,
                        })
                    }
                >
                    Create Order
                </button>
            </div>
        ),
    })
);

describe("CreateOrderPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        orderServiceMock.createSubscription.mockResolvedValue({
            orderId: 1,
        });

        orderServiceMock.createOrder.mockResolvedValue({
            orderId: 2,
        });
    });

    it("renders the create order page", () => {
        renderWithProviders(<CreateOrderPage />);

        expect(
            screen.getByRole("heading", {
                name: "Create Order",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Create Order Form")
        ).toBeInTheDocument();
    });

    it("creates a subscription successfully", async () => {
        renderWithProviders(<CreateOrderPage />);

        screen
            .getByRole("button", {
                name: "Create Subscription",
            })
            .click();

        await waitFor(() => {
            expect(
                orderServiceMock.createSubscription
            ).toHaveBeenCalledWith({
                customerId: 1,
                quantity: 10,
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Subscription created successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith("/orders");
    });

    it("creates a one-time order successfully", async () => {
        renderWithProviders(<CreateOrderPage />);

        screen
            .getByRole("button", {
                name: "Create Order",
            })
            .click();

        await waitFor(() => {
            expect(
                orderServiceMock.createOrder
            ).toHaveBeenCalledWith({
                customerId: 1,
                quantity: 5,
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Order created successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith("/orders");
    });
});