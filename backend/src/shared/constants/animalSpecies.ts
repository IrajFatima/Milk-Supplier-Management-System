export const ANIMAL_SPECIES = {
  COW: "Cow",
  BUFFALO: "Buffalo",
} as const;

export const ANIMAL_SPECIES_OPTIONS = Object.values(ANIMAL_SPECIES);

export type AnimalSpecies =
  (typeof ANIMAL_SPECIES)[keyof typeof ANIMAL_SPECIES];