export const ACQUISITION_SOURCE = {
  PURCHASE: "Purchase",
  BORN_ON_FARM: "Born on Farm",
} as const;

export const ACQUISITION_SOURCE_OPTIONS = Object.values(
  ACQUISITION_SOURCE
);

export type AcquisitionSource =
  (typeof ACQUISITION_SOURCE)[keyof typeof ACQUISITION_SOURCE];