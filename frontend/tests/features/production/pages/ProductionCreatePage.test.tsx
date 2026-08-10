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

import ProductionCreatePage from "../../../../src/features/production/pages/ProductionCreatePage";

const {
    navigateMock,
    toastMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

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

const { productionServiceMock } = vi.hoisted(
    () => ({
        productionServiceMock: {
            getProductionAnimals: vi.fn(),
            getStorageFacilities: vi.fn(),
            createProduction: vi.fn(),
        },
    })
);

vi.mock(
    "../../../../src/services/production.service",
    () => ({
        productionService:
            productionServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/features/production/components/ProductionForm",
    () => ({
        default: ({
            onSubmit,
        }: {
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <button
                type="button"
                onClick={() =>
                    onSubmit({
                        animalId: 1,
                        productionDate: "2026-08-10",
                        productionShift: "Morning",
                        quantityProduced: 10,
                        fatPercentage: 4,
                        snfPercentage: 8.5,
                        milkTemperature: 4,
                        qualityStatus: "Pending",
                        facilityId: 1,
                    })
                }
            >
                Create Production
            </button>
        ),
    })
);

describe("ProductionCreatePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        productionServiceMock.getProductionAnimals.mockResolvedValue(
            [
                {
                    animalId: 1,
                    tagId: "A001",
                    name: "Cow One",
                },
            ]
        );

        productionServiceMock.getStorageFacilities.mockResolvedValue(
            [
                {
                    facilityId: 1,
                    facilityName: "Main Storage Facility",
                },
            ]
        );
    });

    it("renders the Add Production page", async () => {
        renderWithProviders(
            <ProductionCreatePage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Add Production",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Production",
            })
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                productionServiceMock
                    .getProductionAnimals
            ).toHaveBeenCalledTimes(1);

            expect(
                productionServiceMock
                    .getStorageFacilities
            ).toHaveBeenCalledTimes(1);
        });
    });

    it("creates a production record, shows success toast, and navigates", async () => {
        productionServiceMock.createProduction.mockResolvedValue(
            {
                productionId: 1,
            }
        );

        renderWithProviders(
            <ProductionCreatePage />
        );

        screen
            .getByRole("button", {
                name: "Create Production",
            })
            .click();

        await waitFor(() => {
            expect(
                productionServiceMock
                    .createProduction
            ).toHaveBeenCalledWith({
                animalId: 1,
                productionDate: "2026-08-10",
                productionShift: "Morning",
                quantityProduced: 10,
                fatPercentage: 4,
                snfPercentage: 8.5,
                milkTemperature: 4,
                qualityStatus: "Pending",
                facilityId: 1,
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Production record created."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/production"
        );
    });

    it("shows an error toast when loading form data fails", async () => {
        productionServiceMock.getProductionAnimals.mockRejectedValue(
            new Error("Failed to load animals")
        );

        renderWithProviders(
            <ProductionCreatePage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            productionServiceMock
                .getStorageFacilities
        ).not.toHaveBeenCalled();
    });

    it("does not navigate when production creation fails", async () => {
        productionServiceMock.createProduction.mockRejectedValue(
            new Error("Creation failed")
        );

        renderWithProviders(
            <ProductionCreatePage />
        );

        screen
            .getByRole("button", {
                name: "Create Production",
            })
            .click();

        await waitFor(() => {
            expect(
                productionServiceMock
                    .createProduction
            ).toHaveBeenCalledWith({
                animalId: 1,
                productionDate: "2026-08-10",
                productionShift: "Morning",
                quantityProduced: 10,
                fatPercentage: 4,
                snfPercentage: 8.5,
                milkTemperature: 4,
                qualityStatus: "Pending",
                facilityId: 1,
            });
        });

        expect(
            navigateMock
        ).not.toHaveBeenCalled();
    });
});