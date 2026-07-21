export const ANIMAL_STATUS = {
  CALF: "Calf",
  HEIFER: "Heifer",
  BULL: "Bull",
  PREGNANT: "Pregnant",
  LACTATING: "Lactating",
  DRY: "Dry",
  SOLD: "Sold",
  DECEASED: "Deceased",
} as const;

export const ANIMAL_STATUS_OPTIONS = Object.values(ANIMAL_STATUS);

export type AnimalStatus =
  (typeof ANIMAL_STATUS)[keyof typeof ANIMAL_STATUS];