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
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import EditAnimalPage from "../../../../src/features/animals/pages/EditAnimalPage";
import { animalService } from "../../../../src/services/animal.service";

const { navigateMock, toastMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  toastMock: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({
      id: "5",
    }),
  };
});

vi.mock("../../../../src/services/animal.service", () => ({
  animalService: {
    getAnimal: vi.fn(),
    updateAnimal: vi.fn(),
    getSheds: vi.fn(),
    getParentAnimals: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: toastMock,
}));

describe("EditAnimalPage", () => {
  const animal = {
    animalId: 5,
    tagId: "123456789012345",
    name: "Bessie",
    species: "Cow",
    breed: "Holstein Friesian",
    gender: "Female",
    dateOfBirth: "2022-01-01T00:00:00.000Z",
    acquisitionSource: "Purchase",
    purchaseInformation: "Purchased locally",
    parentAnimal: null,
    currentWeight: 450,
    operationalStatus: "Lactating",
    shedId: 1,
    shedName: "Shed A",
    registrationDate: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(animalService.getSheds).mockResolvedValue([]);
    vi.mocked(animalService.getParentAnimals).mockResolvedValue([]);
  });

  it("shows loading state while the animal is being loaded", () => {
    vi.mocked(animalService.getAnimal).mockReturnValue(
      new Promise(() => {})
    );

    renderWithProviders(<EditAnimalPage />);

    expect(
      screen.getByRole("status")
    ).toBeInTheDocument();
  });

  it("renders the animal after loading", async () => {
    vi.mocked(animalService.getAnimal).mockResolvedValue(
      animal as never
    );

    renderWithProviders(<EditAnimalPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Edit Animal",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Bessie")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Update Animal",
      })
    ).toBeInTheDocument();

    expect(
      animalService.getAnimal
    ).toHaveBeenCalledWith(5);
  });

  it("shows Animal not found when no animal is returned", async () => {
    vi.mocked(animalService.getAnimal).mockResolvedValue(
      null as never
    );

    renderWithProviders(<EditAnimalPage />);

    expect(
      await screen.findByText("Animal not found.")
    ).toBeInTheDocument();
  });

  it("shows an error toast when loading fails", async () => {
    vi.mocked(animalService.getAnimal).mockRejectedValue(
      new Error("Failed to load")
    );

    renderWithProviders(<EditAnimalPage />);

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalled();
    });

    expect(
      screen.getByText("Animal not found.")
    ).toBeInTheDocument();
  });
});