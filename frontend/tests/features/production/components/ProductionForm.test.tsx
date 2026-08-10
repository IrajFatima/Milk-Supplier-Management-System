import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import ProductionForm from "../../../../src/features/production/components/ProductionForm";

import type {
    Production,
    ProductionAnimal,
    StorageFacility,
} from "../../../../src/types/production.types";

const { toastMock } = vi.hoisted(() => ({
    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

describe("ProductionForm", () => {
    const animals: ProductionAnimal[] = [
        {
            animalId: 1,
            tagId: "A001",
            name: "Bella",
        },
        {
            animalId: 2,
            tagId: "A002",
            name: "Daisy",
        },
    ];

    const facilities: StorageFacility[] = [
        {
            facilityId: 1,
            facilityName: "Main Storage",
        },
        {
            facilityId: 2,
            facilityName: "Backup Storage",
        },
    ];

    const production: Production = {
        productionId: 1,
        animalId: 1,
        status: "Active",
        productionDate: "2026-08-10T00:00:00.000Z",
        productionShift: "Morning",
        quantityProduced: 25.5,
        fatPercentage: 4.2,
        snfPercentage: 8.7,
        milkTemperature: 4.5,
        qualityStatus: "Pending",
        recordedBy: 1,
        facilityId: 1,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the create production form", () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        expect(screen.getByText("Animal")).toBeInTheDocument();
        expect(screen.getByText("Production Date")).toBeInTheDocument();
        expect(screen.getByText("Shift")).toBeInTheDocument();
        expect(
            screen.getByText("Quantity Produced (L)")
        ).toBeInTheDocument();
        expect(screen.getByText("Facility")).toBeInTheDocument();
        expect(screen.getByText("Fat %")).toBeInTheDocument();
        expect(screen.getByText("SNF %")).toBeInTheDocument();
        expect(
            screen.getByText("Milk Temperature (°C)")
        ).toBeInTheDocument();
        expect(screen.getByText("Quality Status")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Production",
            })
        ).toBeInTheDocument();
    });

    it("renders the supplied animals and facilities", () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        expect(
            screen.getByRole("option", {
                name: /A001 - Bella/,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: /A002 - Daisy/,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Main Storage",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Backup Storage",
            })
        ).toBeInTheDocument();
    });

    it("defaults quality status to Pending in create mode", () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const qualityStatusSelect = document.querySelector(
            'select[name="qualityStatus"]'
        ) as HTMLSelectElement;

        expect(qualityStatusSelect).toBeInTheDocument();
        expect(qualityStatusSelect.value).toBe("Pending");
    });

    it("shows required validation errors when required fields are empty", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Animal is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Shift is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Quantity is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Fat percentage is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("SNF percentage is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Milk temperature is required")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Facility is required")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates quantity minimum", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const quantityInput = document.querySelector(
            'input[name="quantityProduced"]'
        ) as HTMLInputElement;

        fireEvent.change(quantityInput, {
            target: {
                value: "0",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Quantity must be > 0")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates quantity maximum", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const quantityInput = document.querySelector(
            'input[name="quantityProduced"]'
        ) as HTMLInputElement;

        fireEvent.change(quantityInput, {
            target: {
                value: "40.1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Quantity must be <= 40")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates fat percentage range", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const fatInput = document.querySelector(
            'input[name="fatPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(fatInput, {
            target: {
                value: "2.9",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Fat must be >= 3")
            ).toBeInTheDocument();
        });

        fireEvent.change(fatInput, {
            target: {
                value: "9.1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Fat must be <= 9")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates SNF percentage range", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const snfInput = document.querySelector(
            'input[name="snfPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(snfInput, {
            target: {
                value: "7.9",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("SNF must be >= 8")
            ).toBeInTheDocument();
        });

        fireEvent.change(snfInput, {
            target: {
                value: "11.1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("SNF must be <= 11")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("validates milk temperature range", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const temperatureInput = document.querySelector(
            'input[name="milkTemperature"]'
        ) as HTMLInputElement;

        fireEvent.change(temperatureInput, {
            target: {
                value: "1.9",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Temperature must be >= 2")
            ).toBeInTheDocument();
        });

        fireEvent.change(temperatureInput, {
            target: {
                value: "6.1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText("Temperature must be <= 6")
            ).toBeInTheDocument();
        });

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits the entered production data", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const animalSelect = document.querySelector(
            'select[name="animalId"]'
        ) as HTMLSelectElement;

        fireEvent.change(animalSelect, {
            target: {
                value: "1",
            },
        });

        const dateInput = document.querySelector(
            'input[name="productionDate"]'
        ) as HTMLInputElement;

        fireEvent.change(dateInput, {
            target: {
                value: "2026-08-10",
            },
        });

        const shiftSelect = document.querySelector(
            'select[name="productionShift"]'
        ) as HTMLSelectElement;

        fireEvent.change(shiftSelect, {
            target: {
                value: "Morning",
            },
        });

        const quantityInput = document.querySelector(
            'input[name="quantityProduced"]'
        ) as HTMLInputElement;

        fireEvent.change(quantityInput, {
            target: {
                value: "25.5",
            },
        });

        const facilitySelect = document.querySelector(
            'select[name="facilityId"]'
        ) as HTMLSelectElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        const fatInput = document.querySelector(
            'input[name="fatPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(fatInput, {
            target: {
                value: "4.2",
            },
        });

        const snfInput = document.querySelector(
            'input[name="snfPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(snfInput, {
            target: {
                value: "8.7",
            },
        });

        const temperatureInput = document.querySelector(
            'input[name="milkTemperature"]'
        ) as HTMLInputElement;

        fireEvent.change(temperatureInput, {
            target: {
                value: "4.5",
            },
        });

        const qualityStatusSelect = document.querySelector(
            'select[name="qualityStatus"]'
        ) as HTMLSelectElement;

        fireEvent.change(qualityStatusSelect, {
            target: {
                value: "Passed",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                animalId: 1,
                productionDate: "2026-08-10",
                productionShift: "Morning",
                quantityProduced: 25.5,
                fatPercentage: 4.2,
                snfPercentage: 8.7,
                milkTemperature: 4.5,
                qualityStatus: "Passed",
                facilityId: 1,
            })
        );
    });

    it("shows an error toast when submission fails", async () => {
        const onSubmit = vi
            .fn()
            .mockRejectedValue(new Error("Submission failed"));

        render(
            <ProductionForm
                mode="create"
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        const animalSelect = document.querySelector(
            'select[name="animalId"]'
        ) as HTMLSelectElement;

        fireEvent.change(animalSelect, {
            target: {
                value: "1",
            },
        });

        const dateInput = document.querySelector(
            'input[name="productionDate"]'
        ) as HTMLInputElement;

        fireEvent.change(dateInput, {
            target: {
                value: "2026-08-10",
            },
        });

        const shiftSelect = document.querySelector(
            'select[name="productionShift"]'
        ) as HTMLSelectElement;

        fireEvent.change(shiftSelect, {
            target: {
                value: "Morning",
            },
        });

        const quantityInput = document.querySelector(
            'input[name="quantityProduced"]'
        ) as HTMLInputElement;

        fireEvent.change(quantityInput, {
            target: {
                value: "25",
            },
        });

        const facilitySelect = document.querySelector(
            'select[name="facilityId"]'
        ) as HTMLSelectElement;

        fireEvent.change(facilitySelect, {
            target: {
                value: "1",
            },
        });

        const fatInput = document.querySelector(
            'input[name="fatPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(fatInput, {
            target: {
                value: "4",
            },
        });

        const snfInput = document.querySelector(
            'input[name="snfPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(snfInput, {
            target: {
                value: "8.5",
            },
        });

        const temperatureInput = document.querySelector(
            'input[name="milkTemperature"]'
        ) as HTMLInputElement;

        fireEvent.change(temperatureInput, {
            target: {
                value: "4",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Production",
            })
        );

        await waitFor(() => {
            expect(toastMock.error).toHaveBeenCalledWith(
                "Unable to save production record."
            );
        });
    });

    it("renders the edit production form with existing data", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="edit"
                production={production}
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                document.querySelector(
                    'select[name="animalId"]'
                )
            ).toHaveValue("1");
        });

        expect(
            document.querySelector(
                'input[name="productionDate"]'
            )
        ).toHaveValue("2026-08-10");

        expect(
            document.querySelector(
                'select[name="productionShift"]'
            )
        ).toHaveValue("Morning");

        expect(
            document.querySelector(
                'input[name="quantityProduced"]'
            )
        ).toHaveValue(25.5);

        expect(
            document.querySelector(
                'input[name="fatPercentage"]'
            )
        ).toHaveValue(4.2);

        expect(
            document.querySelector(
                'input[name="snfPercentage"]'
            )
        ).toHaveValue(8.7);

        expect(
            document.querySelector(
                'input[name="milkTemperature"]'
            )
        ).toHaveValue(4.5);

        expect(
            document.querySelector(
                'select[name="qualityStatus"]'
            )
        ).toHaveValue("Pending");

        expect(
            document.querySelector(
                'select[name="facilityId"]'
            )
        ).toHaveValue("1");

        expect(
            screen.getByRole("button", {
                name: "Update Production",
            })
        ).toBeInTheDocument();
    });

    it("disables animal and facility fields in edit mode", async () => {
        const onSubmit = vi.fn();

        render(
            <ProductionForm
                mode="edit"
                production={production}
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                document.querySelector(
                    'select[name="animalId"]'
                )
            ).toBeDisabled();

            expect(
                document.querySelector(
                    'select[name="facilityId"]'
                )
            ).toBeDisabled();
        });
    });

    it("disables quality status when existing quality status is Passed", async () => {
        const onSubmit = vi.fn();

        const passedProduction: Production = {
            ...production,
            qualityStatus: "Passed",
        };

        render(
            <ProductionForm
                mode="edit"
                production={passedProduction}
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            const qualityStatusSelect = document.querySelector(
                'select[name="qualityStatus"]'
            ) as HTMLSelectElement;

            expect(qualityStatusSelect).toBeDisabled();
            expect(qualityStatusSelect).toHaveValue("Passed");
        });
    });

    it("submits the edit production data without animal or facility", async () => {
        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        render(
            <ProductionForm
                mode="edit"
                production={production}
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                document.querySelector(
                    'input[name="productionDate"]'
                )
            ).toHaveValue("2026-08-10");
        });

        const dateInput = document.querySelector(
            'input[name="productionDate"]'
        ) as HTMLInputElement;

        fireEvent.change(dateInput, {
            target: {
                value: "2026-08-11",
            },
        });

        const shiftSelect = document.querySelector(
            'select[name="productionShift"]'
        ) as HTMLSelectElement;

        fireEvent.change(shiftSelect, {
            target: {
                value: "Evening",
            },
        });

        const quantityInput = document.querySelector(
            'input[name="quantityProduced"]'
        ) as HTMLInputElement;

        fireEvent.change(quantityInput, {
            target: {
                value: "30",
            },
        });

        const fatInput = document.querySelector(
            'input[name="fatPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(fatInput, {
            target: {
                value: "4.5",
            },
        });

        const snfInput = document.querySelector(
            'input[name="snfPercentage"]'
        ) as HTMLInputElement;

        fireEvent.change(snfInput, {
            target: {
                value: "9",
            },
        });

        const temperatureInput = document.querySelector(
            'input[name="milkTemperature"]'
        ) as HTMLInputElement;

        fireEvent.change(temperatureInput, {
            target: {
                value: "5",
            },
        });

        const qualityStatusSelect = document.querySelector(
            'select[name="qualityStatus"]'
        ) as HTMLSelectElement;

        fireEvent.change(qualityStatusSelect, {
            target: {
                value: "Failed",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update Production",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                productionDate: "2026-08-11",
                productionShift: "Evening",
                quantityProduced: 30,
                fatPercentage: 4.5,
                snfPercentage: 9,
                milkTemperature: 5,
                qualityStatus: "Failed",
            })
        );

        expect(onSubmit).not.toHaveBeenCalledWith(
            expect.objectContaining({
                animalId: expect.anything(),
            })
        );

        expect(onSubmit).not.toHaveBeenCalledWith(
            expect.objectContaining({
                facilityId: expect.anything(),
            })
        );
    });

    it("does not allow editing a voided production", () => {
        const onSubmit = vi.fn();

        const voidedProduction: Production = {
            ...production,
            status: "Voided",
        };

        render(
            <ProductionForm
                mode="edit"
                production={voidedProduction}
                animals={animals}
                facilities={facilities}
                onSubmit={onSubmit}
            />
        );

        expect(
            screen.getByText("Editing Not Allowed")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "This production record has been voided and cannot be edited."
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Update Production",
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Production Date")
        ).not.toBeInTheDocument();
    });
});