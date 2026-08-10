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
    fireEvent,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import CreateAnimalPage from "../../../../src/features/animals/pages/CreateAnimalPage";

import { animalService } from "../../../../src/services/animal.service";

const { navigateMock, toastMock } = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
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
    };
});

vi.mock("../../../../src/services/animal.service", () => ({
    animalService: {
        createAnimal: vi.fn(),
        getSheds: vi.fn(),
        getParentAnimals: vi.fn(),
    },
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

describe("CreateAnimalPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(animalService.getSheds).mockResolvedValue([
            {
                shedId: 1,
                shedName: "Shed A",
            },
        ] as never);

        vi.mocked(
            animalService.getParentAnimals
        ).mockResolvedValue([]);
    });

    it("renders the Add Animal page", async () => {
        renderWithProviders(<CreateAnimalPage />);

        expect(
            screen.getByRole("heading", {
                name: "Add Animal",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Animal",
            })
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                animalService.getSheds
            ).toHaveBeenCalled();

            expect(
                animalService.getParentAnimals
            ).toHaveBeenCalled();
        });

        expect(
            await screen.findByRole("option", {
                name: "Shed A",
            })
        ).toBeInTheDocument();
    });

    it("creates an animal, shows success toast, and navigates to animals", async () => {
        vi.mocked(
            animalService.createAnimal
        ).mockResolvedValue({
            animalId: 1,
        } as never);

        renderWithProviders(<CreateAnimalPage />);

        // Wait until asynchronous shed options are loaded.
        await screen.findByRole("option", {
            name: "Shed A",
        });

        const tagInput =
            screen.getByPlaceholderText(
                "e.g. 586123456789012"
            );

        fireEvent.change(tagInput, {
            target: {
                value: "123456789012345",
            },
        });

        /*
         * The form's select elements have stable name attributes,
         * but their labels are not associated with them using
         * htmlFor/id. Therefore query them directly by name.
         */
        const speciesSelect =
            document.querySelector(
                'select[name="species"]'
            ) as HTMLSelectElement;

        const breedSelect =
            document.querySelector(
                'select[name="breed"]'
            ) as HTMLSelectElement;

        const genderSelect =
            document.querySelector(
                'select[name="gender"]'
            ) as HTMLSelectElement;

        const acquisitionSourceSelect =
            document.querySelector(
                'select[name="acquisitionSource"]'
            ) as HTMLSelectElement;

        const operationalStatusSelect =
            document.querySelector(
                'select[name="operationalStatus"]'
            ) as HTMLSelectElement;

        const shedSelect =
            document.querySelector(
                'select[name="shedId"]'
            ) as HTMLSelectElement;

        const dateInput =
            document.querySelector(
                'input[name="dateOfBirth"]'
            ) as HTMLInputElement;

        expect(speciesSelect).not.toBeNull();
        expect(breedSelect).not.toBeNull();
        expect(genderSelect).not.toBeNull();
        expect(acquisitionSourceSelect).not.toBeNull();
        expect(operationalStatusSelect).not.toBeNull();
        expect(shedSelect).not.toBeNull();
        expect(dateInput).not.toBeNull();

        fireEvent.change(speciesSelect, {
            target: {
                value: "Cow",
            },
        });

        fireEvent.change(breedSelect, {
            target: {
                value: "Holstein Friesian",
            },
        });

        fireEvent.change(genderSelect, {
            target: {
                value: "Female",
            },
        });

        fireEvent.change(dateInput, {
            target: {
                value: "2024-01-01",
            },
        });

        fireEvent.change(acquisitionSourceSelect, {
            target: {
                value: "Purchase",
            },
        });

        fireEvent.change(operationalStatusSelect, {
            target: {
                value: "Lactating",
            },
        });

        fireEvent.change(shedSelect, {
            target: {
                value: "1",
            },
        });

        // Confirm the form actually received shedId = 1.
        expect(shedSelect.value).toBe("1");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Animal",
            })
        );

        await waitFor(() => {
            expect(
                animalService.createAnimal
            ).toHaveBeenCalled();
        });

        expect(
            animalService.createAnimal
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                tagId: "123456789012345",
                species: "Cow",
                breed: "Holstein Friesian",
                gender: "Female",
                dateOfBirth: "2024-01-01",
                acquisitionSource: "Purchase",
                operationalStatus: "Lactating",
                shedId: 1,
            })
        );

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "Animal created successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith("/animals");
    });

    it("shows an error toast when animal creation fails", async () => {
        vi.mocked(
            animalService.createAnimal
        ).mockRejectedValue(
            new Error("Creation failed")
        );

        renderWithProviders(<CreateAnimalPage />);

        // Wait until asynchronous shed options are loaded.
        await screen.findByRole("option", {
            name: "Shed A",
        });

        const tagInput =
            screen.getByPlaceholderText(
                "e.g. 586123456789012"
            );

        fireEvent.change(tagInput, {
            target: {
                value: "123456789012345",
            },
        });

        const speciesSelect =
            document.querySelector(
                'select[name="species"]'
            ) as HTMLSelectElement;

        const breedSelect =
            document.querySelector(
                'select[name="breed"]'
            ) as HTMLSelectElement;

        const genderSelect =
            document.querySelector(
                'select[name="gender"]'
            ) as HTMLSelectElement;

        const acquisitionSourceSelect =
            document.querySelector(
                'select[name="acquisitionSource"]'
            ) as HTMLSelectElement;

        const operationalStatusSelect =
            document.querySelector(
                'select[name="operationalStatus"]'
            ) as HTMLSelectElement;

        const shedSelect =
            document.querySelector(
                'select[name="shedId"]'
            ) as HTMLSelectElement;

        const dateInput =
            document.querySelector(
                'input[name="dateOfBirth"]'
            ) as HTMLInputElement;

        expect(speciesSelect).not.toBeNull();
        expect(breedSelect).not.toBeNull();
        expect(genderSelect).not.toBeNull();
        expect(acquisitionSourceSelect).not.toBeNull();
        expect(operationalStatusSelect).not.toBeNull();
        expect(shedSelect).not.toBeNull();
        expect(dateInput).not.toBeNull();

        fireEvent.change(speciesSelect, {
            target: {
                value: "Cow",
            },
        });

        fireEvent.change(breedSelect, {
            target: {
                value: "Holstein Friesian",
            },
        });

        fireEvent.change(genderSelect, {
            target: {
                value: "Female",
            },
        });

        fireEvent.change(dateInput, {
            target: {
                value: "2024-01-01",
            },
        });

        fireEvent.change(acquisitionSourceSelect, {
            target: {
                value: "Purchase",
            },
        });

        fireEvent.change(operationalStatusSelect, {
            target: {
                value: "Lactating",
            },
        });

        fireEvent.change(shedSelect, {
            target: {
                value: "1",
            },
        });

        expect(shedSelect.value).toBe("1");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Animal",
            })
        );

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