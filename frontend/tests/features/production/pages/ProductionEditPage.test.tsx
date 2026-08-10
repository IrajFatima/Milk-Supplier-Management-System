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

import ProductionEditPage from "../../../../src/features/production/pages/ProductionEditPage";

const {
    navigateMock,
    toastMock,
    productionServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    productionServiceMock: {
        getProductionById: vi.fn(),
        getProductionAnimals: vi.fn(),
        getStorageFacilities: vi.fn(),
        updateProduction: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
        useParams: () => ({
            id: "3",
        }),
    };
});

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
    "../../../../src/components/Spinner",
    () => ({
        default: () => (
            <div role="status">
                Loading...
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/production/components/ProductionForm",
    () => ({
        default: ({
            production,
            onSubmit,
        }: {
            production?: {
                productionId: number;
            };
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <div>
                {production && (
                    <div>
                        Production {production.productionId}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() =>
                        onSubmit({
                            productionDate:
                                "2026-08-10",
                            productionShift:
                                "Evening",
                            quantityProduced: 12,
                            fatPercentage: 4.5,
                            snfPercentage: 8.7,
                            milkTemperature: 4,
                            qualityStatus: "Passed",
                        })
                    }
                >
                    Update Production
                </button>
            </div>
        ),
    })
);

describe("ProductionEditPage", () => {
    const production = {
        productionId: 3,
        animalId: 1,
        status: "Active",
        productionDate:
            "2026-08-10T00:00:00.000Z",
        productionShift: "Morning",
        quantityProduced: 10,
        fatPercentage: 4,
        snfPercentage: 8.5,
        milkTemperature: 4,
        qualityStatus: "Pending",
        recordedBy: 1,
        facilityId: 1,
        facilityName: "Main Storage Facility",
        animalTagId: "A001",
        animalName: "Cow One",
        recordedByName: "Owner",
    };

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
                    facilityName:
                        "Main Storage Facility",
                },
            ]
        );
    });

    it("shows loading state while production is being loaded", () => {
        productionServiceMock.getProductionById.mockReturnValue(
            new Promise(() => {})
        );

        renderWithProviders(
            <ProductionEditPage />
        );

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });

    it("renders the production after loading", async () => {
        productionServiceMock.getProductionById.mockResolvedValue(
            production
        );

        renderWithProviders(
            <ProductionEditPage />
        );

        expect(
            await screen.findByText(
                "Production 3"
            )
        ).toBeInTheDocument();

        expect(
            productionServiceMock
                .getProductionById
        ).toHaveBeenCalledWith(3);

        expect(
            productionServiceMock
                .getProductionAnimals
        ).toHaveBeenCalledTimes(1);

        expect(
            productionServiceMock
                .getStorageFacilities
        ).toHaveBeenCalledTimes(1);
    });

    it("shows No Production Found when production does not exist", async () => {
        productionServiceMock.getProductionById.mockResolvedValue(
            null
        );

        renderWithProviders(
            <ProductionEditPage />
        );

        expect(
            await screen.findByText(
                "No Production Found"
            )
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading production fails", async () => {
        productionServiceMock.getProductionById.mockRejectedValue(
            new Error("Load failed")
        );

        renderWithProviders(
            <ProductionEditPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByText(
                "No Production Found"
            )
        ).toBeInTheDocument();
    });

    it("updates the production, shows success toast, and navigates", async () => {
        productionServiceMock.getProductionById.mockResolvedValue(
            production
        );

        productionServiceMock.updateProduction.mockResolvedValue(
            undefined
        );

        renderWithProviders(
            <ProductionEditPage />
        );

        await screen.findByText(
            "Production 3"
        );

        screen
            .getByRole("button", {
                name: "Update Production",
            })
            .click();

        await waitFor(() => {
            expect(
                productionServiceMock
                    .updateProduction
            ).toHaveBeenCalledWith(3, {
                productionDate:
                    "2026-08-10",
                productionShift:
                    "Evening",
                quantityProduced: 12,
                fatPercentage: 4.5,
                snfPercentage: 8.7,
                milkTemperature: 4,
                qualityStatus: "Passed",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Production record updated."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/production/3"
        );
    });
});