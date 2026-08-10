import { describe, it, expect, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import CustomerForm from "../../../../src/features/customers/components/CustomerForm";

describe("CustomerForm", () => {
    it("renders the create customer form", () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <CustomerForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        expect(
            container.querySelector(
                'select[name="customer_type"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'select[name="payment_model"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="customer_name"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="contact_number"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="email_address"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'textarea[name="delivery_address_line_1"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="city_town"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="state_province"]'
            )
        ).toBeInTheDocument();

        expect(
            container.querySelector(
                'input[name="postal_code"]'
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Customer",
            })
        ).toBeInTheDocument();
    });

    it("shows validation errors for required fields", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <CustomerForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Customer",
            })
        );

        expect(
            await screen.findByText(
                "Customer type is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Payment model is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Customer name is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Contact number is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Email address is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Address Line 1 is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("City is required.")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "State/Province is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Postal code is required."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits customer data in create mode", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <CustomerForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        const customerTypeSelect =
            container.querySelector(
                'select[name="customer_type"]'
            ) as HTMLSelectElement;

        const paymentModelSelect =
            container.querySelector(
                'select[name="payment_model"]'
            ) as HTMLSelectElement;

        const customerNameInput =
            container.querySelector(
                'input[name="customer_name"]'
            ) as HTMLInputElement;

        const contactNumberInput =
            container.querySelector(
                'input[name="contact_number"]'
            ) as HTMLInputElement;

        const emailAddressInput =
            container.querySelector(
                'input[name="email_address"]'
            ) as HTMLInputElement;

        const addressLine1Input =
            container.querySelector(
                'textarea[name="delivery_address_line_1"]'
            ) as HTMLTextAreaElement;

        const cityInput =
            container.querySelector(
                'input[name="city_town"]'
            ) as HTMLInputElement;

        const stateInput =
            container.querySelector(
                'input[name="state_province"]'
            ) as HTMLInputElement;

        const postalCodeInput =
            container.querySelector(
                'input[name="postal_code"]'
            ) as HTMLInputElement;

        expect(customerTypeSelect).toBeInTheDocument();
        expect(paymentModelSelect).toBeInTheDocument();
        expect(customerNameInput).toBeInTheDocument();
        expect(contactNumberInput).toBeInTheDocument();
        expect(emailAddressInput).toBeInTheDocument();
        expect(addressLine1Input).toBeInTheDocument();
        expect(cityInput).toBeInTheDocument();
        expect(stateInput).toBeInTheDocument();
        expect(postalCodeInput).toBeInTheDocument();

        fireEvent.change(customerTypeSelect, {
            target: {
                value: "B2C",
            },
        });

        fireEvent.change(paymentModelSelect, {
            target: {
                value: "Prepaid",
            },
        });

        fireEvent.change(customerNameInput, {
            target: {
                value: "John Doe",
            },
        });

        fireEvent.change(contactNumberInput, {
            target: {
                value: "03001234567",
            },
        });

        fireEvent.change(emailAddressInput, {
            target: {
                value: "john@example.com",
            },
        });

        fireEvent.change(addressLine1Input, {
            target: {
                value: "123 Main Street",
            },
        });

        fireEvent.change(cityInput, {
            target: {
                value: "Lahore",
            },
        });

        fireEvent.change(stateInput, {
            target: {
                value: "Punjab",
            },
        });

        fireEvent.change(postalCodeInput, {
            target: {
                value: "54000",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Customer",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                customer_type: "B2C",
                customer_name: "John Doe",
                contact_number: "03001234567",
                email_address: "john@example.com",
                delivery_address_line_1:
                    "123 Main Street",
                city_town: "Lahore",
                state_province: "Punjab",
                postal_code: "54000",
                payment_model: "Prepaid",
            })
        );
    });

    it("loads existing customer data in edit mode", async () => {
        const customer = {
            customerId: 1,
            customer_type: "B2C",
            customer_name: "John Doe",
            contact_number: "03001234567",
            email_address: "john@example.com",
            delivery_address_line_1:
                "123 Main Street",
            delivery_address_line_2: null,
            city_town: "Lahore",
            state_province: "Punjab",
            postal_code: "54000",
            delivery_area_route: "Route A",
            landmark: "Near Market",
            payment_model: "Prepaid",
        } as never;

        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <CustomerForm
                mode="edit"
                customer={customer}
                onSubmit={onSubmit}
            />
        );

        expect(
            await screen.findByDisplayValue("John Doe")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "03001234567"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "john@example.com"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "123 Main Street"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("Lahore")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Update Customer",
            })
        ).toBeInTheDocument();

        const customerTypeSelect =
            container.querySelector(
                'select[name="customer_type"]'
            ) as HTMLSelectElement;

        const emailAddressInput =
            container.querySelector(
                'input[name="email_address"]'
            ) as HTMLInputElement;

        expect(customerTypeSelect).toBeDisabled();
        expect(emailAddressInput).toBeDisabled();
    });
});