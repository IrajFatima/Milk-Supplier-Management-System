export const ANIMAL_GENDER = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export const ANIMAL_GENDER_OPTIONS = Object.values(ANIMAL_GENDER);

export type AnimalGender =
  (typeof ANIMAL_GENDER)[keyof typeof ANIMAL_GENDER];