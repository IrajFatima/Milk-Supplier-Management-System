import { body, param, query } from "express-validator";

export const createProductionValidator = [
    body("animalId")
        .isInt({ min: 1 })
        .withMessage("Invalid animal."),

    body("productionDate")
        .notEmpty()
        .withMessage("Production date is required.")
        .isISO8601()
        .withMessage("Invalid production date."),

    body("productionShift")
        .notEmpty()
        .withMessage("Production shift is required.")
        .isIn(["Morning", "Evening"])
        .withMessage("Invalid production shift."),

    body("quantityProduced")
        .isFloat()
        .withMessage("Quantity produced must be greater than 0."),

    body("fatPercentage")
        .isFloat()
        .withMessage("Invalid fat percentage."),

    body("snfPercentage")
        .isFloat()
        .withMessage("Invalid SNF percentage."),

    body("milkTemperature")
        .isFloat()
        .withMessage("Invalid milk temperature."),

    body("qualityStatus")
        .notEmpty()
        .withMessage("Quality status is required.")
        .isIn(["Passed", "Failed", "Pending"])
        .withMessage("Invalid quality status."),
];

export const updateProductionValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid production ID."),

    body("productionDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid production date."),

    body("productionShift")
        .optional()
        .isIn(["Morning", "Evening"])
        .withMessage("Invalid production shift."),

    body("quantityProduced")
        .optional()
        .isFloat()
        .withMessage("Quantity produced must be greater than 0."),

    body("fatPercentage")
        .optional()
        .isFloat()
        .withMessage("Invalid fat percentage."),

    body("snfPercentage")
        .optional()
        .isFloat()
        .withMessage("Invalid SNF percentage."),

    body("milkTemperature")
        .optional()
        .isFloat()
        .withMessage("Invalid milk temperature."),

    body("qualityStatus")
        .optional()
        .isIn(["Passed", "Failed", "Pending"])
        .withMessage("Invalid quality status.")
];

export const voidProductionValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid production ID.")
];

export const getProductionByIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid production ID.")
];

export const getProductionValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100."),

    query("animalId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid animal."),

    query("productionDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid production date."),

    query("productionShift")
        .optional()
        .isIn(["Morning", "Evening"])
        .withMessage("Invalid production shift."),

    query("qualityStatus")
        .optional()
        .isIn(["Passed", "Failed", "Pending"])
        .withMessage("Invalid quality status."),

    query("status")
        .optional()
        .isIn(["Active", "Voided"])
        .withMessage("Invalid status."),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search term is too long.")
];