import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import AnimalListPage from "../../../../src/features/animals/pages/AnimalListPage";
import { renderWithProviders } from "../../../helpers/render";

describe("AnimalListPage", () => {
  it("renders the animal list page", () => {
    renderWithProviders(<AnimalListPage />, {
      route: "/animals",
    });

    expect(
      screen.getByText("Animal Management")
    ).toBeInTheDocument();
  });
});