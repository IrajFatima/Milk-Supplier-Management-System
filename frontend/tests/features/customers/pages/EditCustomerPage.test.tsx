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

import EditCustomerPage from "../../../../src/features/customers/pages/EditCustomerPage";

import { customerService } from "../../../../src/services/customer.service";

const {
    navigateMock,
    toastMock,
    customerServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    customerServiceMock: {
        getCustomer: vi.fn(),
        updateCustomer: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<typeof import("react-router-dom")>(
            "react-router-dom"
        );

    return {
        ...actual,
        useNavigate: () => navigateMock,
        useParams: () => ({
            id: "3",
        }),
    };
});

vi.mock(
    "../../../../src/services/customer.service",
    () => ({
        customerService: customerServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/components/Spinner",
    () => ({
        default: () => <div role="status">Loading...</div>,
    })
);

vi.mock(
    "../../../../src/features/customers/components/CustomerForm",
    () => ({
        default: ({
            customer,
            onSubmit,
        }: {
            customer?: {
                customer_name: string;
            };
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <div>
                {customer && (
                    <div>{customer.customer_name}</div>
                )}

                <button
                    type="button"
                    onClick={() =>
                        onSubmit({
                            customer_name: "Jane Doe",
                        })
                    }
                >
                    Update Customer
                </button>
            </div>
        ),
    })
);

describe("EditCustomerPage", () => {
    const customer = {
        customerId: 3,
        customer_type: "B2C",
        customer_name: "John Doe",
        contact_number: "03001234567",
        email_address: "john@example.com",
        delivery_address_line_1: "123 Main Street",
        delivery_address_line_2: null,
        city_town: "Lahore",
        state_province: "Punjab",
        postal_code: "54000",
        delivery_area_route: "Route A",
        landmark: "Near Market",
        payment_model: "Prepaid",
        account_status: "Active",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state while customer is being loaded", () => {
        vi.mocked(
            customerService.getCustomer
        ).mockReturnValue(
            new Promise(() => {})
        );

        renderWithProviders(
            <EditCustomerPage />
        );

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });

    it("renders the customer after loading", async () => {
        vi.mocked(
            customerService.getCustomer
        ).mockResolvedValue(
            customer as never
        );

        renderWithProviders(
            <EditCustomerPage />
        );

        expect(
            await screen.findByRole("heading", {
                name: "Edit Customer",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText("John Doe")
        ).toBeInTheDocument();

        expect(
            customerService.getCustomer
        ).toHaveBeenCalledWith(3);
    });

    it("shows Customer not found when customer does not exist", async () => {
        vi.mocked(
            customerService.getCustomer
        ).mockResolvedValue(null as never);

        renderWithProviders(
            <EditCustomerPage />
        );

        expect(
            await screen.findByText(
                "Customer not found."
            )
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading fails", async () => {
        vi.mocked(
            customerService.getCustomer
        ).mockRejectedValue(
            new Error("Load failed")
        );

        renderWithProviders(
            <EditCustomerPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByText(
                "Customer not found."
            )
        ).toBeInTheDocument();
    });

    it("updates the customer, shows success toast, and navigates", async () => {
        vi.mocked(
            customerService.getCustomer
        ).mockResolvedValue(
            customer as never
        );

        vi.mocked(
            customerService.updateCustomer
        ).mockResolvedValue({
            customer_id: 3,
        } as never);

        renderWithProviders(
            <EditCustomerPage />
        );

        await screen.findByRole("heading", {
            name: "Edit Customer",
        });

        screen
            .getByRole("button", {
                name: "Update Customer",
            })
            .click();

        await waitFor(() => {
            expect(
                customerService.updateCustomer
            ).toHaveBeenCalledWith(3, {
                customer_name: "Jane Doe",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Customer updated successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/customers/3"
        );
    });
});