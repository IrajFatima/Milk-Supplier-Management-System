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

export const ACQUISITION_SOURCE = {
  PURCHASE: "Purchase",
  BORN_ON_FARM: "Born on Farm",
} as const;

export const ANIMAL_GENDER = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export const ANIMAL_SPECIES = {
  COW: "Cow",
  BUFFALO: "Buffalo",
} as const;

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


export const ANIMAL_SPECIES_OPTIONS = Object.values(ANIMAL_SPECIES);

export type AnimalSpecies =
  (typeof ANIMAL_SPECIES)[keyof typeof ANIMAL_SPECIES];
export const ANIMAL_GENDER_OPTIONS = Object.values(ANIMAL_GENDER);

export type AnimalGender =
  (typeof ANIMAL_GENDER)[keyof typeof ANIMAL_GENDER];
export const ACQUISITION_SOURCE_OPTIONS = Object.values(
  ACQUISITION_SOURCE
);
export type AcquisitionSource =
  (typeof ACQUISITION_SOURCE)[keyof typeof ACQUISITION_SOURCE];
export const ANIMAL_STATUS_OPTIONS = Object.values(ANIMAL_STATUS);

export type AnimalStatus =
  (typeof ANIMAL_STATUS)[keyof typeof ANIMAL_STATUS];