import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import AnimalForm from "../../../../src/features/animals/components/AnimalForm";

import {
    ANIMAL_GENDER,
    ANIMAL_SPECIES,
    ACQUISITION_SOURCE,
} from "../../../../src/constants/animal";

const { animalServiceMock, toastMock } = vi.hoisted(() => ({
    animalServiceMock: {
        getSheds: vi.fn(),
        getParentAnimals: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

vi.mock("../../../../src/services/animal.service", () => ({
    animalService: animalServiceMock,
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

describe("AnimalForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        animalServiceMock.getSheds.mockResolvedValue([
            {
                shedId: 1,
                shedName: "Shed A",
                shedType: null,
                locationArea: null,
                capacity: 20,
                currentOccupancy: 5,
                availableCapacity: 15,
                status: "Active",
                remarks: null,
            },
        ]);

        animalServiceMock.getParentAnimals.mockResolvedValue([
            {
                animalId: 1,
                tagId: "PARENT001",
                name: "Mother",
                gender: "Female",
            },
        ]);
    });

    it("renders the create animal form", async () => {
        const onSubmit = vi.fn();

        render(
            <AnimalForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        expect(screen.getByText("Tag ID")).toBeInTheDocument();
        expect(screen.getByText("Species")).toBeInTheDocument();
        expect(screen.getByText("Gender")).toBeInTheDocument();
        expect(screen.getByText("Date of Birth")).toBeInTheDocument();
        expect(
            screen.getByText("Acquisition Source")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Operational Status")
        ).toBeInTheDocument();
        expect(screen.getByText("Shed")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Animal",
            })
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                animalServiceMock.getSheds
            ).toHaveBeenCalledTimes(1);

            expect(
                animalServiceMock.getParentAnimals
            ).toHaveBeenCalledTimes(1);
        });
    });

    it("shows breed options when a species is selected", async () => {
        const onSubmit = vi.fn();

        render(
            <AnimalForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        const speciesSelect = document.querySelector(
            'select[name="species"]'
        ) as HTMLSelectElement;

        expect(speciesSelect).toBeInTheDocument();

        fireEvent.change(speciesSelect, {
            target: {
                value: ANIMAL_SPECIES.COW,
            },
        });

        await waitFor(() => {
            expect(
                screen.getByText("Holstein Friesian")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Jersey")
            ).toBeInTheDocument();

            expect(
                screen.getByText("Sahiwal")
            ).toBeInTheDocument();
        });
    });

    it("shows purchase information when Purchase is selected", async () => {
        const onSubmit = vi.fn();

        render(
            <AnimalForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        const acquisitionSourceSelect = document.querySelector(
            'select[name="acquisitionSource"]'
        ) as HTMLSelectElement;

        expect(acquisitionSourceSelect).toBeInTheDocument();

        fireEvent.change(acquisitionSourceSelect, {
            target: {
                value: ACQUISITION_SOURCE.PURCHASE,
            },
        });

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText(
                    "Enter purchase details..."
                )
            ).toBeInTheDocument();
        });
    });

    it("shows parent animal when Born on Farm is selected", async () => {
        const onSubmit = vi.fn();

        render(
            <AnimalForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        const acquisitionSourceSelect = document.querySelector(
            'select[name="acquisitionSource"]'
        ) as HTMLSelectElement;

        expect(acquisitionSourceSelect).toBeInTheDocument();

        fireEvent.change(acquisitionSourceSelect, {
            target: {
                value: ACQUISITION_SOURCE.BORN_ON_FARM,
            },
        });

        await waitFor(() => {
            expect(
                screen.getByText("Parent Animal")
            ).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(
                screen.getByRole("option", {
                    name: /PARENT001 Mother/,
                })
            ).toBeInTheDocument();
        });
    });

    it("submits the entered animal data", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <AnimalForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        const tagInput = screen.getByPlaceholderText(
            "e.g. 586123456789012"
        );

        fireEvent.change(tagInput, {
            target: {
                value: "123456789012345",
            },
        });

        const speciesSelect = document.querySelector(
            'select[name="species"]'
        ) as HTMLSelectElement;

        fireEvent.change(speciesSelect, {
            target: {
                value: ANIMAL_SPECIES.COW,
            },
        });

        await waitFor(() => {
            expect(
                document.querySelector(
                    'select[name="breed"]'
                )
            ).toBeInTheDocument();
        });

        const breedSelect = document.querySelector(
            'select[name="breed"]'
        ) as HTMLSelectElement;

        fireEvent.change(breedSelect, {
            target: {
                value: "Holstein Friesian",
            },
        });

        const genderSelect = document.querySelector(
            'select[name="gender"]'
        ) as HTMLSelectElement;

        fireEvent.change(genderSelect, {
            target: {
                value: ANIMAL_GENDER.FEMALE,
            },
        });

        const dateInput = document.querySelector(
            'input[name="dateOfBirth"]'
        ) as HTMLInputElement;

        expect(dateInput).toBeInTheDocument();

        fireEvent.change(dateInput, {
            target: {
                value: "2024-01-01",
            },
        });

        const acquisitionSourceSelect = document.querySelector(
            'select[name="acquisitionSource"]'
        ) as HTMLSelectElement;

        fireEvent.change(acquisitionSourceSelect, {
            target: {
                value: ACQUISITION_SOURCE.PURCHASE,
            },
        });

        const operationalStatusSelect = document.querySelector(
            'select[name="operationalStatus"]'
        ) as HTMLSelectElement;

        fireEvent.change(operationalStatusSelect, {
            target: {
                value: "Lactating",
            },
        });

        const shedSelect = document.querySelector(
            'select[name="shedId"]'
        ) as HTMLSelectElement;

        fireEvent.change(shedSelect, {
            target: {
                value: "1",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Animal",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                tagId: "123456789012345",
                species: ANIMAL_SPECIES.COW,
                breed: "Holstein Friesian",
                gender: ANIMAL_GENDER.FEMALE,
                dateOfBirth: "2024-01-01",
                acquisitionSource:
                    ACQUISITION_SOURCE.PURCHASE,
                operationalStatus: "Lactating",
                shedId: 1,
            })
        );
    });
});