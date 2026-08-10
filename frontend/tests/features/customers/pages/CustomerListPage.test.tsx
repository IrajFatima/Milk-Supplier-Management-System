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

import CustomerListPage from "../../../../src/features/customers/pages/CustomerListPage";

import { customerService } from "../../../../src/services/customer.service";

const {
    navigateMock,
    authMock,
    toastMock,
    customerServiceMock,
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

    customerServiceMock: {
        getCustomers: vi.fn(),
    },
}));

vi.mock(
    "../../../../src/services/customer.service",
    () => ({
        customerService: customerServiceMock,
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
    "../../../../src/features/customers/components/CustomerSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="Customer Search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/customers/components/CustomerFilters",
    () => ({
        default: () => <div>Customer Filters</div>,
    })
);

vi.mock(
    "../../../../src/features/customers/components/CustomerTable",
    () => ({
        default: ({
            customers,
            loading,
            canEdit,
            canChangeStatus,
        }: {
            customers: Array<{
                customerId: number;
                customerName: string;
            }>;
            loading: boolean;
            canEdit: boolean;
            canChangeStatus: boolean;
        }) => (
            <div>
                {loading && (
                    <div>Loading customers...</div>
                )}

                {!loading &&
                    customers.map((customer) => (
                        <div key={customer.customerId}>
                            {customer.customerName}
                        </div>
                    ))}

                <span>
                    {canEdit
                        ? "Can Edit"
                        : "Cannot Edit"}
                </span>

                <span>
                    {canChangeStatus
                        ? "Can Change Status"
                        : "Cannot Change Status"}
                </span>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/customers/components/ChangeCustomerStatusModal",
    () => ({
        default: () => null,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<typeof import("react-router-dom")>(
            "react-router-dom"
        );

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("CustomerListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            customerService.getCustomers
        ).mockResolvedValue({
            data: [
                {
                    customerId: 1,
                    customerName: "John Doe",
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        } as never);
    });

    it("renders the customer management page", async () => {
        renderWithProviders(<CustomerListPage />);

        expect(
            screen.getByRole("heading", {
                name: "Customer Management",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /add customer/i,
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText("John Doe")
        ).toBeInTheDocument();
    });

    it("loads customers with the default filters", async () => {
        renderWithProviders(<CustomerListPage />);

        await waitFor(() => {
            expect(
                customerService.getCustomers
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("shows an error toast when loading customers fails", async () => {
        vi.mocked(
            customerService.getCustomers
        ).mockRejectedValue(
            new Error("Failed to load customers")
        );

        renderWithProviders(<CustomerListPage />);

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("shows edit and status permissions for an owner", async () => {
        renderWithProviders(<CustomerListPage />);

        expect(
            await screen.findByText("Can Edit")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Can Change Status")
        ).toBeInTheDocument();
    });

    it("navigates to create customer page", async () => {
        renderWithProviders(<CustomerListPage />);

        await screen.findByText("John Doe");

        screen
            .getByRole("button", {
                name: /add customer/i,
            })
            .click();

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/customers/create"
        );
    });

    it("updates the page when pagination changes", async () => {
        renderWithProviders(<CustomerListPage />);

        await screen.findByText("John Doe");

        screen
            .getByRole("button", {
                name: "Next Page",
            })
            .click();

        await waitFor(() => {
            expect(
                customerService.getCustomers
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });
    });
});