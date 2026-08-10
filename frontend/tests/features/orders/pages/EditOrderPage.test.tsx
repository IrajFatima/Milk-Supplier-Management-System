// frontend/tests/features/orders/pages/EditOrderPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EditOrderPage from "../../../../src/features/orders/pages/EditOrderPage";
import { orderService } from "../../../../src/services/order.service";
import { ORDER_TYPES } from "../../../../src/constants/order";

vi.mock("../../../../src/services/order.service", () => ({
    orderService: {
        getSubscription: vi.fn(),
        getOrder: vi.fn(),
        updateSubscription: vi.fn(),
        updateOrder: vi.fn(),
    },
}));

vi.mock("../../../../src/features/orders/components/OrderForm", () => ({
    default: ({ order }: { order: { orderId: number } }) => (
        <div>Order Form {order.orderId}</div>
    ),
}));

vi.mock("../../../../src/components/Spinner", () => ({
    default: () => <div>Loading...</div>,
}));

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockedOrderService = vi.mocked(orderService);

const subscriptionOrder = {
    orderId: 1,
    orderType: ORDER_TYPES.SUBSCRIPTION,
};

const oneTimeOrder = {
    orderId: 2,
    orderType: ORDER_TYPES.ONE_TIME,
};

function renderPage(orderType: string, id = "1") {
    return render(
        <MemoryRouter
            initialEntries={[
                {
                    pathname: `/orders/${id}/edit`,
                    state: { orderType },
                },
            ]}
        >
            <Routes>
                <Route
                    path="/orders/:id/edit"
                    element={<EditOrderPage />}
                />
            </Routes>
        </MemoryRouter>
    );
}

describe("EditOrderPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state initially", () => {
        mockedOrderService.getSubscription.mockReturnValue(
            new Promise(() => {})
        );

        renderPage(ORDER_TYPES.SUBSCRIPTION);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("loads a subscription for subscription order type", async () => {
        mockedOrderService.getSubscription.mockResolvedValue(
            subscriptionOrder as never
        );

        renderPage(ORDER_TYPES.SUBSCRIPTION);

        await waitFor(() => {
            expect(
                mockedOrderService.getSubscription
            ).toHaveBeenCalledWith(1);
        });

        expect(
            screen.getByText("Order Form 1")
        ).toBeInTheDocument();
    });

    it("loads a one-time order for one-time order type", async () => {
        mockedOrderService.getOrder.mockResolvedValue(
            oneTimeOrder as never
        );

        renderPage(ORDER_TYPES.ONE_TIME);

        await waitFor(() => {
            expect(
                mockedOrderService.getOrder
            ).toHaveBeenCalledWith(1);
        });

        expect(
            screen.getByText("Order Form 2")
        ).toBeInTheDocument();
    });

    it("shows not found when the order cannot be loaded", async () => {
        mockedOrderService.getSubscription.mockResolvedValue(
            null as never
        );

        renderPage(ORDER_TYPES.SUBSCRIPTION);

        await waitFor(() => {
            expect(
                screen.getByText("Order not found.")
            ).toBeInTheDocument();
        });
    });
});