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

import CreateCustomerPage from "../../../../src/features/customers/pages/CreateCustomerPage";


const { navigateMock, toastMock } = vi.hoisted(
    () => ({
        navigateMock: vi.fn(),

        toastMock: {
            success: vi.fn(),
            error: vi.fn(),
            info: vi.fn(),
            warning: vi.fn(),
        },
    })
);

vi.mock(
    "react-router-dom",
    async () => {
        const actual =
            await vi.importActual<
                typeof import("react-router-dom")
            >("react-router-dom");

        return {
            ...actual,
            useNavigate: () => navigateMock,
        };
    }
);

const { customerServiceMock } = vi.hoisted(
    () => ({
        customerServiceMock: {
            createCustomer: vi.fn(),
        },
    })
);

vi.mock(
    "../../../../src/services/customer.service",
    () => ({
        customerService:
            customerServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/features/customers/components/CustomerForm",
    () => ({
        default: ({
            onSubmit,
        }: {
            onSubmit: (
                data: unknown
            ) => Promise<unknown>;
        }) => (
            <button
                type="button"
                onClick={() =>
                    onSubmit({
                        customer_type:
                            "Retail",
                        customer_name:
                            "John Doe",
                    })
                }
            >
                Create Customer
            </button>
        ),
    })
);

describe("CreateCustomerPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the Add Customer page", () => {
        renderWithProviders(
            <CreateCustomerPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Add Customer",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Customer",
            })
        ).toBeInTheDocument();
    });

    it("creates a customer, shows success toast, and navigates", async () => {
        customerServiceMock.createCustomer.mockResolvedValue(
            {
                customer_id: 1,
            }
        );

        renderWithProviders(
            <CreateCustomerPage />
        );

        screen
            .getByRole("button", {
                name: "Create Customer",
            })
            .click();

        await waitFor(() => {
            expect(
                customerServiceMock
                    .createCustomer
            ).toHaveBeenCalledWith({
                customer_type: "Retail",
                customer_name:
                    "John Doe",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Customer created successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/customers"
        );
    });

    it("shows an error toast when creation fails", async () => {
        customerServiceMock.createCustomer.mockRejectedValue(
            new Error("Creation failed")
        );

        renderWithProviders(
            <CreateCustomerPage />
        );

        screen
            .getByRole("button", {
                name: "Create Customer",
            })
            .click();

        await waitFor(() => {
            expect(
                customerServiceMock.createCustomer
            ).toHaveBeenCalledWith({
                customer_type: "Retail",
                customer_name: "John Doe",
            });
        });

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            navigateMock
        ).not.toHaveBeenCalled();
    });
});