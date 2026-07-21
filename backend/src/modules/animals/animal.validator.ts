import { body, param, query } from "express-validator";
import { ACQUISITION_SOURCE_OPTIONS } from "../../shared/constants/acquisitionSource.js";
import { ANIMAL_GENDER_OPTIONS } from "../../shared/constants/animalGender.js";
import { ANIMAL_SPECIES_OPTIONS } from "../../shared/constants/animalSpecies.js";
import { ANIMAL_STATUS_OPTIONS } from "../../shared/constants/animalStatus.js";

export const createAnimalValidator = [
    body("tagId")
        .trim()
        .notEmpty()
        .withMessage("Tag ID is required.")
        .matches(/^\d{15}$/)
        .withMessage("Tag ID must contain exactly 15 digits."),

    body("name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters."),

    body("species")
        .notEmpty()
        .withMessage("Species is required.")
        .isIn(ANIMAL_SPECIES_OPTIONS)
        .withMessage("Invalid species."),

    body("breed")
        .trim()
        .notEmpty()
        .withMessage("Breed is required."),

    body("gender")
        .notEmpty()
        .withMessage("Gender is required.")
        .isIn(ANIMAL_GENDER_OPTIONS)
        .withMessage("Invalid gender."),

    body("dateOfBirth")
        .notEmpty()
        .withMessage("Date of birth is required.")
        .isISO8601()
        .withMessage("Invalid date of birth.")
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();

            if (dob > today) {
                throw new Error("Date of birth cannot be in the future.");
            }

            return true;
        }),

    body("acquisitionSource")
        .notEmpty()
        .withMessage("Acquisition source is required.")
        .isIn(ACQUISITION_SOURCE_OPTIONS)
        .withMessage("Invalid acquisition source."),

    body("purchaseInformation")
        .optional()
        .trim(),

    body("parentAnimal")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Invalid parent animal."),

    body("currentWeight")
        .optional({ nullable: true })
        .isFloat({ gt: 0 })
        .withMessage("Weight must be greater than 0."),

    body("operationalStatus")
        .optional()
        .isIn(ANIMAL_STATUS_OPTIONS)
        .withMessage("Invalid operational status."),

    body("shedId")
        .notEmpty()
        .withMessage("Shed is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid shed."),
];

export const updateAnimalValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),

    body("name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters."),

    body("breed")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Breed cannot be empty."),
];

export const relocateAnimalValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),

    body("shedId")
        .isInt({ min: 1 })
        .withMessage("Invalid shed."),
];

export const deactivateAnimalValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),

    body("status")
        .isIn(["Sold", "Deceased"])
        .withMessage("Status must be Sold or Deceased."),
];

export const reactivateAnimalValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),

    body("operationalStatus")
        .isIn(
            ANIMAL_STATUS_OPTIONS.filter(
                status => status !== "Sold" && status !== "Deceased"
            )
        )
        .withMessage("Invalid operational status."),

    body("shedId")
        .isInt({ min: 1 })
        .withMessage("Invalid shed."),
];

export const changeAnimalStatusValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),

    body("operationalStatus")
        .isIn(
            ANIMAL_STATUS_OPTIONS.filter(
                status =>
                    status !== "Sold" &&
                    status !== "Deceased"
            )
        )
        .withMessage("Invalid operational status."),
];

export const getAnimalByIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid animal ID."),
];

export const getAnimalsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100."),

    query("species")
        .optional()
        .isIn(ANIMAL_SPECIES_OPTIONS)
        .withMessage("Invalid species."),

    query("gender")
        .optional()
        .isIn(ANIMAL_GENDER_OPTIONS)
        .withMessage("Invalid gender."),

    query("status")
        .optional()
        .isIn(ANIMAL_STATUS_OPTIONS)
        .withMessage("Invalid status."),

    query("shedId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid shed."),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search term is too long."),
];