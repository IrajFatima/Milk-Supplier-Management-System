import { ANIMAL_SPECIES } from "./animalSpecies.js";

export const ANIMAL_BREEDS = {
  [ANIMAL_SPECIES.COW]: [
    "Holstein Friesian",
    "Jersey",
    "Sahiwal",
    "Friesian",
    "Crossbred",
  ],

  [ANIMAL_SPECIES.BUFFALO]: [
    "Nili Ravi",
    "Kundi",
    "Murrah",
    "Crossbred",
  ],
} as const;