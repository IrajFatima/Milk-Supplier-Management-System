import { body, param, query } from "express-validator";

export const createTemperatureLogValidator = [
    body("storageFacilityId")
        .isInt({ min: 1 })
        .withMessage("Invalid storage facility."),

    body("temperatureReading")
        .notEmpty()
        .withMessage("Temperature reading is required.")
        .isFloat({ min: 2, max: 10 })
        .withMessage("Invalid temperature reading."),

    body("recordingDateTime")
        .notEmpty()
        .withMessage("Recording date and time is required.")
        .isISO8601()
        .withMessage("Invalid recording date and time."),

    body("remarks")
        .optional()
        .isString()
        .withMessage("Invalid remarks.")
];

export const getTemperatureLogByIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid temperature log ID.")
];

export const getTemperatureLogsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than 0."),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100."),

    query("storageFacilityId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid storage facility."),

    query("alertTriggered")
        .optional()
        .isIn(["true", "false"])
        .withMessage("Invalid alertTriggered value."),

    query("recordingType")
        .optional()
        .isIn(["Manual", "Automated Sensor"])
        .withMessage("Invalid recording type."),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search term is too long.")
];
